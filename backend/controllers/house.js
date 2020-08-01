const House = require("../models/house");
const HouseImages = require("../models/houseImages");
const multer = require("multer");
const connection = require("../database/connection");
const fs = require("fs");
const { storage, imageFilter } = require("../config/multer");
const path = require("path");
const { ECANCELED } = require("constants");
const { model } = require("../database/connection");
const { getIo } = require("../socket");

const uploadImages = multer({ storage, fileFilter: imageFilter }).fields([
  { name: "photos", maxCount: 50 },
  { name: "newPhotos", maxCount: 50 },
]);

const normalizeHouse = (house) => {
  const houseValues = house.dataValues;
  return {
    ...houseValues,
    HouseImages: houseValues.HouseImages.map((houseImage) => {
      const imagesValues = houseImage.dataValues;
      return {
        id: imagesValues.id,
        imageUrl: `http://localhost:3333/house/${imagesValues.HouseId}/${imagesValues.imageName}`,
        HouseId: imagesValues.HouseId,
      };
    }),
  };
};

const getAllHouses = async () => {
  const houses = await House.findAll({
    include: HouseImages,
    order: [[HouseImages, "id", "ASC"]],
  });

  const normalizedHouses = houses.map((house) => normalizeHouse(house));

  return normalizedHouses;
};

module.exports = {
  // GET Houses
  async getHouses(req, res, next) {
    const houses = await getAllHouses();
    res.status(200).json(houses);
  },

  // POST House
  async postHouse(req, res, next) {
    const io = getIo();
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

        houseId = newHouse.dataValues.id;

        for (const file of req.files.newPhotos) {
          await HouseImages.create(
            {
              imageName: file.filename,
              HouseId: houseId,
            },
            { transaction: t }
          );
        }

        for (const file of req.files.newPhotos) {
          const newPath = `./uploads/house/${houseId}`;
          fs.mkdir(newPath, { recursive: true }, (err) => {
            if (err) console.log(err);
            fs.rename(file.path, `${newPath}/${file.filename}`, (err) => {
              if (err) console.log(err);
            });
          });
        }

        await t.commit();

        const response = await House.findOne({
          where: { id: houseId },
          include: HouseImages,
        });

        const updatedHouses = await getAllHouses();
        io.emit("houses", updatedHouses);

        res.status(201).json(response);
      } catch (error) {
        for (const photo of req.files.newPhotos) {
          const path = photo.path;
          fs.unlink(path, (err) => {
            if (err) console.log(err);
          });
        }
        await t.rollback();
        next(error);
      }
    });
  },

  // GET House
  async getHouse(req, res, next) {
    const { houseId } = req.params;
    try {
      const house = await House.findByPk(houseId);
      if (!house) {
        const error = new Error("User not found.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json(house);
    } catch (error) {
      next(error);
    }
  },

  // PUT House
  async putHouse(req, res, next) {
    uploadImages(req, res, async (err) => {
      const io = getIo();
      if (err) return res.json({ ...err });
      const t = await connection.transaction();
      const { houseId } = req.params;
      let actualImagesNames = [];
      try {
        const house = await House.findByPk(houseId);

        if (!house) {
          const error = new Error("User not found.");
          error.statusCode = 404;
          throw error;
        }
        const data = JSON.parse(req.body.data);

        const updatedHouse = {
          address: data.address,
          number: data.number,
        };

        //console.log("DATA", data);
        //console.log("PHOTOS", req.files.photos);
        //console.log("NEW PHOTOS", req.files.newPhotos);

        await house.update(updatedHouse, { transaction: t });

        let count = 0;
        for (const photo of data.photosStatus) {
          if (photo.status === "DELETED") {
            const arg = await HouseImages.destroy({
              where: { id: photo.id },
              transaction: t,
            });
            console.log("ARG", arg);
          } else if (photo.status === "CHANGED") {
            const file = req.files.photos[count];
            count++;
            const actualImage = await HouseImages.findByPk(photo.id);
            actualImagesNames.push(actualImage.dataValues.imageName);
            console.log("Actual Name", actualImage.dataValues.imageName);
            console.log("Updated Name", file.filename);
            await HouseImages.update(
              { imageName: file.filename },
              { where: { id: photo.id }, transaction: t }
            );
          }
        }

        if (req.files.newPhotos)
          for (const photo of req.files.newPhotos) {
            await HouseImages.create(
              {
                imageName: photo.filename,
                HouseId: houseId,
              },
              { transaction: t }
            );
          }

        if (req.files.newPhotos)
          for (const photo of req.files.newPhotos) {
            const newPath = `./uploads/house/${houseId}`;
            fs.mkdir(newPath, { recursive: true }, (err) => {
              if (err) console.log(err);
              fs.rename(photo.path, `${newPath}/${photo.filename}`, (err) => {
                if (err) console.log(err);
              });
            });
          }

        if (req.files.photos)
          for (const photo of req.files.photos) {
            const newPath = `./uploads/house/${houseId}`;
            fs.mkdir(newPath, { recursive: true }, (err) => {
              if (err) console.log(err);
              fs.rename(photo.path, `${newPath}/${photo.filename}`, (err) => {
                if (err) console.log(err);
              });
            });
          }

        for (const photo of data.photosStatus) {
          if (photo.status === "DELETED") {
            const actualImage = await HouseImages.findByPk(photo.id);
            const name = actualImage.imageName;
            const path = `./uploads/house/${houseId}/${name}`;
            fs.unlink(path, (err) => {
              if (err) console.log(err);
            });
          }
        }

        for (const imageName of actualImagesNames) {
          const path = `./uploads/house/${houseId}/${imageName}`;
          fs.unlink(path, (err) => {
            if (err) console.log(err);
          });
        }

        await t.commit();

        const response = await House.findOne({
          where: { id: houseId },
          include: HouseImages,
        });

        const updatedHouses = await getAllHouses();
        io.emit("houses", updatedHouses);

        res.status(200).json(response);
      } catch (error) {
        for (const photo of req.files.newPhotos) {
          const path = photo.path;
          fs.unlink(path, (err) => {
            if (err) console.log(err);
          });
        }

        for (const photo of req.files.photos) {
          const path = photo.path;
          fs.unlink(path, (err) => {
            if (err) console.log(err);
          });
        }

        await t.rollback();
        console.log("wtf", error);
        next(error);
      }
    });
  },

  // DELETE House
  async deleteHouse(req, res, next) {
    const io = getIo();
    const t = await connection.transaction();
    const { houseId } = req.params;
    try {
      const house = await House.findByPk(houseId);
      if (!house) {
        const error = new Error("User not found.");
        error.statusCode = 404;
        throw error;
      }
      await house.destroy({ transaction: t });

      fs.rmdir(`./uploads/house/${house.id}`, { recursive: true }, (err) => {
        if (err) throw err;
        console.log("Folder Deleted!");
      });

      await t.commit();

      const updatedHouses = await getAllHouses();
      io.emit("houses", updatedHouses);

      res.status(200).json(house);
    } catch (error) {
      await t.rollback();
      next(error);
    }
  },
};
