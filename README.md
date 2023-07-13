#  Trabajo practico bases de datos II

## Introducción

Este repositorio contiene la implementacion de un sistema de un banco central, en conjunto con dos entidades financieras:
 - La ejecucion se hace mediante la API del Banco central. la cual interactua con las otras dos.
 - El Banco central conciste de una API, una base en Postgres con tres tablas y una base en MongoDb para registrar el historial de transacciones.
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
5- Abrir una terminal nueva
```
```sh
6- cd ./EntidadFinancieraApi_2
```
```sh
7- ./setup.sh 
```
```sh
8- ./run.sh 
```
```sh
9- Abrir una terminal nueva
```
```sh
10- Debe ahora ingresar ahora a ./BancoCentralApi/setup.sh y modificar la variable:
     FINANCIAL_API_LINK1, poniendo de contenido la url que obtiene al ingresar a puerto y copiar la url del programa corriendo en el puerto 3002
     FINANCIAL_API_LINK2, poniendo de contenido la url que obtiene al ingresar a puerto y copiar la url del programa corriendo en el puerto 3004
```
```sh
11- Debe ahora ingresar ahora a ./BancoCentralApi/src/docs/swagger.ts y en la variable url: poner la misma url que se copio antes en el paso 10, pero cambiando el numero de puerto (esta embebido en la url) por 3000
```
```sh
12- cd ./BancoCentralApi
```
```sh
13- ./setup.sh 
```
```sh
14- ./run.sh 
```

```sh
15- Marcar todos los puertos como publicos en la tabla de puertos
```
Ahora puede dirigirse a puertos, precionar ver en el navegador en el puerto 3000. Una vez alli agregar /documentation y  podra interacturar mediante el swagger con el sistema
