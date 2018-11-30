var config = {};
config.localtestnet = {
  eosVersion: '4f4e5c22',
  chainId: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f',
  httpEndpoint: 'http://127.0.0.1:8888',
  debug: false,
  verbose: false
};

config.byzantinetestnet = {
  eosVersion: 'bf28f8bb',
  chainId: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f',
  httpEndpoint: 'http://13.52.54.111:8888',
  debug: false,
  verbose: false,
  latency: 200
};
config.byzantinetestnetaccount = {
  EXCHANGE_ACCOUNT: "exchange",
  ADMIN_ACCOUNT: "admin",
  LEDGER_ACCOUNT: "ledger",
  MAKER_ACCOUNT: "maker1",
  TAKER_ACCOUNT: "taker1",
  eosTokenContract: 'eosio.token',
  eosExchangeContract: 'exchange'
};
module.exports = config;