import mongoose from "mongoose";

const ThingSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    userId: { type: String, required: true },
    price: { type: Number, required: true },
});


//Créez le model

const Thing = mongoose.model('Thing', ThingSchema);

export default Thing;