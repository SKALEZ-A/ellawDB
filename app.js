const express = require('express');
const gameRoutes = require('./routes/gameRoutes');
const cors = require('cors');
const connectDB = require('./db/connect');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

app.use('/api/Cluster0', gameRoutes);

app.get('/hello', (req, res) => {
  res.send('WALL-E ON TON');
});

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => console.log(`Server is listening on port ${port}....`));
  } catch (error) {
    console.log(error);
  }
};

start();
