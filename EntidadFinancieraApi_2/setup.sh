#!/bin/bash

npm install

#-------------------PostgreSQL Container-------------------
# CBU's ----> 345678  121212  343434
# Define the Docker container and PostgreSQL connection details
POSTGRES_CONTAINER_NAME="base_entidad_2"
POSTGRES_USER="postgres"  
POSTGRES_PASSWORD="mysecretpassword"
POSTGRES_DB="postgres"
export PGPASSWORD="$POSTGRES_PASSWORD"

# Check if the container is already created
if docker ps -a -q -f "name=$POSTGRES_CONTAINER_NAME" --format '{{.Names}}' | grep -q "$POSTGRES_CONTAINER_NAME"; then
    echo "Starting existing PostgreSQL container..."
    docker start "$POSTGRES_CONTAINER_NAME"
else
  # Container does not exist, create and run it
  echo "Creating and running PostgreSQL container..."
  docker run -d --name "$POSTGRES_CONTAINER_NAME" \
    -e POSTGRES_USER="$POSTGRES_USER" \
    -e POSTGRES_PASSWORD="$POSTGRES_PASSWORD" \
    -e POSTGRES_DB="$POSTGRES_DB" \
    -p 5435:5432 \
    postgres
  sleep 10
fi

sleep 5

  # Define the SQL statements to create the tables
  SQL_CREATE_TABLE_1="CREATE TABLE IF NOT EXISTS bank ( \
    userid serial NOT NULL PRIMARY KEY, \
    cbu text NOT NULL unique, \
    bankpassword text NOT NULL, \
    balance numeric NOT NULL
  );"
  

  SQL_INSERT_ACCOUNT_1="INSERT INTO bank (cbu, bankpassword, balance) VALUES ('345678', 'manuel12', 1000)"
  SQL_INSERT_ACCOUNT_2="INSERT INTO bank (cbu, bankpassword, balance) VALUES ('121212', 'martin42', 1000)"
  SQL_INSERT_ACCOUNT_3="INSERT INTO bank (cbu, bankpassword, balance) VALUES ('343434', 'andres23', 1000)"



  # Execute the SQL statements inside the container
  docker exec -it "$POSTGRES_CONTAINER_NAME" psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" \
  -c "$SQL_CREATE_TABLE_1" \
  -c "$SQL_INSERT_ACCOUNT_1" \
  -c "$SQL_INSERT_ACCOUNT_2" \
  -c "$SQL_INSERT_ACCOUNT_3" 

 