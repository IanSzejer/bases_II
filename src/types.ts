export enum KeyTypes {
    Mail = 'mail',
    Passport = 'passport',
    Cuil = 'Cuil',
    PhoneNumber = 'phoneNumber',
    PixKey = 'pixKey'
}


export interface User {
    password: string,
    mail: string,
    cuil: number,
    phoneNumber: number,
    passport: number
    id: number
}

export type NewUser = Omit<User, 'id'>

export type LoginUser = Omit<User, 'id' | 'cuil' | 'phoneNumber' | 'passport'>


export interface AssociateData {
    key: NumberOrString,
    keyType: KeyTypes,
    cbu: number,
    financialEntity: string
}

export type BasicData = Omit<AssociateData, 'cbu' | 'financialEntity'>

export interface NumberOrString {
    value: string | number
}

export interface PaymentData{
    toUserKeyType: string,
    toUserKey: NumberOrString,
    amount: number
}