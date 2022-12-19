// importando model do beacon
import Beacon from '../models/Beacon.js';

// função que cria, retorna e conta a quantidade de beacons, respectivamente
const createService = (body) => Beacon.create(body);
const getAllService = () => Beacon.find();
const countDocumentsService = () => Beacon.countDocuments();

// exportando funções criadas acima
export default {
    createService,
    getAllService,
    countDocumentsService
}
