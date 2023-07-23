import express from "express"
import { parseNumber } from "../services/parse"
import { DBCheckAccountExistance, DBDepositAmount, DBExtractAmount, DBGetAccountBalance, DBRollBackExtractAmount, DBRollbackDepositAmount } from "../services/postgre"

const router = express.Router()

router.get('/', (_req,res) => {
    res.send('IMA')
})

// /**
//  * Get track
//  * @openapi
//  * /user:
//  *    get:
//  *      tags:
//  *        - user
//  *      summary: "Listar cbu del usuario"
//  *      description: Este endpoint es para listar el cbu de una key para un usuario en particular
//  *      
//  *      responses:
//  *        '200':
//  *          description: Retorna el objeto en la coleccion.
//  *        '400':
//  *          description: Error de parametros.
//  *        '422':
//  *          description: Error de validacion.
//  *        '500':
//  *          description: Error en la base de datos.
//  */

/**
 * Get track
 * @openapi
 * /account/{cbu}/balance:
 *    get:
 *      tags:
 *        - user
 *      summary: "Listar balance del usuario"
 *      description: Este endpoint es para listar el balance de un usuerio para detrminado cbu
 *      parameters:
 *          - in: path
 *            name: cbu
 *            schema:
 *              type: integer
 *            description: Cbu del usuario     
 *      responses:
 *        '200':
 *          description: Retorna el objeto en la coleccion.
 *        '400':
 *          description: Error de parametros.
 *        '422':
 *          description: Error de validacion.
 *        '500':
 *          description: Error en la base de datos.
 */
router.get('/account/:cbu/balance', (req,res) =>{
    DBGetAccountBalance(req.params.cbu,res)
})

/**
 * Get track
 * @openapi
 * /account/exists/{cbu}:
 *    get:
 *      tags:
 *        - user
 *      summary: "Confirma existencia de usuario"
 *      description: Este endpoint es saber si el cbu existe en el banco
 *      parameters:
 *          - in: path
 *            name: cbu
 *            schema:
 *              type: integer
 *            description: Cbu del usuario      
 *      responses:
 *        '200':
 *          description: Retorna el objeto en la coleccion.
 *        '400':
 *          description: Error de parametros.
 *        '422':
 *          description: Error de validacion.
 *        '500':
 *          description: Error en la base de datos.
 */
router.get('/account/exists/:cbu', (req,res) =>{
    DBCheckAccountExistance(req.params.cbu, res)
})

/**
 * Put track
 * @openapi
 * /account/deposit/{cbu}:
 *    put:
 *      tags:
 *        - user
 *      summary: "Deposito en cbu"
 *      description: Este endpoint es para depositar dinero en determinada cuenta
 *      requestBody:
 *           required: true
 *           content:
 *              application/json:
 *                  schema:
 *                      properties:
 *                          amount:    
 *                              type: integer
 *      parameters:
 *          - in: path
 *            name: cbu
 *            schema:
 *              type: integer
 *            description: Cbu del usuario     
 *      responses:
 *        '200':
 *          description: Retorna el objeto en la coleccion.
 *        '400':
 *          description: Error de parametros.
 *        '422':
 *          description: Error de validacion.
 *        '500':
 *          description: Error en la base de datos.
 */
router.put('/account/deposit/:cbu', (req, res) => {
    // body -> mail, CUIL, phoneNum, passport, passwprd
    try{
        const amount = parseNumber(req.body.amount)
        DBDepositAmount(req.params.cbu,amount,res)
        // res.send(conexionApi.generateIMAKey(req.body))
    }catch(error){
        res.status(400).send({error: 'incorrect parameters type'})
    }
    
})

/**
 * Put track
 * @openapi
 * /account/deposit/{cbu}/rollback:
 *    put:
 *      tags:
 *        - user
 *      summary: "Deshacer deposito en cbu"
 *      description: Este endpoint es para deshacer un deposito de dinero en determinada cuenta
 *      requestBody:
 *           required: true
 *           content:
 *              application/json:
 *                  schema:
 *                      properties:
 *                          amount:    
 *                              type: integer
 *      parameters:
 *          - in: path
 *            name: cbu
 *            schema:
 *              type: integer
 *            description: Cbu del usuario     
 *      responses:
 *        '200':
 *          description: Retorna el objeto en la coleccion.
 *        '400':
 *          description: Error de parametros.
 *        '422':
 *          description: Error de validacion.
 *        '500':
 *          description: Error en la base de datos.
 */
router.put('/account/deposit/:cbu/rollback', (req, res) => {
    // body -> mail, CUIL, phoneNum, passport, passwprd
    try{
        const amount = parseNumber(req.body.amount)
        DBRollbackDepositAmount(req.params.cbu,amount,res)
        // res.send(conexionApi.generateIMAKey(req.body))
    }catch(error){
        res.status(400).send(error)
    }
    
})

/**
 * Put track
 * @openapi
 * /account/extract/{cbu}:
 *    put:
 *      tags:
 *        - user
 *      summary: "Extraer dinero de cbu"
 *      description: Este endpoint es para extraer dinero de determinada cuenta
 *      requestBody:
 *           required: true
 *           content:
 *              application/json:
 *                  schema:
 *                      properties:
 *                          amount:    
 *                              type: integer
 *      parameters:
 *          - in: path
 *            name: cbu
 *            schema:
 *              type: integer
 *            description: Cbu del usuario      
 *      responses:
 *        '200':
 *          description: Retorna el objeto en la coleccion.
 *        '400':
 *          description: Error de parametros.
 *        '422':
 *          description: Error de validacion.
 *        '500':
 *          description: Error en la base de datos.
 */

router.put('/account/extract/:cbu', (req, res) => {
    // body -> mail, CUIL, phoneNum, passport, passwprd
    try{
        const amount = parseNumber(req.body.amount)
        DBExtractAmount(req.params.cbu,amount,res)
        // res.send(conexionApi.generateIMAKey(req.body))
    }catch(error){
        res.status(400).send(error)
    }
})

/**
 * Put track
 * @openapi
 * /account/extract/{cbu}/rollback:
 *    put:
 *      tags:
 *        - user
 *      summary: "Deshacer extraccion de dinero en cbu"
 *      description: Este endpoint es para deshacer la extraccion de dinero en determinada cuenta
 *      requestBody:
 *           required: true
 *           content:
 *              application/json:
 *                  schema:
 *                      properties:
 *                          amount:    
 *                              type: integer
 *      parameters:
 *          - in: path
 *            name: cbu
 *            schema:
 *              type: integer
 *            description: Cbu del usuario
 *      responses:
 *        '200':
 *          description: Retorna el objeto en la coleccion.
 *        '400':
 *          description: Error de parametros.
 *        '422':
 *          description: Error de validacion.
 *        '500':
 *          description: Error en la base de datos.
 */

router.put('/account/extract/:cbu/rollback', (req, res) => {
    // body -> mail, CUIL, phoneNum, passport, passwprd
    try{
        const amount = parseNumber(req.body.amount)
        DBRollBackExtractAmount(req.params.cbu,amount,res)
        // res.send(conexionApi.generateIMAKey(req.body))
    }catch(error){
        res.status(400).send(error)
    }
})

export default router