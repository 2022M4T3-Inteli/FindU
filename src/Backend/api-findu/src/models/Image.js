// importando módulo mongoose
import mongoose from 'mongoose';

// criando uma schema com as informações das imagens
const ImageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false
    },
    desc: {
        type: String,
        required: false
    },
    img: {
        data: Buffer,
        contentType: String,
        required: false
    }
});

// criando modelo
const Image = mongoose.model('Image', ImageSchema);

// exportando modelo
export default Image;