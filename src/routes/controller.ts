import express from "express"
import { parseUserData, parsePaymentData, parseAssociateDataKey, parseFindData, parseLoginUserData } from "../services/parse"

const router = express.Router()

router.get('/', (_req,res) => {
    res.send('Pepe')
})

/**
 * Get track
 * @openapi
 * /user:
 *    get:
 *      tags:
 *        - user
 *      summary: "Listar cbu del usuario"
 *      description: Este endpoint es para listar el cbu de una key para un usuario en particular
 *      
 *      responses:
 *        '200':
 *          description: Retorna el objeto en la coleccion.
 *        '422':
 *          description: Error de validacion.
 */
router.get('/user/:userId/:key/cbu', (req,_res) =>{
    console.log('getCbu for: ', req.params.userId, req.params.key)
    // res.send(conexionApi.getCbu(req.params.userId,req.params.key))
})

/**
 * Get track
 * @openapi
 * /user:
 *    get:
 *      tags:
 *        - user
 *      summary: "Listar balance del usuario para una key"
 *      description: Este endpoint es para listar el cbu de un usuario particular 
 *      
 *      responses:
 *        '200':
 *          description: Retorna el objeto en la coleccion.
 *        '422':
 *          description: Error de validacion.
 */
router.get('/user/:userId/:key/balance', (req,_res) =>{
    console.log('getBalance for: ', req.params.userId, req.params.key)
    // res.send(conexionApi.getBalance(req.params.userId, req.params.key))
})

/**
 * Get track
 * @openapi
 * /user:
 *    get:
 *      tags:
 *        - user
 *      summary: "Buscar usuario por key"
 *      description: Este endpoint buscar un usuario en base a una llave que se tenga de el
 *      requestBody: 
 *          content:
 *                  application/x-www-form-urlencoded:
 *                      
     
                "schema": {
                "type": "object",
                "properties": {
                    "name": { 
                    "description": "Updated name of the pet",
                    "type": "string"
                    },
                    "status": {
                    "description": "Updated status of the pet",
                    "type": "string"
                    }
                },
                "required": ["status"] 
                }
            }
            }
 *      responses:
 *        '200':
 *          description: Retorna el objeto en la coleccion.
 *        '422':
 *          description: Error de validacion.
 */
router.get('/user/find', (req,res) =>{
    // body -> keyType, key
    try{
        const findData = parseFindData(req.body)
        // res.send(conexionApi.generateIMAKey(req.body))
    }catch(e: any){
        res.status(400).send(e.message)
    }
    console.log('getUses')
    // res.send(conexionApi.getUsers())
})

router.get('/user/:userId/history', (req,_res) =>{
    console.log('getUserHistory for: ', req.params.userId)
    // res.send(conexionApi.getUserHistory(req.params.userId))
})

router.get('/user/:userId/:key/history', (req,_res) =>{
    console.log('getUserHistoryInKey: ', req.params.key)
    // res.send(conexionApi.getUserHistoryInKey(req.params.userId, req.params.key))
})

router.post('/user/register', (req, res) => {
    // body -> mail, CUIL, phoneNum, passport, passwprd
    try{
        const newUser = parseUserData(req.body)
        // res.send(conexionApi.generateIMAKey(req.body))
    }catch(e: any){
        res.status(400).send(e.message)
    }
    console.log('POST parameter received are: ',req.body)
})

// Si no tengo la key (ejemplo si no tengo cargado mi mail)
// Si la tengo, key debe ser la misma a la ya registrada
router.post('/user/:userId/associate/:key', (req, res) => {
    // body -> key, keyType, financeId, cbuInFinance
    try{
        const newAssociateDataKey = parseAssociateDataKey(req.body)
        // res.send(conexionApi.generateIMAKey(req.body))
    }catch(e: any){
        res.status(400).send(e.message)
    }
    console.log('POST parameter received are: ',req.body)
    // Devuelve TRUE si lo puede asociar, FALSE sino
    // res.send(conexionApi.associateUser(req.params.userId, newAssociateData))
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

router.post('/payment/user/:userId/:key', (req, res) => {
    // body -> toUserKey, toUserKeyType , amount
    try{
        const newPayment = parsePaymentData(req.body)
        // res.send(conexionApi.generateIMAKey(req.body))
    }catch(e: any){
        res.status(400).send(e.message)
    }
    console.log('POST parameter received are: ', req.body)
    // Hago el pago -> de quien, desde que banco, para quien, que cantidad
    // res.send(conexionApi.payment(req.params, newPayment))
    
})

router.put('/user/login', (req, res) => {
    // body -> mail, passwprd
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