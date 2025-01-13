const PDFDocument = require('pdfkit');
const Pacientes = require('../pacientes/models');

async function generatePDF(req, res) {
    try {
        console.log('Buscando paciente con ID:', req.params.id); // Para debugging
        
        const paciente = await Pacientes.findById(req.params.id);
        if (!paciente) {
            console.log('Paciente no encontrado'); // Para debugging
            return res.status(404).send('Paciente no encontrado');
        }

        console.log('Paciente encontrado:', paciente); // Para debugging

        const doc = new PDFDocument();
        
        // Configurar el nombre del archivo
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=historial-${paciente.nombre}.pdf`);

        // Pipe el PDF al response
        doc.pipe(res);

        // Agregar contenido al PDF
        doc.fontSize(25).text('Historial Médico', {align: 'center'});
        doc.moveDown();
        doc.fontSize(14);
        doc.text(`Nombre: ${paciente.nombre}`);
        doc.text(`Edad: ${paciente.edad}`);
        doc.text(`Género: ${paciente.genero}`);
        doc.text(`Diagnóstico: ${paciente.diagnostico}`);
        doc.text(`Habitación: ${paciente.habitacion}`);
        doc.text(`Fecha de Ingreso: ${new Date(paciente.fechaIngreso).toLocaleDateString()}`);

        // Finalizar el PDF
        doc.end();

    } catch (error) {
        console.error('Error al generar PDF:', error); // Para debugging
        res.status(500).send('Error al generar el PDF');
    }
}

module.exports = {
    generatePDF
}; 