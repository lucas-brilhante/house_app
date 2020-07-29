const express = require("express");
const router = express.Router();
const userController = require("../controllers/users");

router.get("/users", userController.getUsers);
router.post("/users", userController.postUser);
router.get("/users/:username", userController.getUser);
router.put("/users/:id", userController.putUser);
router.delete("/users/:id", userController.deleteUser);

module.exports = router;
