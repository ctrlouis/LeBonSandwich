"use strict";


const errorMessage = [
    {
        code: 401,
        message: "Unauthorized: require authentification"
    },
    {
        code: 404,
        message: "Ressource not available"
    },
    {
        code: 405,
        message: "Method not allowed"
    },
    {
        code: 500,
        message: "Internal Server Error"
    }
];
const defaultMessage = "An error has occured";

class Error {

    // send error
    static send(res, code, message =null) {
        if (!message) message = Error.getDefaultMessage(code);
        const error = {
            "type": "error",
            "error": code,
            "message": message
        };
        res.status(code).json(error);
    }

    // return the message corresponding to code
    static getDefaultMessage(code) {
        let message = errorMessage.find(mess => mess.code === code); // search default error code message
        if (!message) message = defaultMessage; // if no defaut message for this code, set the global default
        return message.message;
    }

    // DEPRECATED
    static create(code, message ="") {
        return {
            "type": "error",
            "error": code,
            "message": message
        }
    }

}

export default Error;
