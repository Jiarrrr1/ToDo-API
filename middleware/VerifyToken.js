const bcrpyt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//middleware function
exports.verifyToken = async (req, res, next) => {
    try {
        const cookies = req.cookies["jwt"];
        jwt.verify(cookies, "My_Secret", (err, user) => {
            if (err) return res.sendStatus(401);
            console.log("Token is correct and not expired");
            req.user = user;
            next();
        });
    } catch (err) {
        res.status(404).json({
            content: err,
        });
        console.log(err)
    }
};


