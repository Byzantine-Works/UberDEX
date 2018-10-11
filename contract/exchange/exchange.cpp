#include <math.h>
#include "exchange.hpp"

#include "exchange_accounts.cpp"

#include <eosiolib/transaction.hpp>

namespace eosio
{
void serialize_uint64(uint64_t num, uint8_t *buf)
{
  for (size_t byte = 0; byte < sizeof(uint64_t); byte++)
  {
    buf[byte] = (uint8_t)(num & 0xFF);
    num = num >> 8;
  }
}
void serialize_uint64(uint64_t num, char *buf)
{
  serialize_uint64(num, (uint8_t *)buf);
}

void serialize_extended_symbol(const extended_symbol &symbol, uint8_t *buf)
{
  static_assert(sizeof(symbol.value) == sizeof(uint64_t), "Unexpected extended_symbol size");
  static_assert(sizeof(symbol.contract) == sizeof(uint64_t), "Unexpected extended_symbol size");
  serialize_uint64(symbol.value, buf);
  serialize_uint64(symbol.contract, buf + sizeof(symbol.value));
}
void serialize_extended_symbol(const extended_symbol &symbol, char *buf)
{
  serialize_extended_symbol(symbol, (uint8_t *)buf);
}

checksum256 get_order_hash(account_name contract, const extended_symbol &token_buy_symbol, int64_t amountbuy,
                           const extended_symbol &token_sell_symbol, int64_t amountsell, uint64_t nonce, account_name maker)
{
  std::vector<char> order_data;
  order_data.reserve(sizeof(contract) + sizeof(token_buy_symbol) + sizeof(amountbuy) +
                     sizeof(token_sell_symbol) + sizeof(amountsell) + sizeof(nonce) + sizeof(maker));
  char buf[std::max(sizeof(extended_symbol), sizeof(uint64_t))];
  serialize_uint64(contract, buf);
  order_data.insert(order_data.end(), buf, buf + sizeof(uint64_t));
  serialize_extended_symbol(token_buy_symbol, buf);
  order_data.insert(order_data.end(), buf, buf + sizeof(token_buy_symbol));
  serialize_uint64((uint64_t)amountbuy, buf);
  order_data.insert(order_data.end(), buf, buf + sizeof(uint64_t));
  serialize_extended_symbol(token_sell_symbol, buf);
  order_data.insert(order_data.end(), buf, buf + sizeof(token_sell_symbol));
  serialize_uint64((uint64_t)amountsell, buf);
  order_data.insert(order_data.end(), buf, buf + sizeof(uint64_t));
  serialize_uint64(nonce, buf);
  order_data.insert(order_data.end(), buf, buf + sizeof(uint64_t));
  serialize_uint64(maker, buf);
  order_data.insert(order_data.end(), buf, buf + sizeof(uint64_t));

  checksum256 order_hash;
  ::sha256(order_data.data(), order_data.size(), &order_hash);
  return order_hash;
}

checksum256 get_trade_hash(const checksum256 &order_hash, int64_t amount, account_name taker, uint64_t trade_nonce)
{
  std::vector<char> trade_data;
  trade_data.reserve(sizeof(order_hash) + sizeof(amount) + sizeof(taker) + sizeof(trade_nonce));
  char buf[sizeof(uint64_t)];
  trade_data.insert(trade_data.end(), (char *)&order_hash, (char *)&order_hash + sizeof(order_hash));
  serialize_uint64((uint64_t)amount, buf);
  trade_data.insert(trade_data.end(), buf, buf + sizeof(uint64_t));
  serialize_uint64(taker, buf);
  trade_data.insert(trade_data.end(), buf, buf + sizeof(uint64_t));
  serialize_uint64(trade_nonce, buf);
  trade_data.insert(trade_data.end(), buf, buf + sizeof(uint64_t));

  checksum256 trade_hash;
  ::sha256(trade_data.data(), trade_data.size(), &trade_hash);
  return trade_hash;
}

/// @abi action
void exchange::withdraw(account_name admin, account_name from, extended_asset quantity, uint64_t nonce)
{
  // Make sure the account that signed this action is an admin.
  require_auth(admin);
  assertIsAdmin(admin);

  require_auth(from);

  eosio_assert(quantity.is_valid(), "invalid quantity");
  eosio_assert(quantity.amount >= 0, "cannot withdraw negative balance"); // Redundant? inline_transfer will fail if quantity is not positive.
  _accounts.adjust_balance_on_admin_withdrawal(from, -quantity, tapos_block_num(), nonce);
  currency::inline_transfer(_self, from, quantity, "withdraw");
  print("exchange.withdraw from the exchange, to ", name{from}, "\n");
}

/// @abi action
void exchange::userwithdraw(account_name user, extended_asset quantity, uint64_t nonce)
{
  require_auth(user);
  eosio_assert(quantity.is_valid(), "invalid quantity");
  eosio_assert(quantity.amount >= 0, "cannot withdraw negative balance"); // Redundant? inline_transfer will fail if quantity is not positive.
  print("exchange.userwithdraw => block_num:", tapos_block_num(), "\r\n");
  auto exchange_settings = settings_object.get();
  _accounts.adjust_balance_on_user_withdrawal(
      user, -quantity, tapos_block_num(), exchange_settings.inactivity_release_period, nonce);
  currency::inline_transfer(_self, user, quantity, "withdraw");
  print("exchange.withdraw from the exchange, to ", name{user}, "\n");
}

/// @abi action
void exchange::getbalances(account_name owner)
{
  _accounts.get_balances(owner);
}

/// @abi action
void exchange::resetex(account_name owner)
{
  //Achtung, Testing only, to be removed for Prod release
  require_auth(owner);
  _accounts.reset_exchange(owner, tapos_block_num());
}

/// @abi action
void exchange::registeruser(account_name user, bytes publickey)
{
  require_auth(user);
  _accounts.register_user(user, publickey);
}

/// @abi action
void exchange::ispkpaired(account_name user)
{
  //returns existing paired key
  //key is stored in binary
  //TODO: @reddy: figure if theres a bin-hex-string impl
  require_auth(user);
  _accounts.get_userregisteredkey(user);
}

/// @abi action
void exchange::trade(account_name admin, int64_t amountbuy, int64_t amountsell, uint64_t nonce, int64_t amount, uint64_t tradenonce,
                     extended_asset tokenbuy, extended_asset tokensell, int64_t makerfee, int64_t takerfee,
                     account_name maker, account_name taker, account_name feeaccount,
                     bytes makersig, bytes takersig)
{
  // TODO(Dima): implement expiration
  // Make sure the account that signed this action is an admin.
  require_auth(admin);
  assertIsAdmin(admin);

  eosio_assert(amountbuy > 0, "amountbuy must be positive!");
  eosio_assert(amountsell > 0, "amountsell must be positive!");
  eosio_assert(amount > 0, "amount must be positive!");
  extended_symbol token_buy_symbol = tokenbuy.get_extended_symbol();
  extended_symbol token_sell_symbol = tokensell.get_extended_symbol();

  checksum256 order_hash = get_order_hash(_self, token_buy_symbol, amountbuy,
                                          token_sell_symbol, amountsell, nonce, maker);
  _accounts.update_order(maker, order_hash, amount, amountbuy, amountsell, makerfee,
                         token_buy_symbol, token_sell_symbol,
                         nonce, tapos_block_num(), makersig);

  checksum256 trade_hash = get_trade_hash(order_hash, amount, taker, tradenonce);
  // TODO(Dima): add a check to make sure the exchange can't charge exuberant fees.
  _accounts.record_trade(taker, trade_hash, amount, amountbuy, amountsell, takerfee,
                         token_buy_symbol, token_sell_symbol,
                         tapos_block_num(), takersig);

  _accounts.adjust_fees_balance(feeaccount, token_buy_symbol, token_sell_symbol,
                                makerfee, takerfee, tapos_block_num());
}

void exchange::invalorders(account_name admin, account_name user, uint64_t beforenonce)
{
  // Make sure the account that signed this action is an admin.
  require_auth(admin);
  assertIsAdmin(admin);

  _accounts.invalidate_orders_before(user, beforenonce);
}

void exchange::setrelprd(account_name admin, int64_t releaseperiod)
{
  // Make sure the account that signed this action is an admin.
  require_auth(admin);
  assertIsAdmin(admin);

  eosio_assert(releaseperiod >= 0, "User funds release period must not be negative.");
  eosio_assert(releaseperiod <= MAX_INACTIVITY_RELEASE_PERIOD_BLOCKS, "User funds release period must be reasonable.");

  settings current_settings = settings_object.get_or_create(_self);
  current_settings.inactivity_release_period = releaseperiod;
  settings_object.set(current_settings, _self);
  print("Setting user funds inactivity release period to ", releaseperiod, " blocks\n");
}

void exchange::setadmin(account_name account, bool isadmin)
{
  // Managing admins requires the exchange signature.
  require_auth(_self);

  settings current_settings = settings_object.get_or_default();
  if (isadmin) {
    current_settings.admins.insert(account);
    print("Made  account ", account, " an admin\n");
  } else {
    current_settings.admins.erase(account);
    print("Removed account ", account, " from being an admin\n");
  }
  settings_object.set(current_settings, _self);
}

void exchange::onTransfer(const currency::transfer &t, account_name code)
{
  if (t.to == _self)
  {
    auto a = extended_asset(t.quantity, code);
    eosio_assert(a.is_valid(), "invalid quantity in transfer");
    eosio_assert(a.amount != 0, "zero quantity is disallowed in transfer");
    eosio_assert(a.amount > 0 || t.memo == "withdraw", "withdrew tokens without withdraw in memo");
    eosio_assert(a.amount < 0 || t.memo == "deposit", "received tokens without deposit in memo");
    print("exchange.onTransfer => block_num:", tapos_block_num(), "\r\n");
    _accounts.adjust_balance_on_deposit(t.from, a, tapos_block_num());
    print("exchange.onTransfer to the exchange, from ", name{t.from}, " amount=", a.amount, "\n");
  }
}

void exchange::assertIsAdmin(account_name account)
{
  if (account == _self) {
    // It is the exchange account, all good.
    return;
  }
  settings current_settings = settings_object.get_or_default();
  eosio_assert(current_settings.admins.count(account) > 0, "Account must be an admin.");
}

#define N(X) ::eosio::string_to_name(#X)

void exchange::apply(account_name contract, account_name act)
{
  if (act == N(transfer))
  {
    onTransfer(unpack_action_data<currency::transfer>(), contract);
    return;
  }

  if (contract != _self)
    return;

  auto &thiscontract = *this;
  switch (act)
  {
    EOSIO_API(exchange, (withdraw)(userwithdraw)(registeruser)(trade)(getbalances)(resetex)
                        (ispkpaired)(invalorders)(setrelprd)(setadmin))
  };
}
} // namespace eosio

extern "C"
{
  [[noreturn]] void apply(uint64_t receiver, uint64_t code, uint64_t action) {
    eosio::exchange ex(receiver);
    ex.apply(code, action);
    eosio_exit(0);
  }
}
