import express from "express"
import { parseUserData, parsePaymentData, parseAssociateDataKey, parseFindData, parseLoginUserData, parseKeyType } from "../services/parse"
import { DBAsscociate, DBFindUser, DBGetUserBalance, DBGetUserCbu, DBGetUserHistory, DBGetUserHistoryBykey, DBPayment, DBRegisterUser } from "../services/postgre"

const router = express.Router()

router.get('/', (_req,res) => {
    res.send('Pepe')
})

/**
 * Get track
 * @openapi
 * /user/:userId/:key_type/cbu:
 *    get:
 *      tags:
 *        - user
 *      summary: "Listar cbu del usuario"
 *      description: Este endpoint es para listar el cbu de una key para un usuario en particular
 *      parameters:
 *          - in: path
 *            name: userId
 *            schema:
 *              type: integer
 *            description: Id del usuario
 *          - in: path
 *            name: key_type
 *            schema:
 *              type: string
 *            description: Tipo de llave
 *      responses:
 *        '200':
 *          description: Se realizo correctamente.
 *          content:
 *              application/json:
 *                  schema:
 *                      properties:
 *                          cbu:
 *                              type: integer
 *                  
 *        '422':
 *          description: Error de validacion.

 */
router.get('/user/:userId/:key_type/cbu', (req,res) =>{
    console.log('getCbu for: ', req.params.userId, req.params.key_type)
    DBGetUserCbu(req.params.userId,req.params.key_type,res)
})

/**
 * Get track
 * @openapi
 * /user/:userId/:key_type/balance:
 *    get:
 *      tags:
 *        - user
 *      summary: "Listar balance del usuario para una key"
 *      description: Este endpoint es para listar el cbu de un usuario particular 
 *      parameters:
 *          - in: path
 *            name: userId
 *            schema:
 *              type: integer
 *            description: Id del usuario
 *          - in: path
 *            name: key_type
 *            schema:
 *              type: string
 *            description: Tipo de llave 
 *      responses:
 *        '200':
 *          description: Se realizo correctamente.
 *          content:
 *              application/json:
 *                  schema:
 *                      properties:
 *                          amount:
 *                              type: integer
 *        '400':
 *          description: Error de validacion.
 */
router.get('/user/:userId/:key_type/balance', (req,res) =>{
    //console.log('getBalance for: ', req.params.userId, req.params.key_type)
    const key = parseKeyType(req.params.key_type)
    DBGetUserBalance(req.params.userId,key,res)
})

/**
 * Get track
 * @openapi
 * /user/find:
 *    get:
 *      tags:
 *        - user
 *      summary: "Buscar usuario por key"
 *      description: Este endpoint buscar un usuario en base a una llave que se tenga de el
 *      requestBody:
 *           required: true
 *           content:
 *              application/json:
 *                  schema:
 *                      properties:
 *                          keyType:          
 *                              type: string
 *                          key:    
 *                              type: integer
 *      responses:
 *        '200':
 *          description: Retorna el objeto en la coleccion.
 *          content:
 *              application/json:
 *                  schema:
 *                      properties:
 *                          mail:          
 *                              type: string
 *                          cuit:    
 *                              type: integer
 *                          phoneNumber:          
 *                              type: integer
 *                          cbu:    
 *                              type: integer
 *                          financeEntity:          
 *                              type: string
 *        '400':
 *          description: Error de validacion.
 */
router.get('/user/find', (req,res) =>{
    // body -> keyType, key
    try{
        const findData = parseFindData(req.body)
        DBFindUser(findData,res)
    }catch(e: any){
        res.status(400).send(e.message)
    }
    // res.send(conexionApi.getUsers())
})

/**
 * Get track
 * @openapi
 * /user/:userId/history:
 *    get:
 *      tags:
 *        - user
 *      summary: "Listar historial"
 *      description: Este endpoint sirve para listar el historial de transacciones de un usuario
 *      parameters:
 *          - in: path
 *            name: userId
 *            schema:
 *              type: integer
 *            description: Id del usuario
 *      responses:
 *        '200':
 *          description: Se realizo correctamente.
 *          content:
 *              application/json:
 *                  schema:
 *                      properties:
 *                          history:
 *                              type: array
 *                              items:
 *                                  type: object
 *                                  properties:
 *                                      transactionID:
 *                                          type: integer
 *                                      userIdfrom:
 *                                          type: integer
 *                                      userIdto:
 *                                          type: integer
 *                                      date:
 *                                          type: string
 *                                      amount:
 *                                          type: integer     
 *        '400':
 *          description: Error de validacion.
 */
router.get('/user/:userId/history', (req,res) =>{
    console.log('getUserHistory for: ', req.params.userId)
    DBGetUserHistory(req.params.userId,res)
    // res.send(conexionApi.getUserHistory(req.params.userId))
})

/**
 * Get track
 * @openapi
 * /user/:userId/:key_type/history:
 *    get:
 *      tags:
 *        - user
 *      summary: "Listar historial de una llave"
 *      description: Este endpoint sirve para listar el historial de transacciones de un usuario para una llave en particular
 *      parameters:
 *          - in: path
 *            name: userId
 *            schema:
 *              type: integer
 *            description: Id del usuario
 *          - in: path
 *            name: key_type
 *            schema:
 *              type: string
 *            description: Tipo de llave
 *      responses:
 *        '200':
 *          description: Se realizo correctamente.
 *          content:
 *              application/json:
 *                  schema:
 *                      properties:
 *                          history:
 *                              type: array
 *                              items:
 *                                  type: object
 *                                  properties:
 *                                      transactionID:
 *                                          type: integer
 *                                      userIdfrom:
 *                                          type: integer
 *                                      userIdto:
 *                                          type: integer
 *                                      date:
 *                                          type: string
 *                                      amount:
 *                                          type: integer
 *        '400':
 *          description: Error de validacion.
 */
