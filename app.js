import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import Thing from './models/Thing.js';

/**
 * Pour les importations : 
 * dotenv pour gérer les variabes d'environnement
 * cors pour gérer les headers. C'est une librairie qui me permet de relier deux applications de  sources différentes.
 * helmet gère la sécurité de l'application
 * morgan permet de gérer les logs http
 * Thing est mon model de données 
 */

dotenv.config();
const app = express();

// Middleware de base
/**
 * Ici je fais une sorte d'initialisation de mon application
 * je n'autorise que les données au format json
 * je fais une connexion entre ma partie frontend avec angular et le backend avec nodejs grâce à Cors
 * j'améliore la sécurité avec helmet
 * je lance morgan pour commencer à écrire le journal de mon api 
 */
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Connexion à MongoDB
/**
 * Pour la connexion à la base de données j'utilise une variable défini dans le fichier .env pour protéger mes identifiants de connexion
 */
mongoose.connect(process.env.MONGO_URI, {})
  .then(() => console.log('✅ Connexion à MongoDB réussie !'))
  .catch((error) => {
    console.error('❌ Connexion à MongoDB échouée !', error.message);
    process.exit(1);
  });

// Routes
app.post('/api/stuff', async (req, res) => {
  try {
    delete req.body._id;
    const thing = new Thing({ ...req.body });
    await thing.save();
    res.status(201).json({ message: 'Objet enregistré !' });
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la création', error: error.message });
  }
});

app.get('/api/stuff', async (req, res) => {
  try {
    const things = await Thing.find();
    res.status(200).json(things);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la récupération', error: error.message });
  }
});

app.get('/api/stuff/:id', async (req, res) => {
  try {
    const thing = await Thing.findOne({ _id: req.params.id });
    res.status(200).json(thing);
  } catch (error) {
    res.status(404).json({ message: 'Objet non trouvé', error: error.message });
  }
});

app.put('/api/stuff/:id', async (req, res) => {
  try {
    // Récupérer l'ID de l'objet depuis les paramètres
    const { id } = _id.req.params;

    // Vérifier si l'objet existe dans la base
    const existingThing = await Thing.findById(id);
    if (!existingThing) {
      return res.status(404).json({ message: 'Objet non trouvé.' });
    }

    // Mettre à jour l'objet avec les données envoyées
    const updatedThing = await Thing.findByIdAndUpdate(
      id,
      { ...req.body }, // Les nouvelles données
      { new: true, runValidators: true } // Options : retourne l'objet mis à jour et valide les données
    );

    // Répondre avec l'objet mis à jour
    res.status(200).json({ message: 'Objet mis à jour avec succès !', updatedThing });
  } catch (error) {
    // Gestion des erreurs
    res.status(400).json({ message: 'Erreur lors de la mise à jour.', error: error.message });
  }
});

// Middleware global pour gérer les erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Une erreur interne est survenue', error: err.message });
});

export default app;
