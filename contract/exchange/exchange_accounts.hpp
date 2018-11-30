#pragma once
#include <boost/container/flat_set.hpp>
#include <eosiolib/asset.hpp>
#include <eosiolib/multi_index.hpp>

namespace eosio
{

using boost::container::flat_map;
using boost::container::flat_set;

/**
    *  Each user has their own account with the exchange contract that keeps track
    *  of how much a user has on deposit for each extended asset type. The assumption
    *  is that storing a single flat map of all balances for a particular user will
    *  be more practical than breaking this down into a multi-index table sorted by
    *  the extended_symbol.  
    */
struct exaccount
{
    account_name owner;
    flat_map<extended_symbol, int64_t> balances;
    flat_set<checksum256> executed_trades;
    flat_map<checksum256, int64_t> order_fills;
    int64_t lock_block_number = 0;
    uint64_t invalid_order_nonce = 0;
    uint64_t last_withdrawal_nonce = 0;
    std::vector<char> public_key;

    uint64_t primary_key() const { return owner; }
    EOSLIB_SERIALIZE(exaccount, (owner)(balances)(executed_trades)(order_fills)(lock_block_number)(invalid_order_nonce)(public_key)(last_withdrawal_nonce))
};

typedef eosio::multi_index<N(exaccounts), exaccount> exaccounts;

/**
    *  Provides an abstracted interface around storing balances for users. This class
    *  caches tables to make multiple accesses effecient.
    */
struct exchange_accounts
{
    exchange_accounts(account_name code) : _this_contract(code) {}

    void adjust_balance_on_deposit(account_name owner, extended_asset delta, int64_t block_number);
    void adjust_balance_on_admin_withdrawal(account_name owner, extended_asset delta, int64_t block_number, uint64_t nonce);
    void adjust_balance_on_user_withdrawal(
        account_name owner, extended_asset delta, int64_t block_number, int64_t funds_release_lockup_period, uint64_t nonce);
    void adjust_fees_balance(account_name fees_account,
                             const extended_symbol &token_buy_symbol, const extended_symbol &token_sell_symbol,
                             int64_t maker_fee, int64_t taker_fee, int64_t block_number);
    void get_balances(account_name owner, int64_t current_block_number);
    void record_trade(account_name taker, const checksum256 &trade_hash,
                      int64_t amount, int64_t amount_buy, int64_t amount_sell, int64_t taker_fee,
                      const extended_symbol &token_buy_symbol, const extended_symbol &token_sell_symbol,
                      int64_t block_number, int64_t trade_lock_period, bytes taker_signature);
    void update_order(account_name maker, const checksum256 &order_hash,
                      int64_t amount, int64_t amount_buy, int64_t amount_sell, int64_t maker_fee,
                      const extended_symbol &token_buy_symbol, const extended_symbol &token_sell_symbol,
                      uint64_t nonce, int64_t block_number, int64_t trade_lock_period, bytes maker_signature);
    void register_user(account_name user, const std::vector<char> &public_key);
    void invalidate_orders_before(account_name user, uint64_t before_nonce);

    void lock_user_account(account_name user, int64_t current_block_number);
    void unlock_user_account(account_name user);

    // Debug methods, to be removed from the final contract.
    void reset_exchange(account_name owner, int64_t block_number); //Achtung, Testing only, to be removed for Prod release
    void get_userregisteredkey(account_name user);

  private:
    void adjust_balance_helper(account_name owner, extended_asset delta, exaccount &exa);
    void assert_trades_allowed(int64_t lock_block_number, int64_t current_block_number, int64_t trade_lock_period);
    account_name _this_contract;
    /**
          *  Keep a cache of all accounts tables we access
          */
    flat_map<account_name, exaccounts> exaccounts_cache;
};
} // namespace eosio
