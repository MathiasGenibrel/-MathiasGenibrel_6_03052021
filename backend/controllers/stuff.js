const Thing = require("../models/things");
const likeThing = require("../models/likesThing");
const fs = require("fs");

exports.createThing = (req, res, next) => {
  const thingObject = JSON.parse(req.body.sauce);
  delete thingObject._id;
  const thing = new Thing({
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
  Thing.updateOne({ _id: req.params.id }, { ...thingObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: "Objet modifié !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteThing = (req, res, next) => {
  Thing.findOne({ _id: req.params.id })
    .then((thing) => {
      const filename = thing.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Thing.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Objet supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.likeThing = (req, res, next) => {
  Thing.findOne({ _id: req.params.id })
    .then((sauceUnique) => {
      switch (req.body.like) {
        case 1:
          sauceUnique.usersLiked.push(req.body.userId);
          sauceUnique.likes += 1;
          break;
        case -1:
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
      Thing.updateOne(
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
        .then(() => res.status(200).json({ message: "Sauce good" }))
        .catch((error) => res.status(404).json({ error }));
    })
    .catch((error) => res.status(404).json({ error }));
};

exports.getOneThing = (req, res, next) => {
  Thing.findOne({ _id: req.params.id })
    .then((things) => res.status(200).json(things))
    .catch((error) => res.status(404).json({ error }));
};

exports.getAllThing = (req, res, next) => {
  Thing.find()
    .then((things) => res.status(200).json(things))
    .catch((error) => res.status(400).json({ error }));
};

(ID) => (DOCUMENT) => USER_LIKE_ID;

//https://mongoosejs.com/docs/populate.html
