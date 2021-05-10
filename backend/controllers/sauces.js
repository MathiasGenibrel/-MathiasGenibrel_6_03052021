const Sauce = require("../models/sauce");
const fs = require("fs");

exports.createThing = (req, res, next) => {
  const thingObject = JSON.parse(req.body.sauce);
  delete thingObject._id;
  const thing = new Sauce({
    ...thingObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
  });
  thing
    .save()
    .then(() => res.status(201).json({ message: "Objet enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.modifyThing = (req, res, next) => {
  const thingObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
      }
    : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...thingObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: "Objet modifié !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteThing = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((thing) => {
      const filename = thing.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Objet supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.likeThing = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauceUnique) => {
      switch (req.body.like) {
        case 1:
          if (sauceUnique.usersLiked.indexOf(req.body.userId) != -1) break;
          sauceUnique.usersLiked.push(req.body.userId);
          sauceUnique.likes += 1;
          break;
        case -1:
          if (sauceUnique.usersDisliked.indexOf(req.body.userId) != -1) break;
          sauceUnique.usersDisliked.push(req.body.userId);
          sauceUnique.dislikes += 1;
          break;
        case 0:
          if (sauceUnique.usersLiked.find(user => user == req.body.userId) == req.body.userId) {
            sauceUnique.usersLiked.splice(sauceUnique.usersLiked.indexOf(req.body.userId), 1);
            sauceUnique.likes -= 1;
          }
          if (sauceUnique.usersDisliked.find(user => user == req.body.userId) == req.body.userId) {
            sauceUnique.usersDisliked.splice(sauceUnique.usersDisliked.indexOf(req.body.userId), 1);
            sauceUnique.dislikes -= 1;
          }
          break;
      }
      Sauce.updateOne(
        { _id: req.params.id },
        {
          $set: {
            usersLiked: sauceUnique.usersLiked,
            usersDisliked: sauceUnique.usersDisliked,
            likes: sauceUnique.likes,
            dislikes: sauceUnique.dislikes,
          },
        }
      )
        .then(() => res.status(200).json({ message: "Actualisation like de la sauce" }))
        .catch((error) => res.status(409).json({ error }));
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.getOneThing = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((things) => res.status(200).json(things))
    .catch((error) => res.status(404).json({ error }));
};

exports.getAllThing = (req, res, next) => {
  Sauce.find()
    .then((things) => res.status(200).json(things))
    .catch((error) => res.status(400).json({ error }));
};

(ID) => (DOCUMENT) => USER_LIKE_ID;

//https://mongoosejs.com/docs/populate.html
