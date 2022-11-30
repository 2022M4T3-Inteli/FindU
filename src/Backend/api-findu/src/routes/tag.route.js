// importando os módulos utilizados
import express from 'express';
import tagController from '../controllers/tag.controller.js';

// criando rota
const route = express.Router();

// criando os métodos e chamando suas respectivas funções
route.get('/', tagController.getAll);
route.post('/', tagController.create);
route.patch('/', tagController.patch); //VER DPS SARAH


// exportando a rota criada acima
export default route;