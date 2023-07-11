import { AssociateData, BasicData, KeyTypes, LoginUser, NewUser, NumberOrString, PaymentData } from "../types"

const parseString = (arg: any): string => { 
    if (typeof arg !== 'string'){
        throw new Error('Incorrect argument wasn\'t a string' )
    }
    return arg
}

const parseNumber = (arg: any): number => {
    if (typeof arg !== 'number'){
        throw new Error('Incorrect argument wasn\'t a Number')
    }
    return arg
}

const parseStringOrNumber = (arg: any): NumberOrString => {
    if (typeof arg !== 'number' && typeof arg !== 'string'){
        throw new Error('Incorrect argument wasn\'t a string or number')
    }
    const numOrStr : NumberOrString = {
        value: arg
    }
    return numOrStr
}

export const parseKeyType = (arg: string): KeyTypes => {
    if (!Object.values(KeyTypes).includes(arg as KeyTypes)){
        throw new Error('Incorrect argument wasn\'t a key type')
    }
    return arg as KeyTypes
}


export const parseUserData = (object: any): NewUser => {
    const newUser: NewUser = {
        password: parseString(object.password),
        mail: parseString(object.mail),
        cuil: parseNumber(object.cuil),
        phoneNumber: parseNumber(object.phoneNumber),
        passport: parseString(object.passport)
    }
    return newUser
}

// export const parseAssociateData = (object: any): AssociateData => {
//     const associateData: AssociateData = {
//         keyType: parseKeyType(object.keyType),
//         cbu: parseNumber(object.cbu),
//         financialEntity: parseString(object.financialEntity)
//     }
//     return associateData
// }


export const parseAssociateDataKey = (object: any,keyType: string): AssociateData => {
    const associateData: AssociateData = {
        keyType: parseKeyType(keyType),
        cbu: parseNumber(object.cbu),
        financialEntityName: parseString(object.financialEntity)
    }
    return associateData
}


export const parseFindData = (object: any): BasicData => {
    const basicData: BasicData = {
        key: parseStringOrNumber(object.key),
        keyType: parseKeyType(object.key_type)
    }
    
    return basicData
}

export const parseLoginUserData = (object: any): LoginUser => {
    const loginUser: LoginUser = {
        password: parseString(object.password),
        mail: parseString(object.mail)
    }
    
    return loginUser
}

export const parsePaymentData = (body: any) : PaymentData =>{
    const newPayment: PaymentData = {
        toUserKeyType: parseString(body.keyType),
        toUserKey: parseStringOrNumber(body.key),
        amount: parseNumber(body.amount)
    }

    return newPayment
}