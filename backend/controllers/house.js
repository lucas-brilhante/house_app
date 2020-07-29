const House = require("../models/house");
const HouseImages = require("../models/houseImages");
const multer = require("multer");
const connection = require("../database/connection");
const fs = require("fs");
const { storage, imageFilter } = require("../config/multer");
const path = require("path");

const uploadImages = multer({ storage, fileFilter: imageFilter }).array(
  "photos",
  12
);

module.exports = {
  // GET Houses
  async getHouses(req, res) {
    const houses = await House.findAll({ include: HouseImages });
    res.status(200).json(houses);
  },

  // POST House
  async postHouse(req, res) {
    uploadImages(req, res, async (err) => {
      const t = await connection.transaction();
      try {
        if (err) return res.json({ ...err });

        const { address, number } = req.body;

        const newHouse = await House.create(
          {
            address,
            number,
          },
          { transaction: t }
        );

        for (const file of req.files) {
          console.log("PATH", file.path);
          await HouseImages.create(
            {
              imageName: file.filename,
              HouseId: newHouse.dataValues.id,
            },
            { transaction: t }
          );
        }

        await t.commit();

        for (const file of req.files) {
          const newPath = `./uploads/house/${newHouse.dataValues.id}`;
          fs.mkdir(newPath, { recursive: true }, (err) => {
            if (err) throw err;
            fs.rename(file.path, `${newPath}/${file.filename}`, (err) => {
              if (err) throw err;
            });
          });
        }

        const response = await House.findOne({
          where: { id: newHouse.dataValues.id },
          include: HouseImages,
        });

        res.status(201).json(response);
      } catch (error) {
        for (const file of req.files) {
          const path = file.path;
          fs.unlink(path, (err) => {
            if (err) console.log(err);
          });
        }
        await t.rollback();
        res.status(500).json(error);
      }
    });
  },

  // GET House
  async getHouse(req, res) {
    res.status(200).json({ message: "delete" });
  },

  // PUT House
  async putHouse(req, res) {
    res.status(200).json({ message: "delete" });
  },

  // DELETE House
  async deleteHouse(req, res) {
    res.status(200).json({ message: "delete" });
  },
};
