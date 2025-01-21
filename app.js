import express from 'express';
import mongoose from 'mongoose';
import Thing from './models/Thing.js';

const app = express();

// Connexion à MongoDB
mongoose.connect('mongodb+srv://Drec_Mongo:mongo12345@cluster0.sa1ic.mongodb.net/', {})
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((error) => console.log('Connexion à MongoDB échouée !', error));

//mongodb+srv://Drec_Mongo:<db_password>@cluster0.sa1ic.mongodb.net/

//Ici je permet à express qui est une librairie de routing de récupérer 
//tous les éléments qui seront envoyés au format json par mon application
app.use(express.json());

//Ici je met en place un middleware
//Un middleware est une fonction qui analyse les requêtes et les reponses de mon api
//Dans ce cas ce middleware nous permet de définir des headers pour contourner l'erreur CORS
//Le CORS, Cross Origin Resources Share, est une sécurité mise en place pour empêcher les requêtes malveillantes
//Cette sécurité empêche des appareils de différentes sources de communiqué. Dans notre cas, Angular et Node Js

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

//Ici, je définis un middleware avec la méthode POST qui permet la création des donneés au format json
//JSON pour JavaScript Object Notation 
// Route POST : Création d'un objet dans MongoDB
app.post('/api/stuff', (req, res, next) => {
  const thing = new Thing({
    ...req.body,
    _id: undefined, // Supprime explicitement l'ID pour éviter des conflits
  });
  thing.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
    .catch((error) => res.status(400).json({ error }));
});

// Route GET : Récupération d'un objet spécifique depuis MongoDB
app.get('/api/stuff/:id', (req, res, next) => {
  Thing.findOne({_id: req.params.id})
    .then((thing) => {
      if (thing) {
        res.status(200).json(thing);
      } else {
        res.status(404).json({ message: 'Objet non trouvé !' });
      }
    })
    .catch((error) => res.status(400).json({ error }));
});


//Le middleware ici avec la methode get me permet d'aller récupérer les données depuis l'url 
app.get('/api/stuff', (req, res, next) => {
  const stuff = [
    {
      _id: 'oeihfzeoi',
      title: 'Mon premier objet',
      description: 'Les infos de mon premier objet',
      imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
      price: 4900,
      userId: 'qsomihvqios',
    },
    {
      _id: 'oeihfzeomoihi',
      title: 'Mon deuxième objet',
      description: 'Les infos de mon deuxième objet',
      imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
      price: 2900,
      userId: 'qsomihvqios',
    },
  ];
  res.status(200).json(stuff);
});

export default app;
