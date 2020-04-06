const express = require('express');

const routes = express.Router();

const OngController = require('./constrollers/OngController');
const IncidentController = require('./constrollers/IncidentController');
const ProfileController = require('./constrollers/ProfileController');
const SessionController = require('./constrollers/SessionController');

routes.get('/ongs', OngController.index);
routes.post('/ongs', OngController.create);

routes.get('/incidents', IncidentController.index);
routes.post('/incidents', IncidentController.create);
routes.delete('/incidents/:id', IncidentController.delete);  //utilizei um routeparam , pois é utilizado para identificar recursos

routes.get('/profile', ProfileController.index);

routes.post('/sessions', SessionController.create);    //irei "criar" uma sessão, mas nao irai inseriri no banco de dados "+- é essa a logica", por isso usa-se post

module.exports = routes;

