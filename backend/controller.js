const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('databaseEURO2024.db');

module.exports.createUser = (req, res) => {
    var body = req.body;
    db.run("INSERT INTO USERS (USER_ID, USER_NAME, USER_PASSWORD) VALUES (?, ?, ?)", 
            [body.USER_ID, body.USER_NAME, body.USER_PASSWORD], 
            function (err) {
                if(err) 
                    {
                        return res.status(500).json({"error": err.message});
                    }
                else res.status(200).json({"USER_ID": this.lastID, "message": "Your account has been successfully created. Please login to the platform."});
            }); 
}

module.exports.login = (req, res) => {
    var body = req.body;
    db.get("SELECT * FROM USERS WHERE USER_NAME=? AND USER_PASSWORD=?", [body.USER_NAME, body.USER_PASSWORD], 
    (err, row) => {
        if(err) 
            {
                return res.status(500).json({"error": err.message});  
            }
        else if(row) 
            {   
                res.status(200).json({"message": "Login successful", "session": row});      
            }
        else 
            {
                res.status(500).json({"warning": "Invalid username or password"});
            }
    });
}

module.exports.createGame = (req, res) => {
    var body = req.body;
    db.run("INSERT INTO GAMES (GAME_ID, GAME_USER_ID, GAME_SELECTED_COUNTRY, GAME_STATE) VALUES (?, ?, ?, ?)", 
            [body.GAME_ID, body.GAME_USER_ID, body.GAME_SELECTED_COUNTRY, "Started"], 
            function (err) {
                if(err) 
                    {
                        return res.status(500).json({"error": err.message});
                    }
                else if(!res.headersSent) res.status(200).json({"GAME_ID": this.lastID});
            }); 
}

module.exports.createDraw = (req, res) => {
    var body = req.body;
    db.run("INSERT INTO DRAWS (DRAW_ID, DRAW_GAME_ID, DRAW_ROUND, DRAW_COUNTRY_1, \
            DRAW_COUNTRY_2, DRAW_SCORE_COUNTRY_1, DRAW_SCORE_COUNTRY_2) VALUES (?, ?, ?, ?, ?, ?, ?)", 
            [body.DRAW_ID, body.DRAW_GAME_ID, body.DRAW_ROUND, body.DRAW_COUNTRY_1, body.DRAW_COUNTRY_2, 0, 0], 
            function (err) {
                if(err) 
                    {
                        return res.status(500).json({"error": err.message});
                    }
                else res.status(200).json({"DRAW_ID": this.lastID});
            }); 
}

module.exports.getDraw = (req, res) => {
    db.all("SELECT d.*, g.GAME_SELECTED_COUNTRY \
            FROM DRAWS as d INNER JOIN GAMES as g \
            ON d.DRAW_GAME_ID = g.GAME_ID \
            WHERE g.GAME_USER_ID = ? AND g.GAME_STATE = ?", 
            [parseInt(req.params.id), "Started"], 
            (err, draw) => {
                if(err) 
                    {
                        return res.status(500).json({"error": err.message});
                    }
                res.status(200).json({draw});
            });
}

module.exports.getPlayersByCountry = (req, res) => {
    db.all("SELECT * FROM PLAYERS WHERE PLAYER_COUNTRY = ?", 
            [req.params.country], 
            (err, players) => {
                if(err) 
                    {
                        return res.status(500).json({"error": err.message});
                    }
                res.status(200).json({players});
            });
}

module.exports.updateDraw = (req, res) => {
    var body = req.body;
    db.run("UPDATE DRAWS \
            SET DRAW_SCORE_COUNTRY_1 = ?, DRAW_SCORE_COUNTRY_2 = ? \
            WHERE DRAW_ID=?", 
            [body.DRAW_SCORE_COUNTRY_1, body.DRAW_SCORE_COUNTRY_2, req.params.id],
            function (err) {
                if(err) 
                    {
                        return res.status(500).json({"error": err.message});
                    }
                res.status(200).json({"updatedID": this.changes});
            });
}

module.exports.updateGame = (req, res) => {
    db.run("UPDATE GAMES \
            SET GAME_STATE = ? \
            WHERE GAME_USER_ID = ?", 
            ["Finished", req.params.id],
            function (err) {
                if(err) 
                    {
                        return res.status(500).json({"error": err.message});
                    }
                res.status(200).json({"updatedID": this.changes});
            });
}

module.exports.getAllGames = (req, res) => {
    db.all("SELECT * FROM GAMES", 
            [], 
            (err, games) => {
                if(err) 
                    {
                        return res.status(500).json({"error": err.message});
                    }
                res.status(200).json({games});
            });
}

module.exports.getAllDraws = (req, res) => {
    db.all("SELECT * FROM DRAWS", 
            [], 
            (err, draws) => {
                if(err) 
                    {
                        return res.status(500).json({"error": err.message});
                    }
                res.status(200).json({draws});
            });
}
    