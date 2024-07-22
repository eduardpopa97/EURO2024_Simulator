const sqlite3 = require('sqlite3').verbose();
// const fs = require("fs");
// const csv = require('csv-parser');

// var players = [];

// const COUNTRIES = [
//     {
//         country: "Spain"
//     },
//     {
//         country: "Georgia"
//     },
//     {
//         country: "Germany"
//     },
//     {
//         country: "Denmark",
//     },
//     {
//         country: "Portugal"
//     },
//     {
//         country: "Slovenia"
//     },
//     {
//         country: "France"
//     },  
//     {
//         country: "Belgium"
//     },
//     {
//         country: "Romania"
//     },
//     {
//         country: "Netherlands"
//     },
//     {
//         country: "Austria"
//     },
//     {
//         country: "Turkey"
//     },
//     {
//         country: "England"
//     },
//     {
//         country: "Slovakia"
//     },
//     {
//         country: "Switzerland"
//     },
//     {
//         country: "Italy"
//     }
// ];

// const POSITIONS = [
//     {
//         position: "Goalkeeper"
//     },
//     {
//         position: "Defender"
//     },
//     {
//         position: "Midfielder"
//     },
//     {
//         position: "Attacker"
//     }
// ];

const connectDB = () => {

    const db = new sqlite3.Database('databaseEURO2024.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
        if(err) {
            console.log(err.message);
        }
        else {
            console.log("Connected to the database");

            db.run("CREATE TABLE IF NOT EXISTS USERS ( \
                    USER_ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, \
                    USER_NAME NVARCHAR(30), \
                    USER_PASSWORD NVARCHAR(30))");

            db.run("CREATE TABLE IF NOT EXISTS PLAYERS ( \
                    PLAYER_ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, \
                    PLAYER_NAME NVARCHAR(30), \
                    PLAYER_COUNTRY NVARCHAR(30), \
                    PLAYER_POSITION NVARCHAR(20), \
                    PLAYER_DEFENSE INTEGER, \
                    PLAYER_PASSING INTEGER, \
                    PLAYER_SHOOTING INTEGER)");

            db.run("CREATE TABLE IF NOT EXISTS GAMES ( \
                    GAME_ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, \
                    GAME_USER_ID INTEGER, \
                    GAME_SELECTED_COUNTRY NVARCHAR(30), \
                    GAME_STATE NVARCHAR(30), \
                    FOREIGN KEY (GAME_USER_ID) REFERENCES USERS (USER_ID))");

            // db.run("CREATE TABLE IF NOT EXISTS DRAWS ( \
            //         DRAW_ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, \
            //         DRAW_GAME_ID INTEGER, \
            //         DRAW_ROUND NVARCHAR(30), \
            //         DRAW_POSITION INTEGER, \
            //         DRAW_COUNTRY NVARCHAR(30), \
            //         FOREIGN KEY (DRAW_GAME_ID) REFERENCES GAMES (GAME_ID))");
            
                
                
            db.run("CREATE TABLE IF NOT EXISTS DRAWS ( \
                    DRAW_ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, \
                    DRAW_GAME_ID INTEGER, \
                    DRAW_ROUND NVARCHAR(30), \
                    DRAW_COUNTRY_1 NVARCHAR(30), \
                    DRAW_COUNTRY_2 NVARCHAR(30), \
                    DRAW_SCORE_COUNTRY_1 INTEGER, \
                    DRAW_SCORE_COUNTRY_2 INTEGER, \
                    FOREIGN KEY (DRAW_GAME_ID) REFERENCES GAMES (GAME_ID))");

            // fs.createReadStream("file.csv")
            // .pipe(csv())
            // .on('data', (data) => {
            //     players.push(data);
            // })
            // .on('end', () => { 
            //     for(let i=0; i<COUNTRIES.length; i++) 
            //         {
            //             for(let j=0; j<22; j++) 
            //             {
            //                 db.run("INSERT INTO PLAYERS (PLAYER_NAME, PLAYER_COUNTRY, PLAYER_POSITION, \
            //                         PLAYER_DEFENSE, PLAYER_PASSING, PLAYER_SHOOTING) VALUES (?, ?, ?, ?, ?, ?)",
            //                         [players[22*i+j]["name.first"] + " " + players[22*i+j]["name.last"], 
            //                         COUNTRIES[i].country, POSITIONS[j%4].position, Math.floor(Math.random() * 100),
            //                         Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)]);
            //             }
            //         } 
            // });          

            // db.all("SELECT * FROM PLAYERS", [], 
            // (err, row) => {
            //     if(err) 
            //         {
            //             console.log(err);
            //         }
            //     else if(row) 
            //         {   
            //             console.log(row);    
            //         }
            // });

            // db.all("SELECT d.DRAW_ROUND, d.DRAW_POSITION, d.DRAW_COUNTRY \
            // FROM DRAWS as d INNER JOIN GAMES as g \
            // ON d.DRAW_GAME_ID = g.GAME_ID \
            // WHERE g.GAME_USER_ID = ? AND g.GAME_STATE = ?", [1, "Started"], 
            // (err, row) => {
            //     if(err) 
            //         {
            //             console.log(err);
            //         }
            //     else if(row) 
            //         {   
            //             console.log(row);    
            //         }
            // });
                    
        }
    });
}

module.exports = connectDB;