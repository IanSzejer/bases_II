import express from "express"
import { parseNumber } from "../services/parse"
import { DBCheckAccountExistance, DBDepositAmount, DBExtractAmount, DBGetAccountBalance, DBRollBackExtractAmount, DBRollbackDepositAmount } from "../services/postgre"

const router = express.Router()

router.get('/', (_req,res) => {
    res.send('IMA')
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

router.get('/account/exists/:cbu', (req,res) =>{
    DBCheckAccountExistance(req.params.cbu, res)
})


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