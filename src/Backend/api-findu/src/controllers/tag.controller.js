// importando arquivo de service e mongoose
import tagService from '../services/tag.service.js';
import mongoose from 'mongoose';

// função que cria uma nova tag no sistema
const create = async (req, res) => {
    try {
        const { macAddress, name, category, positionX, positionY, positionZ } = req.body;

        if(!macAddress || !positionX || !positionY || !positionZ) {
            res.status(400).send({ message: 'Please, submit all the fields required!' });
        }

        mongoose.Types.ObjectId(req.body.category);

        const tag = await tagService.createService(req.body);

        if(!tag) {
            return res.status(400).send({ message: 'Error creating tag!' });
        }

        res.status(201).send({
            message: 'Tag created successfully',
            tag: {
                id: tag._id,
                macAddress,
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

// função que retorna todas as tags do sistema
const getAll = async (req, res, next) => {
    try {
        const tags = await tagService.getAllService();

        if(tags.length === 0) {
            return res.status(400).send({ message: 'There are no tags registered in the database' });
        }

        res.header('Access-Control-Allow-Origin', '*');
        res.json(tags);
        next();

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

// função que atualiza as informações da tag
const update = async (req, res) => {
    try {
        const { id, macAddress, name, category, positionX, positionY, positionZ, buzzer } = req.body;

        if(!id && !macAddress && !name && !category && !positionX && !positionY && !positionZ && !buzzer) {
            res.status(400).send({ message: 'Submit at least one field!' });
        }

        mongoose.Types.ObjectId(req.body.category);

        await tagService.updateService(id, macAddress, name, category, positionX, positionY, positionZ, buzzer);

        return res.status(200).send({ message: 'Tag successfully updated' });
    } catch (error) {
        res.status(500).send({ message: error.message });   
    }
}

// função que deleta uma tag do sistema
const erase = async (req, res) => {
    try {
        const { id } = req.params;

        await tagService.eraseService(id);

        return res.status(200).send({ message: 'Tag successfully deleted' });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

// função que conta a quantidade de tags existentes
const countDocuments = async (req, res) => {
    try {
        let result = await tagService.countDocumentsService();

        if(result.length === 0) {
            res.status(404).send({ message: 'There are no tags registered in the database' });
        }

        res.json({
            documents: result
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

// exportando métodos criados acima
export default {
    create,
    getAll,
    update,
    erase,
    countDocuments
}