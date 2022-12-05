// importando o módulo mongoose, utilizado para conectar com o banco de dados
import mongoose from 'mongoose';

// criando um "schema" com os dados que iremos armazenar no banco de dados
const TagSchema = new mongoose.Schema({
    status: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: false,
    },
    category: {
        type: String,
        required: false,
    },
    positionX: {
        type: Number,
        required: true,
    },
    positionY: {
        type: Number,
        required: true,
    },
    positionZ: {
        type: Number,
        required: true,
    }
});

// criando o modelo de cada documento
const Tag = mongoose.model('Tag', TagSchema);

// exportando modelo criado acima
export default Tag;