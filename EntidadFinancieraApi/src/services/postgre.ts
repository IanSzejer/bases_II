import { pool } from "../index";
import { Response } from 'express';

export const DBGetAccountBalance = async (cbu: string,res: Response): Promise<any> => { 
  try {
      // Realiza una consulta a la base de datos
      const client = await pool.connect();
      const result = await client.query('SELECT balance FROM bank WHERE cbu = $1',[cbu]);
      client.release();
      if (result.rows.length === 0){
        res.status(400).json({error :"Incorrect cbu"});
      }else{
        res.status(200).json(result.rows);
      }
     
      
    } catch (error) {
      console.error('Error while consulting data base:', error);
      res.status(500).json({ error: 'Error while consulting data base' + error });
    }
}


export const DBCheckAccountExistance = async (cbu: string,res: Response): Promise<any> => { 
  try {
      // Realiza una consulta a la base de datos
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM bank WHERE cbu = $1',[cbu]);
      client.release();
      if (result.rows.length === 0){
        res.status(400).json({error :"Non existance account"});
      }else{
        res.status(200).json(result.rows);
      }
     
      
    } catch (error) {
      console.error('Error while consulting data base:', error);
      res.status(500).json({ error: 'Error while consulting data base' });
    }
}



export const DBDepositAmount = async (cbu: string,amount: number,res: Response): Promise<any> => { 
    try {
        // Realiza una consulta a la base de datos
        const client = await pool.connect();
        const result = await client.query('UPDATE bank SET balance = balance + $1 WHERE cbu = $2 RETURNING *',[amount,cbu]);
        client.release();
        console.log(result.rows)
        if (result.rows.length === 0){
          res.status(400).json({error :"Balance not changed"});
        }else{
          res.status(200);
        }
      } catch (error) {
        console.error('Error while consulting data base:', error);
        res.status(500).json({ error: 'Error while consulting data base' + error });
      }
}

export const DBRollbackDepositAmount = async (cbu: string,amount: number,res: Response): Promise<any> => { 
  try {
      // Realiza una consulta a la base de datos
      const client = await pool.connect();
      const result = await client.query('UPDATE bank SET balance = balance - $1 WHERE cbu = $2 RETURNING *',[amount,cbu]);
      client.release();
      if (result.rows.length === 0){
        res.status(400).json({error :"Balance not changed"});
      }else{
        res.status(200).json(result.rows);
      }
    } catch (error) {
      console.error('Error while consulting data base:', error);
      res.status(500).json({ error: 'Error while consulting data base' + error });
    }
}

export const DBExtractAmount = async (cbu: string,amount: number,res: Response): Promise<any> => { 
  try {
      // Realiza una consulta a la base de datos
      const client = await pool.connect();
      const result_balance = await client.query('SELECT balance FROM bank WHERE cbu = $1',[cbu]);
      if (result_balance.rows[0].balance > amount){
        const result = await client.query('UPDATE bank SET balance = balance - $1 WHERE cbu = $2 RETURNING *',[amount,cbu]);
        client.release();
        if (result.rows.length === 0){
          res.status(400).json({error :"Balance not changed"});
        }else{
          res.status(200).json(result.rows);
        }
      }else{
        res.status(400).json({error :"Not enough money in the account"});
      }
      
    } catch (error) {
      console.error('Error while consulting data base:', error);
      res.status(500).json({ error: 'Error while consulting data base' + error });
    }
}

export const DBRollBackExtractAmount = async (cbu: string,amount: number,res: Response): Promise<any> => { 
  try {
      // Realiza una consulta a la base de datos
      const client = await pool.connect();
      const result = await client.query('UPDATE bank SET balance = balance + $1 WHERE cbu = $2 RETURNING *',[amount,cbu]);
      client.release();
      if (result.rows.length === 0){
        res.status(400).json({error :"Balance not changed"});
      }else{
        res.status(200).json(result.rows);
      }
      
    } catch (error) {
      console.error('Error while consulting data base:', error);
      res.status(500).json({ error: 'Error while consulting data base' + error });
    }
}