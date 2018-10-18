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
  // the withdrawal, but does not require the exchange signature. Withdrawals are only allowed
  // after a certain amount of time (24 hours by default) has passed after the account has
  // been locked up by the user calling the lock action on the contract during which time trades
  // aren't allowed (except for the first hour by default).
  void userwithdraw(account_name user, extended_asset quantity, uint64_t nonce);

  // Registers the user public key for trade and order signature verification.
  // Trades and orders are signed in the IDEX UI as arbitrary data blobs and are validated in the contract.
  // This action registers the user public key to perform arbitrary blob signature validation inside the contract.
  // This action requires user's signature.
  void registeruser(account_name user, bytes publickey);

  // Performs a trade and updates the order fill. The trade and order parameters are signed by the taker and maker respectively
  // as arbitrary data blobs. The signatures are validated in this action and if the available balances check out and trades
  // aren't disallowed for either party, the trade is executed.
  // The action must be signed by the exchange admin.
  // TODO(Dima): Add expiration.
  void trade(account_name admin, int64_t amountbuy, int64_t amountsell, uint64_t nonce, int64_t amount, uint64_t tradenonce,
             extended_asset tokenbuy, extended_asset tokensell, int64_t makerfee, int64_t takerfee,
             account_name maker, account_name taker, account_name feeaccount,
             bytes makersig, bytes takersig);

  // Invalidates all user's orders with the nonce smaller than the beforenonce parameter.
  void invalorders(account_name admin, account_name user, uint64_t beforenonce);

  // Makes the provided account an admin or removes it from being an admin.
  void setadmin(account_name account, bool isadmin);

  // Controls the escape hatch parameters by the exchange admin (see the description of lock/unlock actions).
  void setlockparam(account_name admin, int64_t tradelockperiod, int64_t fundsreleaseperiod);

  // This action allows the user to enable the escape hatch. Trades will be disabled for the duration
  // of the lock except for the first hour (or as set by tradelockperiod in setlockparam action). 24 hours after the lock
  // (or as set by fundsreleaseperiod in setlockparam action) the user will be able to withdraw funds without requiring
  // the exchange signature by calling the userwithdraw action on the contract.
  void lock(account_name user);

  // Unlocks the account that was locked by the lock action (closes the escape hatch). From this point on,
  // withdrawal requests must be signed by both the user and the exchange and trades are allowed.
  void unlock(account_name user);

  void apply(account_name contract, account_name act);

  // Debug only methods exposed through the ABI for unit testing/debugging. To be removed from the final contract.
  void ispkpaired(account_name user);
  void getbalances(account_name owner); // Debug only, to be removed from the published contract.
  void resetex(account_name owner);     // Achtung, Testing only, to be removed for Prod release

private:
  void onTransfer(const currency::transfer &t, account_name code);
 
  // Asserts that the provided account is either the exchange account or an admin.
  void assertIsAdmin(account_name account);

private:
  exchange_accounts _accounts;

  // Maximum lock up period for the escape hatch after the account lock (in blocks)
  // that the exchange admins can set: 7 days.
  static constexpr int64_t MAX_USER_FUNDS_LOCKUP_PERIOD_BLOCKS = 7 * 24 * 60 * 60 * 2;
  struct settings {
    // Time period since the account lock during which trades are still allowed (1 hour default).
    // After this period of time trades will be disabled for the user.
    int64_t trade_lock_period = 1 * 60 * 60 * 2;
    // The default lock up time for user funds release after the account lock is 24 hours.
    // Can be changed by exchange admins up to MAX_USER_FUNDS_LOCKUP_PERIOD_BLOCKS.
    int64_t funds_release_period = 24 * 60 * 60 * 2;
    // Accounts that can perform admin functions.
    flat_set<account_name> admins;
  };

  typedef eosio::singleton<N(settings3), settings> exsettings;

  exsettings settings_object;
};
} // namespace eosio
