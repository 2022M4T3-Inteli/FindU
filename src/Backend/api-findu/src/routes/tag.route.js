// importando rota do express e arquivo controller
import express from 'express';
import tagController from '../controllers/tag.controller.js';

// criando rota
const route = express.Router();

// criando as rotas que retornam, contam, criam, atualizam e apagam uma tag, respectivamente
route.get('/', tagController.getAll);
route.get('/countDocuments', tagController.countDocuments);
route.post('/', tagController.create);
route.patch('/', tagController.update);
route.delete('/:id', tagController.erase);

// exportando rota
export default route;