// importando modelo de categoria
import Category from '../models/Category.js';

// função que cria, retorna e conta a quantidade de categorias, respectivamente
const createService = (body) => Category.create(body);
const getAllService = () => Category.find();
const countDocumentsService = () => Category.countDocuments();

// exportando métodos criados acima
export default {
    createService,
    getAllService,
    countDocumentsService
}