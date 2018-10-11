#include <eosiolib/types.hpp>
#include <eosiolib/contract.hpp>
#include <eosiolib/crypto.h>
#include <eosiolib/currency.hpp>
#include <eosiolib/singleton.hpp>
#include <boost/container/flat_map.hpp>
#include <cmath>

#include "exchange_accounts.hpp"

namespace eosio
{

/**
    *  This contract enables users to create an exchange between any pair of
    *  standard currency types. A new exchange is created by funding it with
    *  an equal value of both sides of the order book and giving the issuer
    *  the initial shares in that orderbook.
    *
    *  To prevent exessive rounding errors, the initial deposit should include
    *  a sizeable quantity of both the base and quote currencies and the exchange
    *  shares should have a quantity 100x the quantity of the largest initial
    *  deposit.
    *
    *  Users must deposit funds into the exchange before they can trade on the
    *  exchange.
    *
    *  Each time an exchange is created a new currency for that exchanges market
    *  maker is also created. This currencies supply and symbol must be unique and
    *  it uses the currency contract's tables to manage it.
    */

class exchange : public eosio::contract
{
public:
  exchange(account_name self)
      : eosio::contract(self),
        _accounts(self),
        settings_object(_self, _self)
  {
  }

  // Doesn't seem like the deposit method from the eosio sample exchange contract
  // can be successfully called directly on the contract
  // without messing with user permissions, which we can't do in production.
  // https://github.com/EOSIO/eos/issues/3013
  // https://github.com/EOSIO/eos/issues/3847

  // Withdraws user funds to the user account. This action must be signed by the user performing
  // the withdrawal as well as the exchange.
  void withdraw(account_name admin, account_name from, extended_asset quantity, uint64_t nonce);
  // Withdraws user funds to the user account. This action must be signed by the user performing
  // the withdrawal, but does not require the exchange signature. The withdrawal is allowed
  // only after a certain amount of time has passed since the last transaction performed by the user.
  void userwithdraw(account_name user, extended_asset quantity, uint64_t nonce);
  void ispkpaired(account_name user);
  void registeruser(account_name user, bytes publickey);
  // TODO(Dima): Add expiration.
  void trade(account_name admin, int64_t amountbuy, int64_t amountsell, uint64_t nonce, int64_t amount, uint64_t tradenonce,
             extended_asset tokenbuy, extended_asset tokensell, int64_t makerfee, int64_t takerfee,
             account_name maker, account_name taker, account_name feeaccount,
             bytes makersig, bytes takersig);

  void invalorders(account_name admin, account_name user, uint64_t beforenonce);

  void setrelprd(account_name admin, int64_t releaseperiod);
 
  // Makes the provided account an admin or removes it from being an admin.
  void setadmin(account_name account, bool isadmin);

  void apply(account_name contract, account_name act);

  // Debug only methods exposed through the ABI.
  void getbalances(account_name owner); // Debug only, to be removed from the published contract.
  void resetex(account_name owner);     // Achtung, Testing only, to be removed for Prod release

private:
  void onTransfer(const currency::transfer &t, account_name code);
 
  // Asserts that the provided account is either the exchange account or an admin.
  void assertIsAdmin(account_name account);

private:
  exchange_accounts _accounts;

  // Maximum inactivity release period in blocks that the exchange admins can set (30 days).
  static constexpr int64_t MAX_INACTIVITY_RELEASE_PERIOD_BLOCKS = 30 * 24 * 60 * 60 * 2;
  struct settings {
    int64_t inactivity_release_period = MAX_INACTIVITY_RELEASE_PERIOD_BLOCKS;
    flat_set<account_name> admins;
  };

  typedef eosio::singleton<N(settings2), settings> exsettings;

  exsettings settings_object;
};
} // namespace eosio
