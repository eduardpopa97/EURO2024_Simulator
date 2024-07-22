const express = require('express');
const router = express.Router();
const controller = require('./controller');
const validator = require('./validator');

router.post("/registration", validator.checkDuplicateAccount, controller.createUser);
router.post("/login", controller.login);
router.post("/game", controller.createGame);
router.patch("/game/:id", controller.updateGame);
router.get("/game", controller.getAllGames);
router.post("/draw", controller.createDraw);
router.get("/draw/:id", controller.getDraw);
router.get("/draw", controller.getAllDraws);
router.patch("/draw/:id", controller.updateDraw);
router.get("/player/:country", controller.getPlayersByCountry);

module.exports = router;