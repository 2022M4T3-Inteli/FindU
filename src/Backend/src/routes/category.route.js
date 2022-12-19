// importando rota do express e arquivo controller
import { Router } from 'express';
import categoryController from '../controllers/category.controller.js';

// criando rota
const route = Router();

// criando as rotas que retornam, contam e criam uma categoria, respectivamente
route.get('/', categoryController.getAll);
route.get('/countDocuments', categoryController.countDocuments);
route.post('/', categoryController.create);

// exportando rota
export default route;