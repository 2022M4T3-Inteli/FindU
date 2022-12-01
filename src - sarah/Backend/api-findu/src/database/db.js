// importando o módulo mongoose, utilizado para conectar com o banco de dados
import mongoose from 'mongoose';

// conectando com o banco de dados
const connectDatabase = () => {
    console.log('Wait connecting to the database...');

    mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log('MongoDB Atlas Connected')).catch((error) => console.log(error));
}

// exportando método criado acima
export default {
    connectDatabase
}