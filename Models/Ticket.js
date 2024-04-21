import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid'; 

const ticketSchema = mongoose.Schema({
  code: {
    type: String,
    default: () => uuidv4(), // Genera un código único al crear un Ticket
    unique: true
  },
  purchase_datetime: {
    type: Date,
    default: Date.now // Pone la fecha y hora actual al crear un Ticket
  },
  amount: {
    type: Number,
    required: true
  },
  purchaser: {
    type: String,
    required: true
  }
}, {
  timestamps: true // Mongoose crea automáticamente campos para 'createdAt' y 'updatedAt'
});

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;
