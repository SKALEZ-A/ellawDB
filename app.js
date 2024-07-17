const express = require('express');
const gameRoutes = require('./routes/gameRoutes');
const cors = require('cors');
const connectDB = require('./db/connect');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/Cluster0', gameRoutes);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(process.env.PORT || 3001, () =>
      console.log(`Server is listening on port ${process.env.PORT || 3001}....`)
    );
  } catch (error) {
    console.error(error);
  }
};

start();
