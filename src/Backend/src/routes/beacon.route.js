// importando rota do express e arquivo controller
import { Router } from 'express';
import beaconController from '../controllers/beacon.controller.js';

// criando rota
const route = Router();

// criando as rotas que retornam, contam e criam um beacon, respectivamente
route.get('/', beaconController.getAll);
route.get('/countDocuments', beaconController.countDocuments);
route.post('/', beaconController.create);

// exportando rota
export default route;