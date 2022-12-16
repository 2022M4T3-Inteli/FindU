// importando modelo de tag
import Tag from '../models/Tag.js';

// função que retorna, cria, atualiza, apaga e conta a quantidade de tags, respectivamente
const getAllService = () => Tag.find().populate('category');
const createService = (body) => Tag.create(body);
const updateService = (id, macAddress, name, category, positionX, positionY, positionZ, buzzer) => Tag.findOneAndUpdate({ _id: id }, { macAddress, name, category, positionX, positionY, positionZ, buzzer });
const eraseService = (id) => Tag.findOneAndDelete({ _id: id });
const countDocumentsService = () => Tag.countDocuments();

// exportando funções criadas acima
export default {
    getAllService,
    createService,
    updateService,
    eraseService,
    countDocumentsService
}