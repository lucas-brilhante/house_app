const User = require("../models/users");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "uploads"));
  },
  filename: (req, file, cb) => {
    console.log(req.body);
    cb(null, req.body.email + "-avatar.png");
  },
});

const fileFilter = (req, file, cb) => {
  console.log(file);
  if (
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png"
  )
    cb(null, true);
  else cb(null, false);
};

const upload = multer({ storage, fileFilter }).single("avatar");

module.exports = {
  // GET Users
  async getUsers(req, res) {
    const users = await User.findAll();
    res.status(200).json(users);
  },

  // POST User
  async postUser(req, res) {
    upload(req, res, (err) => {
      if (err) return console.log(err);

      const { id, name, email } = req.body;

      console.log(name, email);

      const newUser = {
        name,
        email,
      };

      try {
        //const response = await User.create(newUser);
        //res.status(201).json({ ...response.dataValues });
        res.status(201).json({ ...newUser });
      } catch (error) {
        res.status(500).json(error);
      }
    });
  },

  // GET User
  async getUser(req, res) {
    const { username } = req.params;

    const user = await User.findOne({ where: { email: username } });

    if (user) res.status(200).json(user);
    else res.status(404).json({ message: "Not Found" });
  },

  // PUT User
  async putUser(req, res) {
    const { id, name, email } = req.body;
    const { id: user_id } = req.params;

    const user = await User.findByPk(user_id);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (id !== Number(user_id))
      return res.status(400).json({ message: "User id should be the same" });

    const updatedUser = await user.update({ name, email });
    res.status(200).json(updatedUser);
  },

  // DELETE User
  async deleteUser(req, res) {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (user) {
      await user.destroy();
      res.status(200).json(user);
    } else {
      res.status(404).json({
        message: "User not found",
      });
    }
  },
};
