import mongoose from 'mongoose';
import { KeyTypes } from './types';

// URL de conexión a la base de datos MongoDB
const mongoURI = 'mongodb://localhost:27017/mongo';

// Conecta a la base de datos MongoDB   
mongoose.connect(mongoURI)
  .then(() => console.log('Conexión exitosa a la base de datos MongoDB'))
  .catch((error) => console.error('Error al conectar a la base de datos MongoDB:', error));


// Define el esquema del documento
const transactionSchema = new mongoose.Schema({
    from: {
        userIdFrom: Number,
        key_type: String
    },
    to: {
        userIdTo: Number,
        key_type: String
    },
    amount: Number,
    date: Date,
    status: String,
});

transactionSchema.index({ 'from.userIdFrom': 1, date:1  });
transactionSchema.index({ 'to.userIdTo': 1, date:1  });

// Crea el modelo basado en el esquema
export const Transaction = mongoose.model('Transaction', transactionSchema);

export default mongoose;