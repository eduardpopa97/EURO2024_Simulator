const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('databaseEURO2024.db');

module.exports.checkDuplicateAccount = (req, res, next) => {
    var body = req.body;
    db.get("SELECT * FROM USERS WHERE USER_NAME=?", [body.USER_NAME], 
            (err, rows) => {
                if(err) 
                    {
                        return res.status(500).json({"error": err.message});  
                    }
                else if(rows) 
                    {   
                        if(!res.headersSent) return res.status(200).json({"warning": "This username is already used. Please try another one."});       
                    }
		        else next();
            });
}
