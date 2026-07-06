const express = require("express");

const router = express.Router();

const {
	getAllEstagios,
	getEstagio,
	createEstagio,
	updateEstagio,
	deleteEstagio,
} = require("../controllers/estagios");

router.route("/").get(getAllEstagios).post(createEstagio);

router.route("/:id").get(getEstagio).patch(updateEstagio).delete(deleteEstagio);

module.exports = router;
