// importando arquivo de service
import beaconService from '../services/beacon.service.js';

// função que retorna todos os beacons cadastrados
const getAll = async (req, res) => {
    try {
        const beacons = await beaconService.getAllService();

        if(beacons.length === 0) {
            res.status(400).send({ message: 'There are no beacons registered in the database' });
        }

        res.json(beacons);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

// função que cria um novo beacon no sistema
const create = async (req, res) => {
    try {
        const { macAddress, distanceA, distanceC } = req.body;

        if(!macAddress || !distanceA || !distanceC) {
            res.status(400).send({ message: 'Please, submit all the fields required!' });
        }

        const beacon = await beaconService.createService(req.body);

        if(!beacon) {
            res.status(400).send({ message: 'Error creating beacon' });
        }

        res.status(201).send({
            message: 'Beacon created successfully',
            beacon: {
                id: beacon._id,
                macAddress: macAddress,
                distanceA: distanceA,
                distanceC: distanceC
            }
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

// função que conta a quantidade de beacons
const countDocuments = async (req, res) => {
    try {
        let result = await beaconService.countDocumentsService();

        if(result.length === 0) {
            res.status(404).send({ message: 'There are no beacons in the database' });
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
    getAll,
    create,
    countDocuments
}