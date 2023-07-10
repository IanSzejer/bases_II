import { pool } from "../index";
import { AssociateData, BasicData, KeyTypes, NewUser, PaymentData } from "../types";
import { Response } from 'express';
import axios from 'axios';
import { Transaction } from "../db";

export const DBRegisterUser = async (user: NewUser,res: Response): Promise<any> => { 
    try {
        // Realiza una consulta a la base de datos
        const client = await pool.connect();
        const result = await client.query('INSERT INTO users ( mail,cuil,phone_number,passport,password )  VALUES ( $1, $2, $3, $4, $5 )',[user.mail,user.cuil,user.phoneNumber,user.passport,user.password]);
        client.release();
    
        // Envía la respuesta con los datos obtenidos
        res.status(200);
      } catch (error) {
        console.error('Error while consulting data base:', error);
        res.status(500).json({ error: 'Error while consulting data base' + error });
      }
}


export const DBGetUserCbu = async (userId: string,key_type: string,res: Response): Promise<any> => { 
    try {
        // Realiza una consulta a la base de datos
        const client = await pool.connect();
        const result = await client.query('SELECT cbu FROM users_keys WHERE userid = $1 AND key_type = $2',[userId,key_type]);
        client.release();
    
        // Envía la respuesta con los datos obtenidos
        res.status(200).json(result.rows);
      } catch (error) {
        console.error('Error while consulting data base:', error);
        res.status(500).json({ error: 'Error while consulting data base' + error });
      }
}

export const DBFindUser = async (findData: BasicData,res: Response): Promise<any> => { 
    try {
        // Realiza una consulta a la base de datos
        const client = await pool.connect();
        const result = await client.query('SELECT mail,cbu FROM users_keys NATURAL JOIN users WHERE ' + findData.keyType + ' = $1',[findData.key.value]);
        client.release();
        console.log(result.rows)
        // Envía la respuesta con los datos obtenidos
        res.status(200).json(result.rows);
      } catch (error) {
        console.error('Error while consulting data base:', error);
        res.status(500).json({ error: 'Error while consulting data base' + error });
      }
}

export const DBAsscociate = async (associate: AssociateData,userId: string,res: Response): Promise<any> => { 
    try {
        // Realiza una consulta a la base de datos
        const client = await pool.connect();
        const result = await client.query('INSERT INTO users_keys ( userid, finance_entity_id, cbu, key_type )  VALUES ( $1, $2, $3, $4 )',[userId, associate.financialEntityId, associate.cbu, associate.keyType]);
        client.release();
    
        // Envía la respuesta con los datos obtenidos
        res.status(200);
      } catch (error) {
        console.error('Error while consulting data base:', error);
        res.status(500).json({ error: 'Error while consulting data base' + error });
      }
}

export const DBPayment = async (userId: string,key_type: KeyTypes,paymentData: PaymentData,res: Response): Promise<any> => { 
  try {
      const client = await pool.connect();
      //First Postgre request

      const result = await client.query('SELECT url,cbu FROM finance_entity NATURAL JOIN users_keys WHERE userid = $1 and key_type = $2',[userId, key_type ]);
      
      if( result.rows.length === 0){
        res.status(400).json({error: 'incorrect from params'})
        return
      }
      //First Financial entity request
      const requestBody = {amount: paymentData.amount};
      const response = await axios.put(result.rows[0].url + '/account/extract/' + result.rows[0].cbu,requestBody);
      const responseData = response.data;

      if (response.status !== 200){
        res.status(500).json({error: 'failed while extracting money'})
      }

      //Second Postgre request
      const result_1 = await client.query('SELECT url,cbu,userId FROM (finance_entity NATURAL JOIN users_keys) NATURAL JOIN users WHERE '+ paymentData.toUserKeyType + ' = $1',[paymentData.toUserKey.value ]);
      
      if( result_1.rows.length === 0){
        await axios.put(result.rows[0].url + '/account/extract/' + result.rows[0].cbu + '/rollback',requestBody);
        res.status(400).json({error: 'incorrect to params'}) 
        return
      }
      const userIdTo = result_1.rows[0].userId
      client.release();

      //Second Financial entity request
      const response_1 = await axios.put(result_1.rows[0].url + '/account/deposit/' + result_1.rows[0].cbu,requestBody);
      const responseData_1 = response.data;

      if (response.status !== 200){
        await axios.put(result.rows[0].url + '/account/extract/' + result.rows[0].cbu + '/rollback',requestBody);
        res.status(500).json({error: 'failed while depositing money'})
        return
      }
      //Mongo transaction save

      const from = {
        userIdFrom: userId,
        key_type: key_type
      }
      const to = {
        userIdTo: userIdTo,
        key_type: paymentData.toUserKeyType
      }
      const amount = paymentData.amount
      const date = new Date()
      const newTransaction = new Transaction({ from: from, to: to, amount: amount, date: date, status: 'completed' });
      const savedUser = await newTransaction.save();
      
      res.status(200).json();
    } catch (error) {
      console.error('Error while consulting data base:', error);
      res.status(500).json({ error: 'Error while consulting data base' + error });
    }
}