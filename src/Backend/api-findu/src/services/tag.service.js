// importando o modelo da tag
import Tag from '../models/Tag.js';

// métodos que retornam todas as tags do sistema e cria uma nova tag, respectivamente
const getAllService = () => Tag.find();
const createService = (body) => Tag.create(body);

// exportando métodos
export default {
    getAllService,
    createService
}