import { pool } from "../index";
import { AssociateData, BasicData, NewUser } from "../types";
import { Response } from 'express';

export const DBRegisterUser = async (user: NewUser,res: Response): Promise<any> => { 
    try {
        // Realiza una consulta a la base de datos
        const client = await pool.connect();
        const result = await client.query('INSERT INTO users ( mail,cuil,phone_number,passport,password )  VALUES ( $1, $2, $3, $4, $5 )',[user.mail,user.cuil,user.phoneNumber,user.passport,user.password]);
        client.release();
    
        // Envía la respuesta con los datos obtenidos
        res.status(200).json(result.rows);
      } catch (error) {
        console.error('Error al consultar la base de datos:', error);
        res.status(500).json({ error: 'Error al consultar la base de datos' + error });
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
        console.error('Error al consultar la base de datos:', error);
        res.status(500).json({ error: 'Error al consultar la base de datos' + error });
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
        console.error('Error al consultar la base de datos:', error);
        res.status(500).json({ error: 'Error al consultar la base de datos' + error });
      }
}

export const DBAsscociate = async (associate: AssociateData,userId: string,res: Response): Promise<any> => { 
    try {
        // Realiza una consulta a la base de datos
        const client = await pool.connect();
        const result = await client.query('INSERT INTO users_keys ( userid, finance_entity_id, cbu, key_type )  VALUES ( $1, $2, $3, $4 )',[userId, associate.financialEntityId, associate.cbu, associate.keyType]);
        client.release();
    
        // Envía la respuesta con los datos obtenidos
        res.status(200).json(result.rows);
      } catch (error) {
        console.error('Error al consultar la base de datos:', error);
        res.status(500).json({ error: 'Error al consultar la base de datos' + error });
      }
}