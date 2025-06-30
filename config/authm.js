const jwt = require("jsonwebtoken");

function authm(req,res,next){
    const authheader = req.headers.authorization;
    if(authheader == null){
        return res.status(500).json({
            success:false,
            message: "Please Login/Signup"
        })
    }

    const token = authheader.split(" ")[1];
    try {
        const data = jwt.verify(token, "sdjhbusedceucuveuvevuervbervervbrvbryvbreubververvbrebvre");
        req.user = data;
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message: "Please Login Again (Invalid Token)"
        })
    }
}

module.exports = authm

