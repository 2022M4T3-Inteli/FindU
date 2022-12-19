// importando módulo mongoose
import mongoose from 'mongoose';

// criando uma schema com as informações dos beacons
const BeaconSchema = new mongoose.Schema({
    macAddress: {
        type: String,
        required: true
    },
    
    distanceA: {
        type: Number,
        required: true
    },

    distanceC: {
        type: Number,
        required: true
    }
});

// criando modelo
const Beacon = mongoose.model('Beacon', BeaconSchema);

// exportando modelo
export default Beacon;