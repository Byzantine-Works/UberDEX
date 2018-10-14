package io.vertx.uberdex.trader.impl;

import io.vertx.core.json.JsonObject;
import io.vertx.uberdex.portfolio.PortfolioService;

import java.util.Map;
import java.util.Random;
import java.util.ArrayList;
import java.util.Collections;

/**
 * A small utility class to initialize the compulsive traders and implement the
 * stupid trading logic.
 */
public class TraderUtils {

  private final static Random RANDOM = new Random();

  public static String pickACompany() {
    ArrayList<String> tokens = new ArrayList<String>();
    tokens.add("SYS");
    tokens.add("ABC");
    tokens.add("BLACK");
    Collections.shuffle(tokens);
    return tokens.get(0);
    // int choice = RANDOM.nextInt(2);
    // switch (choice) {
    // case 0:
    // return "ABC";
    // case 1:
    // return "SYS";
    // case 2:
    // return "BLACK";
    // default:
    // return "UNKNOWN";
    // }
  }

  public static boolean timeToSell() {
    return RANDOM.nextBoolean();
  }

  public static int pickANumber() {
    return RANDOM.nextInt(6) + 1;
  }

  public static void dumbTradingLogic(String company, int numberOfShares, PortfolioService portfolio,
      JsonObject quote) {
    if (quote.getString("name").equals(company)) {
      if (TraderUtils.timeToSell()) {
        portfolio.sell(numberOfShares, quote, p -> {
          if (p.succeeded()) {
            System.out.println("Sold " + numberOfShares + " of " + company + "!");
          } else {
            System.out.println("D'oh, failed to sell " + numberOfShares + " of " + company + " : " + p.cause());
          }
        });
      } else {
        portfolio.buy(numberOfShares, quote, p -> {
          if (p.succeeded()) {
            System.out.println("Bought " + numberOfShares + " of " + company + " !");
          } else {
            System.out.println("D'oh, failed to buy " + numberOfShares + " of " + company + " : " + p.cause());
          }
        });
      }
    }
  }

  /**
   * Version called from Groovy where json are maps.
   *
   * @param company        the company
   * @param numberOfShares the number of share to buy or sell
   * @param portfolio      the portfolio service
   * @param quote          the quote
   */
  public static void dumbTradingLogic(String company, int numberOfShares, PortfolioService portfolio,
      Map<String, Object> quote) {
    JsonObject json = new JsonObject(quote);
    dumbTradingLogic(company, numberOfShares, portfolio, json);
  }
}
