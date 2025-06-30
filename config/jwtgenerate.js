const jwt = require("jsonwebtoken");

function createjwt(payload){
    const token = jwt.sign(payload,"sdjhbusedceucuveuvevuervbervervbrvbryvbreubververvbrebvre");
    return token;
}

module.exports = createjwt