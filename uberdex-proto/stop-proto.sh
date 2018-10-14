cd uberdex-quote-generator/
cls
while true; do
java -jar target/uberdex-quote-generator-1.0-SNAPSHOT-fat.jar stop uberdex-quote-generator
java -jar target/uberdex-quote-generator-1.0-SNAPSHOT-fat.jar stop uberdex-trader-dashboard
java -jar target/uberdex-quote-generator-1.0-SNAPSHOT-fat.jar stop uberdex-audit-service
java -jar target/uberdex-quote-generator-1.0-SNAPSHOT-fat.jar stop uberdex-traders
java -jar target/uberdex-quote-generator-1.0-SNAPSHOT-fat.jar stop uberdex-portfolio-service
sleep 1
done