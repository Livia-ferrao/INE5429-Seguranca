const express = require("express");
const router = express.Router();
const { cadastro, login, update } = require("../controllers/auth");
router.post("/cadastro", cadastro);
router.post("/login", login);
router.post("/update", update);

module.exports = router;
