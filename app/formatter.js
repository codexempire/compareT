export const successResponse = (res, data, code = 200) => {
    return res.status(code).json(data || {});
}

export const errorResponse = (res, error, code = 500) => {
    return res.status(code).json(error || {});
}

export const generateString = (length) => {
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}