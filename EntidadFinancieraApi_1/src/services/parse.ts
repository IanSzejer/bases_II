
const parseString = (arg: any): string => { 
    if (typeof arg !== 'string'){
        throw new Error('Incorrect argument wasn\'t a string' )
    }
    return arg
}

export const parseNumber = (arg: any): number => {
    if (typeof arg !== 'number'){
        throw new Error('Incorrect argument wasn\'t a Number')
    }
    return arg
}




