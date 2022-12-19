// importando módulo mongoose
import mongoose from 'mongoose';

// criando uma schema com as informações das categorias
const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    }
});

// criando modelo
const Category = mongoose.model('Category', CategorySchema);

// exportando modelo
export default Category;