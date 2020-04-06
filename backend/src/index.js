const express = require('express');
const cors = require('cors');

const routes = require('./routes');
const app = express();

app.use(cors());
app.use(express.json());      //para que o back end entenda json
app.use(routes);

app.listen(3333);