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
        const user_info = await client.query('SELECT * FROM users WHERE cuil = $1',[user.cuil]);

        client.release();
    
        // Envía la respuesta con los datos obtenidos
        res.status(200).json(user_info.rows);
      } catch (error) {
        console.error('Error while consulting data base:', error);
        res.status(500).json({ error: 'Error while consulting data base' + error });
        // res.status(200).send()
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
        const result = await client.query('SELECT finance_entity_id,cbu FROM users_keys NATURAL JOIN users WHERE ' + findData.keyType + ' = $1',[findData.key.value]);
        if(result.rows.length === 0){
          res.status(400).json({error: 'There is no information available for those params'})
          return
        }
        const result_finance = await client.query('SELECT name FROM finance_entity WHERE finance_entity_id = $1',[result.rows[0].finance_entity_id]);

        client.release();
       
        // Envía la respuesta con los datos obtenidos
        res.status(200).json({'finance_entity_name': result_finance.rows[0].name,
        'cbu': result.rows[0].cbu});
      } catch (error) {
        console.error('Error while consulting data base:', error);
        res.status(500).json({ error: 'Error while consulting data base' + error });
      }
}

export const DBAsscociate = async (associate: AssociateData,userId: string,res: Response): Promise<any> => { 
    try {
        // Realiza una consulta a la base de datos
        const client = await pool.connect();
        const result_0 = await client.query('SELECT finance_entity_id, url FROM finance_entity WHERE name = $1',[associate.financialEntityName]);
        if(result_0.rows.length === 0){
          res.status(400).json({error: 'incorrect params'})
          return
        }

        try{
          const response = await axios.get(result_0.rows[0].url + '/account/exists/' + associate.cbu);
          const responseData = response.data;
    
          if (response.status !== 200){
            res.status(500).json({error: 'failed while setting cbu'})
          }
        }catch(error){
          console.error('Error while consulting finance entity api:', error);
          res.status(500).json({ error: 'Error while consulting finance entity api'});
          return
        }

        
        const result = await client.query('INSERT INTO users_keys ( userid, finance_entity_id, cbu, key_type )  VALUES ( $1, $2, $3, $4 )',[userId, result_0.rows[0].finance_entity_id, associate.cbu, associate.keyType]);
        client.release();
    
        // Envía la respuesta con los datos obtenidos
        res.status(200);
      } catch (error) {
        console.error('Error while consulting data base:', error);
        res.status(200).send();
      }
}