router.get('/user/:userId/:key_type/history', (req,res) =>{
    console.log('getUserHistoryInKey: ', req.params.key_type)
    const key = parseKeyType(req.params.key_type)
    DBGetUserHistoryBykey(req.params.userId,key,res)
    // res.send(conexionApi.getUserHistoryInKey(req.params.userId, req.params.key))
})

/**
 * Get track
 * @openapi
 * /user/register:
 *    post:
 *      tags:
 *        - user
 *      summary: "Registrar un usuario"
 *      description: Este endpoint sirve para registrar un nuevo usuario al sistema
 *      requestBody:
 *           required: true
 *           content:
 *              application/json:
 *                  schema:
 *                      properties:
 *                          mail:          
 *                              type: string
 *                          CUIL:    
 *                              type: integer
 *                          phonenum:    
 *                              type: integer
 *                          passport:    
 *                              type: string
 *                          password:    
 *                              type: string
 *                             
 *      responses:
 *        '200':
 *          description: Se realizo correctamente.
 *        '400':
 *          description: Error de validacion.
 */
router.post('/user/register', (req, res) => {
    // body -> mail, CUIL, phoneNum, passport, password
    try{
        const newUser = parseUserData(req.body)
        DBRegisterUser(newUser,res)
        // res.send(conexionApi.generateIMAKey(req.body))
    }catch(error){
        res.status(400).send(error)
    }
    
})

// Si no tengo la key (ejemplo si no tengo cargado mi mail)
// Si la tengo, key debe ser la misma a la ya registrada

/**
 * Get track
 * @openapi
 * /user/:userId/associate/:key_type:
 *    post:
 *      tags:
 *        - user
 *      summary: "Asociar key"
 *      description: Este endpoint sirve para asociar una nueva key a un usuario
 *      requestBody:
 *           required: true
 *           content:
 *              application/json:
 *                  schema:
 *                      properties:
 *                          key:          
 *                              type: string
 *                          keyType:    
 *                              type: string
 *                          financeId:    
 *                              type: integer
 *                          cbuInFinance:    
 *                              type: integer
 *      parameters:
 *          - in: path
 *            name: userId
 *            schema:
 *              type: integer
 *            description: Id del usuario
 *          - in: path
 *            name: key_type
 *            schema:
 *              type: string
 *            description: Tipo de llave
 *      responses:
 *        '200':
 *          description: Se realizo correctamente.
 *        '400':
 *          description: Error de validacion.
 */
router.post('/user/:userId/associate/:key_type', (req, res) => {
    // body -> key, keyType, financeId, cbuInFinance
    try{
        const newAssociateDataKey = parseAssociateDataKey(req.body,req.params.key_type)
        DBAsscociate(newAssociateDataKey,req.params.userId,res)
    }catch(e: any){
        res.status(400).send(e.message)
    }
})

// router.post('/user/:userId/associate', (req, res) => {
//     // body -> keyType, financeId, cbuInFinance
//     try{
//         const newAssociateData = parseAssociateData(req.body)
//         // res.send(conexionApi.generateIMAKey(req.body))
//     }catch(e: any){
//         res.status(400).send(e.message)
//     }
//     console.log('POST parameter received are: ',req.body)
//     // Devuelve TRUE si lo puede asociar, FALSE sino
//     // res.send(conexionApi.associateUser(req.params.userId, newAssociateData))
// })

/**
 * Get track
 * @openapi
 * /payment/user/:userId/:key_type:
 *    post:
 *      tags:
 *        - payment
 *      summary: "Realizar pago"
 *      description: Este endpoint sirve para realizar un pago de un usuario a otro
 *      requestBody:
 *           required: true
 *           content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/paymentData'
 *      parameters:
 *          - in: path
 *            name: userId
 *            schema:
 *              type: integer
 *            description: Id del usuario
 *          - in: path
 *            name: key_type
 *            schema:
 *              type: string
 *            description: Tipo de llave
 *      responses:
 *        '200':
 *          description: Se realizo correctamente.
 *        '400':
 *          description: bad param type.
 */
router.post('/payment/user/:userId/:key_type', (req, res) => {
    // body -> toUserKey, toUserKeyType , amount
    try{
        const newPayment = parsePaymentData(req.body)
        const key = parseKeyType(req.params.key_type)  
        DBPayment(req.params.userId,key,newPayment,res)
    }catch(error){
        res.status(400).send({error: 'bad param type'})
    }    
})

/**
 * Get track
 * @openapi
 * /user/login:
 *    put:
 *      tags:
 *        - user
 *      summary: "Loguear usuario"
 *      description: Este endpoint sirve para ingresar a una cuenta del sistema
 *       requestBody:
 *           required: true
 *           content:
 *              application/json:
 *                  schema:
 *                      properties:
 *                          mail:          
 *                              type: string
 *                          password:    
 *                              type: string
 *      responses:
 *        '200':
 *          description: Correcto login.
 *        '400':
 *          description: Error de validacion.
 */
router.put('/user/login', (req, res) => {
    // body -> mail, password
    try{
        const newPayment = parseLoginUserData(req.body)
        // res.send(conexionApi.generateIMAKey(req.body))
    }catch(e: any){
        res.status(400).send(e.message)
    }
    console.log('PUT parameter received are: ',req.body)
    // conexionApi.login(req.body)
})

export default router