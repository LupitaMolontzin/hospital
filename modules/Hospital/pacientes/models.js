// models/user.js
const mongoose = require('mongoose');

const PacienteSchema = new mongoose.Schema({
  expediente: { 
    type: String, 
    required: true, 
    unique: true,
    description: 'Número de expediente del paciente' 
  },
  nombre: { type: String, required: true, description: 'Nombre del paciente' },
  edad: { type: Number, required: true, description: 'Edad del paciente' },
  genero: { type: String, enum: ['Masculino', 'Femenino', 'Otro'], required: true, description: 'Género del paciente' },
  diagnostico: { type: String, required: true, description: 'Diagnóstico principal' },
  habitacion: { type: String, required: true, description: 'Número de habitación' },
  fechaIngreso: { type: Date, default: Date.now, description: 'Fecha de ingreso' }
});

module.exports = mongoose.model('Paciente', PacienteSchema);
