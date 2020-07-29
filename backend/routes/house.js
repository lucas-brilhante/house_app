const express = require("express");
const router = express.Router();
const houseController = require("../controllers/house");

router.get("/houses", houseController.getHouses);
router.post("/houses", houseController.postHouse);
router.get("/houses/:houseId", houseController.getHouse);
router.put("/houses/:houseId", houseController.putHouse);
router.delete("/houses/:houseId", houseController.deleteHouse);

module.exports = router;
