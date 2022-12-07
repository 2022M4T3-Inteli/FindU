// importando módulo mongoose
import mongoose from 'mongoose';

// função que conecta com o banco de dados
const connectDatabase = () => {
    console.log('Wait connecting to the database...');

    mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log('MongoDB Atlas Connected')).catch((error) => console.log(error));
}

// exportando função criada acima
export default {
    connectDatabase
}