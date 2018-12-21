#include <eosiolib/asset.hpp>

#include "exchange_accounts.hpp"

namespace eosio
{

int64_t safe_mul(int64_t a, int64_t b)
{
  eosio_assert(a >= 0 && b >= 0, "Negative amount");
  int64_t c = a * b;
  eosio_assert(a == 0 || c / a == b, "Product computed incorrectly");
  eosio_assert(c >= 0, "Negative amount");
  return c;
}

int64_t safe_sub(int64_t a, int64_t b)
{
  eosio_assert(b <= a, "Negative amount");
  int64_t c = a - b;
  return c;
}

int64_t safe_add(int64_t a, int64_t b)
{
  eosio_assert(a >= 0 && b >= 0, "Negative amount");
  int64_t c = a + b;
  eosio_assert(c >= a && c >= b, "Integer overflow");
  eosio_assert(c >= 0, "Negative amount");
  return c;
}

void exchange_accounts::adjust_balance_helper(
    account_name owner, extended_asset delta, exaccount &exa)
{
  const auto &b = exa.balances[delta.get_extended_symbol()] += delta.amount;
  eosio_assert(b >= 0, "overdrawn balance 2");
  print("New exchange balance for ", name{owner}, " = ", b, "\n");
}

void exchange_accounts::adjust_balance_on_admin_withdrawal(
    account_name owner, extended_asset delta, int64_t block_number, uint64_t nonce)
{
  exaccounts existing_accounts(_this_contract, _this_contract);
  auto itr = existing_accounts.find(owner);
  eosio_assert(itr != existing_accounts.end(), "Exchange account must exist to perform withdrawals");

  // Validate that the withdrawal nonce is greater than the last recorded withdrawal nonce.
  eosio_assert(nonce > itr->last_withdrawal_nonce, "Invalid withdrawal nonce.");

  // Update the balance and nonce.
  existing_accounts.modify(itr, _this_contract, [&](auto &exa) {
    adjust_balance_helper(owner, delta, exa);
    exa.last_withdrawal_nonce = nonce;
  });
}

void exchange_accounts::adjust_balance_on_user_withdrawal(
    account_name owner, extended_asset delta, int64_t block_number, int64_t funds_release_lockup_period, uint64_t nonce)
{
  exaccounts existing_accounts(_this_contract, _this_contract);
  auto itr = existing_accounts.find(owner);
  eosio_assert(itr != existing_accounts.end(), "Exchange account must exist to perform withdrawals");

  // Since this is a withdrawal transaction that has not been signed by the exchange, make sure enough
  // time has passed since the last user transaction.
  print("block_number => ", block_number, ":: lock_block_number => ", itr->lock_block_number, ":: ", "funds_release_lockup_period =>", funds_release_lockup_period, "\r\n");
  eosio_assert((itr->lock_block_number > 0) && (block_number > itr->lock_block_number + funds_release_lockup_period),
               "Not enough time has passed since the account lock to allow user withdrawals.");

  // Validate that the withdrawal nonce is greater than the last recorded withdrawal nonce.
  eosio_assert(nonce > itr->last_withdrawal_nonce, "Invalid withdrawal nonce.");

  // Update the balance and nonce.
  existing_accounts.modify(itr, _this_contract, [&](auto &exa) {
    adjust_balance_helper(owner, delta, exa);
    exa.last_withdrawal_nonce = nonce;
  });
}

void exchange_accounts::adjust_balance_on_deposit(account_name owner, extended_asset delta, int64_t block_number)
{
  // TODO(Dima): switch back to using exaccounts_cache once it works.
  // The most likely culprit is https://github.com/EOSIO/eos/issues/4577
  exaccounts existing_accounts(_this_contract, _this_contract);
  auto itr = existing_accounts.find(owner);
  if (itr == existing_accounts.end())
  {
    existing_accounts.emplace(owner, [&](auto &exa) {
      exa.owner = owner;
      exa.balances[delta.get_extended_symbol()] = delta.amount;
      eosio_assert(delta.amount >= 0, "overdrawn balance 1");
      print("New exchange balance for ", name{owner}, " = ", delta.amount, "\n");
    });
  }
  else
  {
    existing_accounts.modify(itr, _this_contract, [&](auto &exa) {
      adjust_balance_helper(owner, delta, exa);
    });
  }

  /*
    auto table = exaccounts_cache.find( owner );
    if( table == exaccounts_cache.end() ) {
      print("adjust_balance before: did not find account in cache for user ", name{owner}, "\n");
       table = exaccounts_cache.emplace( owner, exaccounts(_this_contract, owner )  ).first;
    }
    auto useraccounts = table->second.find( owner );
    if( useraccounts == table->second.end() ) {
       table->second.emplace( owner, [&]( auto& exa ){
         exa.owner = owner;
         exa.balances[delta.get_extended_symbol()] = delta.amount;
         eosio_assert( delta.amount >= 0, "overdrawn balance 1" );
       });
    } else {
       table->second.modify( useraccounts, 0, [&]( auto& exa ) {
         const auto& b = exa.balances[delta.get_extended_symbol()] += delta.amount;
         eosio_assert( b >= 0, "overdrawn balance 2" );
       });
    }*/
}

void exchange_accounts::adjust_fees_balance(account_name fees_account,
                                            const extended_symbol &token_buy_symbol, const extended_symbol &token_sell_symbol,
                                            int64_t maker_fee, int64_t taker_fee, int64_t block_number)
{
  exaccounts existing_accounts(_this_contract, _this_contract);
  auto itr = existing_accounts.find(fees_account);
  if (itr == existing_accounts.end())
  {
    existing_accounts.emplace(fees_account, [&](auto &exa) {
      exa.owner = fees_account;
      exa.balances[token_buy_symbol] = maker_fee;
      exa.balances[token_sell_symbol] = taker_fee;
      print("New fees account balance for ", name{fees_account}, ", symbol ", token_buy_symbol, " = ", taker_fee, ", symbol ", token_sell_symbol, " = ", maker_fee, "\n");
    });
  }
  else
  {
    existing_accounts.modify(itr, _this_contract, [&](auto &exa) {
      const auto &b1 = exa.balances[token_buy_symbol] += maker_fee;
      eosio_assert(b1 >= 0, "overdrawn balance 2");
      const auto &b2 = exa.balances[token_sell_symbol] += taker_fee;
      eosio_assert(b2 >= 0, "overdrawn balance 3");
      print("New fees account balance for ", name{fees_account}, ", symbol ", token_buy_symbol, " = ", b1, ", symbol ", token_sell_symbol, " = ", b2, "\n");
    });
  }
}

//TODO: @reddy: Figure if bin-hex is a possibility
void exchange_accounts::get_userregisteredkey(account_name user)
{
  //print("Public Key for account: ", name{user});
  exaccounts existing_accounts(_this_contract, _this_contract);
  auto itr = existing_accounts.find(user);
  eosio_assert(itr != existing_accounts.end(), "User account should exist to query for public_key");

  if (itr != existing_accounts.end())
  // {
  //   exaccount exa = existing_accounts.get(user);
  //   std::vector<char> buffer(exa.public_key.begin(), exa.public_key.end());
  //   char bufHex[34];
  //   print("key size", buffer.size());
  //   for (int j = 0; j < buffer.size(); j++)
  //     sprintf(&bufHex[j], "%20X", buffer[j]);
  // }
  {
    exaccount exa = existing_accounts.get(user);
    std::string pk(exa.public_key.begin(), exa.public_key.end());
    print("{'public_key_exists':", exa.public_key.size() > 0, "}"); //",'public_key':", pk, "}");
  }
  else
  {
    print("{'public_key_exists':", false, "}");
  }
}

//Print balances to console in pseudo-json for verification
void exchange_accounts::get_balances(account_name owner, int64_t current_block_number)
{
  //print("Balances for account: ", name{owner});
  exaccounts existing_accounts(_this_contract, _this_contract);
  auto itr = existing_accounts.find(owner);
  if (itr != existing_accounts.end())
  {
    // if (itr->lock_block_number == 0) {
    //   print("Account is unlocked.\n");
    // } else {
    //   print("Account has been locked for ", current_block_number - itr->lock_block_number, " blocks.\n");
    // }
    for (auto balance : itr->balances)
    {
      print("{'account':'", name{owner}, "','token':'", balance.first, "','amount':", balance.second, "}");
    }
  }
}

void exchange_accounts::record_trade(account_name taker, const checksum256 &trade_hash,
                                     int64_t amount, int64_t amount_buy, int64_t amount_sell, int64_t taker_fee, int64_t maker_fee,
                                     const extended_symbol &token_buy_symbol, const extended_symbol &token_sell_symbol,
                                     int64_t block_number, int64_t trade_lock_period, bytes taker_signature)
{
  exaccounts existing_accounts(_this_contract, _this_contract);
  auto itr = existing_accounts.find(taker);
  eosio_assert(itr != existing_accounts.end(), "Account/exchange balance must exist to perform a trade");
  existing_accounts.modify(itr, _this_contract, [&](auto &existing_account) {
    assert_trades_allowed(existing_account.lock_block_number, block_number, trade_lock_period);
    // Validate the trade.
    auto &executed_trades = existing_account.executed_trades;
    auto trade_itr = executed_trades.find(trade_hash);
    eosio_assert(trade_itr == executed_trades.end(), "This trade has been previously executed.");
    executed_trades.insert(trade_hash);

    // Verify order signature
    eosio_assert(existing_account.public_key.size() > 0, "Taker account/public key must be registered before placing an order.");
    ::assert_recover_key(&trade_hash, &taker_signature[0], taker_signature.size(),
                         &existing_account.public_key[0], existing_account.public_key.size());

    // Update token balances.
    auto &balances = existing_account.balances;
    eosio_assert(balances[token_buy_symbol] >= amount, "Insufficient taker's balance for the trade");
    balances[token_buy_symbol] = safe_add(balances[token_buy_symbol], amount);
    balances[token_sell_symbol] = safe_sub(balances[token_sell_symbol], amount_sell);
    balances[token_buy_symbol] = safe_sub(balances[token_buy_symbol], maker_fee);
    //balances[token_sell_symbol] = safe_sub(balances[token_sell_symbol], taker_fee);
    balances[token_sell_symbol] = safe_sub(balances[token_sell_symbol], safe_mul(amount_sell, amount) / amount_buy);
  });
}

//Achtung, Testing only, to be removed for Prod release
//port/erase order data, trade data, exchange accounts after refund balances?
//Strictly used for test suite -- could potentially alter this for porting accounts to newer contract versions?
void exchange_accounts::reset_exchange(account_name owner, int64_t blocknumber)
{
  print("{'account':'", name{owner}, "','block':", blocknumber, "}");
  exaccounts existing_accounts(_this_contract, _this_contract);
  for (auto itr = existing_accounts.begin(); itr != existing_accounts.end();) // && count != iLimit;)
  {
    itr = existing_accounts.erase(itr);
    //count++;// controlled erasure if accounts exceed the mu seconds chain ceiling
  }
}

void exchange_accounts::update_order(account_name maker, const checksum256 &order_hash,
                                     int64_t amount, int64_t amount_buy, int64_t amount_sell, int64_t maker_fee,
                                     const extended_symbol &token_buy_symbol, const extended_symbol &token_sell_symbol,
                                     uint64_t nonce, int64_t block_number, int64_t trade_lock_period, bytes maker_signature)
{
  exaccounts existing_accounts(_this_contract, _this_contract);
  auto itr = existing_accounts.find(maker);
  eosio_assert(itr != existing_accounts.end(), "Account/exchange balance must exist to perform a trade");
  existing_accounts.modify(itr, _this_contract, [&](auto &existing_account) {
    assert_trades_allowed(existing_account.lock_block_number, block_number, trade_lock_period);
    eosio_assert(existing_account.invalid_order_nonce <= nonce, "This order has been invalidated");
    auto &order_fills = existing_account.order_fills;

    // Verify order signature
    eosio_assert(existing_account.public_key.size() > 0, "Maker account/public key must be registered before placing an order.");
    ::assert_recover_key(&order_hash, &maker_signature[0], maker_signature.size(),
                         &existing_account.public_key[0], existing_account.public_key.size());

    // Validate and update the order.
    auto order_itr = order_fills.find(order_hash);
    int64_t order_fill = 0;
    if (order_itr != order_fills.end())
    {
      print("Order previously partially filled.\n");
      order_fill = order_itr->second;
    }
    else
    {
      print("Order has not been previously partially filled.\n");
    }
    int64_t new_fill = safe_add(order_fill, amount);
    print("Amount is => ", amount, " Newfill is => ", new_fill);
    //eosio_assert(new_fill <= amount_buy, "Exceeded the order amount\n");
    order_fills[order_hash] = new_fill;

    // Update token balances.
    auto &balances = existing_account.balances;
    eosio_assert(balances[token_sell_symbol] >= (safe_mul(amount_sell, amount) / amount_buy),
                 "Insufficient maker's balance for the trade");
    balances[token_buy_symbol] = safe_add(balances[token_buy_symbol], amount);
    balances[token_sell_symbol] = safe_sub(balances[token_sell_symbol], safe_mul(amount_sell, amount) / amount_buy);
    balances[token_sell_symbol] = safe_sub(balances[token_sell_symbol], maker_fee);
  });
}

void exchange_accounts::register_user(account_name user, const std::vector<char> &public_key)
{
  exaccounts existing_accounts(_this_contract, _this_contract);
  auto itr = existing_accounts.find(user);
  if (itr == existing_accounts.end())
  {
    existing_accounts.emplace(user, [&](auto &exa) {
      exa.owner = user;
      exa.public_key = public_key;
    });
  }
  else
  {
    existing_accounts.modify(itr, _this_contract, [&](auto &exa) {
      exa.public_key = public_key;
    });
  }
}

void exchange_accounts::invalidate_orders_before(account_name user, uint64_t before_nonce)
{
  exaccounts existing_accounts(_this_contract, _this_contract);
  auto itr = existing_accounts.find(user);
  eosio_assert(itr != existing_accounts.end(), "Account must exist to invalidate orders.");
  eosio_assert(before_nonce > itr->invalid_order_nonce, "The new order invalidation nonce must be greater than the old one.");
  existing_accounts.modify(itr, _this_contract, [&](auto &exa) {
    exa.invalid_order_nonce = before_nonce;
  });
}

void exchange_accounts::assert_trades_allowed(int64_t lock_block_number, int64_t current_block_number, int64_t trade_lock_period)
{
  // Allow transactions for a specified period of time (1 hour by default) after the user account has been locked.
  eosio_assert((lock_block_number == 0) || (current_block_number - lock_block_number) <= trade_lock_period,
               "Transactions are not allowed starting one hour after the account has been locked.");
}

void exchange_accounts::lock_user_account(account_name user, int64_t current_block_number)
{
  exaccounts existing_accounts(_this_contract, _this_contract);
  auto itr = existing_accounts.find(user);
  eosio_assert(itr != existing_accounts.end(), "Account must exist in order to lock it.");
  existing_accounts.modify(itr, _this_contract, [&](auto &exa) {
    exa.lock_block_number = current_block_number;
  });
}

void exchange_accounts::unlock_user_account(account_name user)
{
  exaccounts existing_accounts(_this_contract, _this_contract);
  auto itr = existing_accounts.find(user);
  eosio_assert(itr != existing_accounts.end(), "Account must exist in order to unlock it.");
  existing_accounts.modify(itr, _this_contract, [&](auto &exa) {
    exa.lock_block_number = 0;
  });
}
} // namespace eosio
