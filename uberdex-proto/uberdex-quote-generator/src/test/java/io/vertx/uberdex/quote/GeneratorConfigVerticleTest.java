package io.vertx.uberdex.quote;

import io.vertx.core.DeploymentOptions;
import io.vertx.core.Vertx;
import io.vertx.core.json.JsonObject;
import org.junit.Test;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;

import static com.jayway.awaitility.Awaitility.await;
import static org.assertj.core.api.Assertions.assertThat;

/**
 * @author M.Reddy
 */
public class GeneratorConfigVerticleTest {

  @Test
  public void test() throws IOException {
    byte[] bytes = Files.readAllBytes(new File("src/test/resources/config.json").toPath());
    JsonObject config = new JsonObject(new String(bytes, "UTF-8"));

    Vertx vertx = Vertx.vertx();

    List<JsonObject> abc = new ArrayList<>();
    List<JsonObject> sys = new ArrayList<>();
    List<JsonObject> black = new ArrayList<>();

    vertx.eventBus().consumer(GeneratorConfigVerticle.ADDRESS, message -> {
      JsonObject quote = (JsonObject) message.body();
      System.out.println(quote.encodePrettily());
      assertThat(quote.getDouble("bid")).isGreaterThan(0);
      assertThat(quote.getDouble("ask")).isGreaterThan(0);
      assertThat(quote.getInteger("volume")).isGreaterThan(0);
      assertThat(quote.getInteger("shares")).isGreaterThan(0);
      switch (quote.getString("symbol")) {
        case "ABC":
          abc.add(quote);
          break;
        case "SYS":
          sys.add(quote);
          break;
        case "BLACK":
          black.add(quote);
          break;
      }
    });

    vertx.deployVerticle(GeneratorConfigVerticle.class.getName(), new DeploymentOptions().setConfig(config));

    await().until(() -> abc.size() > 10);
    await().until(() -> sys.size() > 10);
    await().until(() -> black.size() > 10);
  }

}