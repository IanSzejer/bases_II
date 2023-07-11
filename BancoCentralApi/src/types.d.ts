export interface User {
    password: string,
    mail: string,
    cuil: number,
    phoneNumber: number,
    passport: number
    id: number
}

export type NewUser = Omit<User, 'id'>


export interface AssociateData {
    key: string | number,
    cbu: number,
    financialEntity: string
}

export interface PaymentData{
    toUserKeyType: string,
    toUserKey: string | number,
    amount: number
}