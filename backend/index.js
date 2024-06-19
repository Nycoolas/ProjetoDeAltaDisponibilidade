const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const swaggerDocumento = YAML.load('./swagger.yml');
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocumento));

mongoose.connect('mongodb://localhost:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Error connecting to MongoDB', error);
});

const petSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  photoUrls: { type: [String], required: true },
});

const Pet = mongoose.model('Pet', petSchema);

//atualiza um pet existente
app.put('/pet', async (req, res) => {
  try {
    const updatedPet = await Pet.findOneAndUpdate({ id: req.body.id }, req.body, { new: true, upsert: true });
    res.json(updatedPet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar pet' });
  }
});

//adiciona um novo pet
app.post('/pet', async (req, res) => {
  try {
    const newPet = new Pet(req.body);
    await newPet.save();
    res.status(201).json(newPet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao adicionar pet' });
  }
});

//obtem um pet atraves de seu ID
app.get('/pet/:petId', async (req, res) => {
  try {
    const pet = await Pet.findOne({ id: req.params.petId });
    if (!pet) {
      res.status(404).json({ message: 'Pet não encontrado' });
      return;
    }
    res.status(200).json(pet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar pet' });
  }
});

//deletar um pet atraves de seu ID
app.delete('/pet/:petId', async (req, res) => {
  try {
    await Pet.findOneAndDelete({ id: req.params.petId });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao deletar pet' });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
