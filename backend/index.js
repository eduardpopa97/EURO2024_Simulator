const express = require('express');
const app = express();
const port = 8080;
const connectDB = require('./connectDB');
const router = require('./router');
const bodyParser = require('body-parser');
const cors = require('cors');

connectDB();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use("/", router);

app.get('/', (req, res) => {
    res.send('Welcome to my Node.js microservice!');
});
  
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});