export const DBPayment = async (userId: string,key_type: KeyTypes,paymentData: PaymentData,res: Response): Promise<any> => { 
  const client = await pool.connect();
  var url
  var cbu
  try {
      
      //First Postgre request

      const result = await client.query('SELECT url,cbu FROM finance_entity NATURAL JOIN users_keys WHERE userid = $1 and key_type = $2',[userId, key_type ]);
      url = result.rows[0].url
      cbu = result.rows[0].cbu
      if( result.rows.length === 0){
        res.status(400).json({error: 'incorrect from params'})
        return
      }
  }catch(error){
    console.error('Error while consulting data base:', error);
    res.status(500).json({ error: 'Error while consulting data base' + error });
    return
  }
      //First Financial entity request
      const requestBody = {amount: paymentData.amount};
  
    try{
      const response = await axios.put(url + '/account/extract/' + cbu,requestBody);
      const responseData = response.data;

      if (response.status !== 200){
        res.status(500).json({error: 'failed while extracting money'})
      }
    }catch(error){
      console.error('Error while consulting financial entity api:', error);
      res.status(500).json({ error: 'Error while consulting financial entity api'});
      return
    }
    var url2
    var cbu2
    var userid
    try{
      const result_1 = await client.query('SELECT url,cbu,userId FROM (finance_entity NATURAL JOIN users_keys) NATURAL JOIN users WHERE '+ paymentData.toUserKeyType + ' = $1',[paymentData.toUserKey.value ]);
      url2 = result_1.rows[0].url
      cbu2 = result_1.rows[0].cbu
      userid = result_1.rows[0].userid
      if(result_1.rows.length === 0){
        await axios.put(url + '/account/extract/' + cbu + '/rollback',requestBody);
        res.status(400).json({error: 'incorrect to params'}) 
        const from = {
          userIdFrom : userId,
          key_type: key_type
        }
        const to = {
          userIdTo: userid,
          key_type: paymentData.toUserKeyType
        }
        const amount = paymentData.amount
        const date = new Date()
        const newTransaction = new Transaction({ from: from, to: to, amount: amount, date: date, status: 'failed' });
        const savedUser = await newTransaction.save();
        return
      }
      
    }catch(error){
      console.error('Error while consulting data base:', error);
      res.status(500).json({ error: 'Error while consulting data base' + error });
      const from = {
        userIdFrom : userId,
        key_type: key_type
      }
      const to = {
        userIdTo: userid,
        key_type: paymentData.toUserKeyType
      }
      const amount = paymentData.amount
      const date = new Date()
      const newTransaction = new Transaction({ from: from, to: to, amount: amount, date: date, status: 'failed' });
      const savedUser = await newTransaction.save();
      return
    }
      client.release();

      
      //Second Financial entity request
      try{
        const response = await axios.put(url2 + '/account/deposit/' + cbu2,requestBody);
        const responseData = response.data;
  
        if (response.status !== 200){
          res.status(500).json({error: 'failed while depositing money'})
        }
      }catch(error){
        console.error('Error while consulting financial entity api:', error);
        res.status(500).json({ error: 'Error while consulting financial entity api'});
        return
      }

    try{
      const response_1 = await axios.put(url2 + '/account/deposit/' + cbu2,requestBody);

      if (response_1.status !== 200){
        await axios.put(url + '/account/deposit/' + cbu + '/rollback',requestBody);
        res.status(500).json({error: 'failed while depositing money'})
        const from = {
          userIdFrom : userId,
          key_type: key_type
        }
        const to = {
          userIdTo: userid,
          key_type: paymentData.toUserKeyType
        }
        const amount = paymentData.amount
        const date = new Date()
        const newTransaction = new Transaction({ from: from, to: to, amount: amount, date: date, status: 'failed' });
        return
      }
    }catch(error){
      await axios.put(url + '/account/deposit/' + cbu + '/rollback',requestBody);
      const from = {
        userIdFrom : userId,
        key_type: key_type
      }
      const to = {
        userIdTo: userid,
        key_type: paymentData.toUserKeyType
      }
      const amount = paymentData.amount
      const date = new Date()
      const newTransaction = new Transaction({ from: from, to: to, amount: amount, date: date, status: 'failed' });
      console.error('Error while consulting financial entity api:', error);
      res.status(500).json({ error: 'Error while consulting financial entity api'});
      return
    }
      
      //Mongo transaction save

      const from = {
        userIdFrom : userId,
        key_type: key_type
      }
      const to = {
        userIdTo: userid,
        key_type: paymentData.toUserKeyType
      }
      
      const amount = paymentData.amount
      const date = new Date()
      const newTransaction = new Transaction({ from: from, to: to, amount: amount, date: date, status: 'completed' });
      const savedUser = await newTransaction.save();
      
      res.status(200).json();
    
}

export const DBGetUserBalance = async (userId: string,key_type: KeyTypes ,res: Response): Promise<any> => { 
  try {
      const client = await pool.connect();
      //First Postgre request

      const result = await client.query('SELECT url,cbu FROM finance_entity NATURAL JOIN users_keys WHERE userid = $1 and key_type = $2',[userId, key_type ]);
      
      if(result.rows.length === 0){
        res.status(400).json({error: 'Not found cbu associated'})
        return
      }

      try{
        const response = await axios.get(result.rows[0].url + '/account/exists/' + result.rows[0].cbu)
        const responseData = response.data;
  
        if (response.status !== 200){
          res.status(500).json({error: 'failed while getting cbu balance'})
        }
      }catch(error){
        console.error('Error while consulting finance entity api:', error);
        res.status(500).json({ error: 'Error while consulting finance entity api'});
        return
      }
      
      
      const response = await axios.get(result.rows[0].url + '/account/' + result.rows[0].cbu + '/balance');
      

      if(response.status === 200){
        res.status(200).json(response.data)
        return
      }else{
        res.status(500).json({error: 'Financial Entity failure'})
        return
      }
    } catch (error) {
      console.error('Error while consulting data base:', error);
      res.status(500).json({ error: 'Error while consulting data base ' + error });
    }
}

export const DBGetUserHistory = async (userId: string, res: Response): Promise<any> => { 
  try {
    
    const transactions = await Transaction.find({ 
      $or: [
        { 'from.userIdFrom': parseInt(userId) },
        { 'to.userIdTo': parseInt(userId) }
      ]
     });

    res.status(200).json(transactions)

    } catch (error) {
      console.error('Error while consulting data base:', error);
      res.status(500).json({ error: 'Error while consulting data base'  });
    }
}

export const DBGetUserHistoryBykey = async (userId: string, key_type: KeyTypes, res: Response): Promise<any> => { 
  try {
    
    const transactions = await Transaction.find({ 
      $or: [
        {
          $and: [
            { 'from.userIdFrom': parseInt(userId) },
            { 'from.key_type': key_type }
          ]
        },
        {
          $and: [
            { 'to.userIdTo': parseInt(userId) },
            { 'to.key_type': key_type }
          ]
        }
      ]
     });

    res.status(200).json(transactions)

    } catch (error) {
      console.error('Error while consulting data base:', error);
      res.status(500).json({ error: 'Error while consulting data base' });
    }
}