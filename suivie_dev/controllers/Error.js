"use strict";

class Error {

    static create(code, message ="") {
        return {
            "type": "error",
            "error": code,
            "message": message
        }
    }

}

export default Error;
