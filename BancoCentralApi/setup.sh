#!/bin/bash

npm install

#-------------------PostgreSQL Container-------------------

# Define the Docker container and PostgreSQL connection details
POSTGRES_CONTAINER_NAME="base_postgre_tp"
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
    -p 5433:5432 \
    postgres
  sleep 10
fi

sleep 5

  # Define the SQL statements to create the tables
  SQL_CREATE_TABLE_1="CREATE TABLE IF NOT EXISTS users ( \
    userid serial NOT NULL PRIMARY KEY, \
    mail TEXT NOT NULL unique, \
    cuil varchar(11) NOT NULL unique, \
    phone_number text NOT NULL unique, \
    passport varchar(9) NOT NULL unique, \
    ima_key serial UNIQUE,  \
    password TEXT NOT NULL \
  );"
  SQL_CREATE_TABLE_2="CREATE TABLE IF NOT EXISTS finance_entity ( \
    finance_entity_id serial NOT NULL PRIMARY KEY, \
    name TEXT NOT NULL unique, \
    url TEXT NOT NULL \
  );"
  SQL_CREATE_TABLE_3="CREATE TABLE IF NOT EXISTS users_keys ( \
    userId integer NOT NULL, \
    finance_entity_id integer NOT NULL, \
    cbu integer NOT NULL, \
    key_type varchar(20) NOT NULL CHECK(((key_type)::text = 'mail'::text) OR ((key_type)::text = 'cuil'::text) OR ((key_type)::text = 'phoneNum'::text) OR ((key_type)::text = 'imakey'::text) OR ((key_type)::text = 'passport'::text)), \
    primary key (userid, key_type), \
    FOREIGN KEY (userId) REFERENCES users (userId) ON DELETE CASCADE, \
    FOREIGN KEY (finance_entity_id) REFERENCES finance_entity (finance_entity_id) ON DELETE CASCADE \
  );"

  SQL_INSERT_ACCOUNT_1="INSERT INTO users (mail, cuil, phone_number, passport, password) VALUES ('ian@gmail.com', '20123456789', '1234567890', 'A12345678', 'Sunshine23')"
  SQL_INSERT_ACCOUNT_2="INSERT INTO users (mail, cuil, phone_number, passport, password) VALUES ('lucas@gmail.com', '23987654321', '9876543210', 'B98765432', 'PurpleApple12')"
  SQL_INSERT_ACCOUNT_3="INSERT INTO users (mail, cuil, phone_number, passport, password) VALUES ('jose@gmail.com', '27567890123', '5678901234', 'C56789012', 'FootballFan99')"
  SQL_INSERT_ACCOUNT_4="INSERT INTO users (mail, cuil, phone_number, passport, password) VALUES ('pepe@gmail.com', '24345678905', '3456789012', 'D34567890', 'SummerBreeze17')"
  SQL_INSERT_ACCOUNT_5="INSERT INTO users (mail, cuil, phone_number, passport, password) VALUES ('martin@gmail.com', '26012345678', '0123456789', 'E01234567', 'GuitarPlayer88')"
  SQL_INSERT_ACCOUNT_6="INSERT INTO users (mail, cuil, phone_number, passport, password) VALUES ('ariel@gmail.com', '23876543210', '8765432109', 'F87654321', 'CoffeeLover42')"

  FINANCIAL_API_LINK1="..."
  FINANCIAL_API_LINK2="..."

  SQL_INSERT_FINANCIAL_ENTITY_1="INSERT INTO finance_entity (name, url) VALUES ('Rio', '$API_LINK_1')"
  SQL_INSERT_FINANCIAL_ENTITY_1="INSERT INTO finance_entity (name, url) VALUES ('Naranja', '$API_LINK_2')"

  # Execute the SQL statements inside the container
  docker exec -it "$POSTGRES_CONTAINER_NAME" psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" \
  -c "$SQL_CREATE_TABLE_1" \
  -c "$SQL_CREATE_TABLE_2" \
  -c "$SQL_CREATE_TABLE_3" \
  -c "$SQL_INSERT_ACCOUNT_1" \
  -c "$SQL_INSERT_ACCOUNT_2" \
  -c "$SQL_INSERT_ACCOUNT_3" \
  -c "$SQL_INSERT_ACCOUNT_4" \
  -c "$SQL_INSERT_ACCOUNT_5" \
  -c "$SQL_INSERT_ACCOUNT_6" \
  -c "$SQL_INSERT_FINANCIAL_ENTITY_1" \
  -c "$SQL_INSERT_FINANCIAL_ENTITY_2" 

  #-------------------MongoDB Container-------------------
MONGO_CONTAINER_NAME="MyMongo "
MONGO_PORT=27017
MONGO_DATABASE="transactions_sb"
COLLECTION_NAME="transactions"

# Check if the container is already running
if [[ "$(docker ps -a -q -f name=$MONGO_CONTAINER_NAME)" ]]; then
    echo "MongoDB container is already running"
    docker start $MONGO_CONTAINER_NAME
else
    # Run the MongoDB container
    docker run -d --name $MONGO_CONTAINER_NAME -p $MONGO_PORT:27017 -e MONGO_INITDB_DATABASE=$MONGO_DATABASE mongo
    echo "MongoDB container started"
fi

sleep 5

