# UberDEX-LDAR SEDA Event Loop Prototype

This repository is a prototype for UberDEX-LDAR reactive event-driven  SEDA application with the following requirements.

Functional requirements:
* 1
* 2

Performance requirements:
* 1
* 2

Devops requirements:
* 1
* 2

Analytics requirements:


The following stack is used for prototyping.
* Java 8 -    Base Platform language/VM
* Vert.x -    Reactive Core (Async Event Processing & SEDA)
* Hazelcast - Cluster Manager
* Metrics -   Dropwizard Metrics & Prometheus
* Maven -     Build, Package, Test and Deploy
* ELK -       Elastic, Logstash, Kibana [Data analytics, Logging, Monitoring, Alerting]
* Prometheus -Non-functional metrics
* Grafana -   Non-functional Dashboard
* eosjs -   RPC Library to interact with Exchange Smart Contract
* EOS-VM -  EOS virtual machine
* Exchange - Smart contract written in C++


## Synopsis

The overall application is a federation of interactive microservices and packaged as _fat-jar_. It is deployed in cluster-mode using HazelCast cluster manager(pluggable module).

## Content
* Core Functional Architecture Modules
  * Gateway
    * REST Interface
  * Dispatcher
  * BVM Simulator
  * Audit
  * Monitoring


 * Core Non-Functional Architecture elements
   * Microservices
   * Asynchronous non-blocking development model
   * Composition of async operations
   * Distributed event bus
   * Database access
   * Providing and Consuming REST APIs
   * Async RPC with BVM on the event bus
   * Microservice discovery
   * Resilience via Circuit Breakers and fallbacks


## Install Dependencies
// Install java
// Install mongo, elasticsearch, kibana, prometheus and grafana
Install MongoDB for audit persistence
```
brew install mongodb
```

## Build

```
mvn clean package
```

## Deployment
To run the application:
```
java -jar target/prototype-1.0-SNAPSHOT-fat.jar start -id prototype --redirect-output
```
Alternatively, in the scripts folder there is a bash script _start.sh_

## Stop
To stop the appliction:
```
java -jar target/prototype-1.0-SNAPSHOT-fat.jar stop -id prototype
```
Alternatively, in the scripts folder there is _stop.sh_

## List
To list the application:
```
java -jar target/prototype-1.0-SNAPSHOT-fat.jar list -id prototype
```