#include <map>
#include <exception>
#include <string>
#include <cstdint>
#include <iostream>
#include <math.h>
#include <fc/exception/exception.hpp>

#include <fc/time.hpp>
#include <fc/log/logger.hpp>


using namespace std;


typedef __uint128_t uint128_t;
typedef string  account_name;
typedef string  symbol_type;

static const symbol_type exchange_symbol = "EXC";



void eosio_assert( bool test, const string& msg ) {
   if( !test ) throw std::runtime_error( msg );
}




void print_exchange( const exchange& e ) {
   std::cerr << "\n-----------------------------\n";
   std::cerr << "account_name: " <<  e.account_name  << "\n";
   std::cerr << "\n-----------------------------\n";
}


int main( int argc, char** argv ) {
 //  std::cerr << "root: " << double(root.numerator())/root.denominator() << "\n";


   exchange_state state;
   state.supply = 100000000000ll;
   //state.base.weight  = state.total_weight / 2.;
   state.base.balance.amount = 100000000;
   state.base.balance.symbol = "USD";
   state.base.weight = .49;
   //state.quote.weight = state.total_weight / 2.;
   state.quote.balance.amount = state.base.balance.amount;
   state.quote.balance.symbol = "BTC";
   state.quote.weight = .51;

   print_state( state );

   //state = convert( state, "dan", asset{ 100, "USD"}, asset{ 0, "BTC" } );

   auto start = fc::time_point::now();
   for( uint32_t i = 0; i < 10000; ++i ) {
     if( rand() % 2 == 0 )
        state = convert( state, "dan", asset{ token_type(uint32_t(rand())%maxtrade), "USD"}, asset{ 0, "BTC" } );
     else
        state = convert( state, "dan", asset{ token_type(uint32_t(rand())%maxtrade), "BTC"}, asset{ 0, "USD" } );
   }
   for( const auto& item : state.output ) {
      if( item.second > 0 ) {
         if( item.first.symbol == "USD" )
           state = convert( state, "dan", asset{ item.second, item.first.symbol}, asset{ 0, "BTC" } );
         else
           state = convert( state, "dan", asset{ item.second, item.first.symbol}, asset{ 0, "USD" } );
        break;
      }
   }
   print_state( state );

   auto end = fc::time_point::now();
   wdump((end-start));


   return 0;
}



