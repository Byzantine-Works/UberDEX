#mvn clean install
cd uberdex-quote-generator
mvn clean package
java -jar target/uberdex-quote-generator-1.0-SNAPSHOT-fat.jar start -id uberdex-quote-generator --redirect-output
cd ..

sleep 3

cd uberdex-portfolio-service
mvn clean package
java -jar target/uberdex-portfolio-service-1.0-SNAPSHOT-fat.jar start -id uberdex-portfolio-service --redirect-output
cd ..

sleep 3

cd uberdex-audit-service
mvn clean package
java -jar target/uberdex-audit-service-1.0-SNAPSHOT-fat.jar start -id uberdex-audit-service --redirect-output
cd ..

sleep 3

cd uberdex-trader-dashboard
mvn clean package
java -jar target/uberdex-trader-dashboard-1.0-SNAPSHOT-fat.jar start -id uberdex-trader-dashboard --redirect-output
cd ..

sleep 3

cd uberdex-traders
mvn clean package
java -jar target/uberdex-traders-1.0-SNAPSHOT-fat.jar start -id uberdex-traders --redirect-output
cd ..