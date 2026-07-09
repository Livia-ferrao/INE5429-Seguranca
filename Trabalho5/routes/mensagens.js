const express = require("express");

const router = express.Router();

const {
	getAllMensagens,
	getMensagem,
	createMensagem,
	updateMensagem,
	deleteMensagem,
} = require("../controllers/mensagens");

router.route("/").get(getAllMensagens).post(createMensagem);

router
	.route("/:id")
	.get(getMensagem)
	.patch(updateMensagem)
	.delete(deleteMensagem);

module.exports = router;
