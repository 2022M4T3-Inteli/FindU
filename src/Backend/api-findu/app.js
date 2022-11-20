// importando módulos utilizados na aplicação
import express from 'express';
import db from './src/database/db.js';
import cors from 'cors';
import dotenv from 'dotenv';
import tagRoute from './src/routes/tag.route.js';

// configurando dotenv
dotenv.config();

// criando um servidor e definindo sua porta
const app = express();
const PORT = 3000 || process.env.PORT;

// conectando com o banco de dados
db.connectDatabase();

// utilizando middlewares e rota
app.use(express.json());
app.use('/tag', tagRoute);
app.use(cors());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

// inicializando o servidor em sua respectiva porta
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}...`);
});