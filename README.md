#  Trabajo practico bases de datos II

## Introudcción

Este repositorio contiene la implementacion de un sistema de un banco central, en conjunto con dos entidades financieras:
 - La ejecucion se hace mediante la api del Banco central. la cual interactua con las otras dos.
 - El Banco central conciste de una Api, una base en Postgres con tres tablas y una base en MongoDb para registrar el historial de transacciones.
 - Las bases de las entidades finacieras fueron realizadas en postgres..

## Uso
Recordar si se cambia el code space, modificar las variables FINANCIAL_API_LINK1 en /BancoCentralApi/setup.sh para que matchee

```sh
1-Dirigirse a codespaces con el repositorio.
```
```sh
2-  chmod +x ./EntidadFinancieraApi_1/setup.sh ./EntidadFinancieraApi_1/run.sh ./EntidadFinancieraApi_2/setup.sh  ./EntidadFinancieraApi_2/run.sh ./BancoCentralApi/setup.sh ./BancoCentralApi/run.sh
    cd ./EntidadFinancieraApi_1
```
```sh
3- ./setup.sh 
```
```sh
4- ./run.sh 
```
```sh
5- cd ..
```
```sh
6- cd ./EntidadFinancieraApi_1
```
```sh
7- ./setup.sh 
```
```sh
8- ./run.sh 
```
```sh
9- cd ..
```
```sh
10- cd ./BancoCentralApi
```
```sh
11- ./setup.sh 
```
```sh
12- ./run.sh 
```

Ahora puede dirigirse a .... e interacturar mediante el swagger con el sistema
