export enum KeyTypes {
    Mail = 'mail',
    Passport = 'passport',
    Cuil = 'cuil',
    PhoneNumber = 'phoneNumber',
    PixKey = 'pixKey'
}


export interface User {
    password: string,
    mail: string,
    cuil: number,
    phoneNumber: number,
    passport: string
    id: number
}

export type NewUser = Omit<User, 'id'>

export type LoginUser = Omit<User, 'id' | 'cuil' | 'phoneNumber' | 'passport'>


export interface AssociateData {
    keyType: KeyTypes,
    cbu: number,
    financialEntityId: number
}

export interface BasicData {
    key: NumberOrString, 
    keyType: KeyTypes    
}


export interface NumberOrString {
    value: string | number
}

export interface PaymentData{
    toUserKeyType: string,
    toUserKey: NumberOrString,
    amount: number
}