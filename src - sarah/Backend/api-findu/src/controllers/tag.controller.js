// importando o arquivo service responsável por interagir com o banco de dados
import tagService from '../services/tag.service.js';

// função que cria uma nova tag no banco de dados 
const create = async (req, res) => {
    try {
        const { status, name, category, positionX, positionY, positionZ } = req.body;

        if (!status || !positionX || !positionY || !positionZ) {
            res.status(400).send({ message: 'Please, submit all the fields required!' });
        }

        const tag = await tagService.createService(req.body);

        if (!tag) {
            return res.status(400).send({ message: 'Error creating tag!' });
        }

        res.status(201).send({
            message: 'Tag created successfully',
            tag: {
                id: tag._id,
                status,
                name,
                category,
                positionX,
                positionY,
                positionZ
            }
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

// função que retorna todas as tags cadastradas no sistema
const getAll = async (req, res, next) => {
    try {
        const tags = await tagService.getAllService();

        if (tags.length === 0) {
            return res.status(400).send({ message: 'There are no tags registered in the database' });

        }
        res.header('Access-Control-Allow-Origin', '*');
        res.json(tags);
        next();
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}
//VER DPS - SARAH
// const patch = (req, res) => {
//     res.statusCode = 200;
//     res.setHeader('Access-Control-Allow-Origin', '*');

//     var params = req.params;
//     var body = req.body;
//     var sql;

//     sql = `UPDATE employees SET full_name="${body.full_name}", position="${body.position}", legal_hours="${body.legal_hours}", total_hours="${body.total_hours}", allocated_hours="${body.allocated_hours}", outsourced="${body.outsourced}", local="${body.local}", isActive="${body.isActive}" WHERE id=${params.id}`

//     var db = new sqlite3.Database("./data/main.db"); // Abre o banco
//     db.run(sql, [], err => {
//         if (err) {
//             throw err;
//         }
//         res.send("Funcionário foi atualizado");
//         res.end();
//     });
//     db.close(); // Fecha o banco
// }

// exportando as funções criadas acima para utiliza-las em outros arquivos
export default {
    create,
    getAll
}