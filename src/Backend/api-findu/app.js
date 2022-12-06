// importando módulos utilizados na aplicação
import express from 'express';
import db from './src/database/db.js';
import cors from 'cors';
import dotenv from 'dotenv';

// importando arquivos de rotas
import tagRoute from './src/routes/tag.route.js';
import categoryRoute from './src/routes/category.route.js';
import beaconRoute from './src/routes/beacon.route.js';

// configurando dotenv
dotenv.config();

// criando servidor e inicializando sua porta
const app = express();
const PORT = 3000 || process.env.PORT;

// conectando com o banco de dados
db.connectDatabase();

// usando middlewares e rotas
app.use(express.json());
app.use(cors());
app.use('/tag', tagRoute);
app.use('/category', categoryRoute);
app.use('/beacon', beaconRoute);

// inicializando servidor em sua respectiva porta
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}...`);
});