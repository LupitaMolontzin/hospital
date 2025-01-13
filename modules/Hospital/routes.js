// routes/userRoutes.js
const express = require('express');
const Pacientes = require('./pacientes/models');
const Doctores = require('./doctores/models');
const Areas = require('./areas/models');
const { generatePDF } = require('./controllers/pdfController');

const router = express.Router();

const configbaseRoutes = require('../../routes/baseRoutes');

module.exports = function(app) {
    router.get('/pacientes/download-pdf/:id', async (req, res) => {
        console.log('Intentando generar PDF para ID:', req.params.id); // Para debugging
        await generatePDF(req, res);
    });

    configbaseRoutes(router, {
        moduleName: 'Hospital/pacientes',
        view_list: 'list',
        view_form: 'form',
        model: Pacientes,
        route: '/pacientes',
        title: 'Pacientes'
    });
    configbaseRoutes(router, {
        moduleName: 'Hospital/doctores',
        view_list: 'list',
        view_form: 'form',
        model: Doctores,
        route: '/doctores',
        title: 'Doctores'
    });
    configbaseRoutes(router, {
        moduleName: 'Hospital/areas',
        view_list: 'list',
        view_form: 'form',
        model: Areas,
        route: '/areas',
        title: 'Areas'
    });

    router.get('/pacientes/new', (req, res) => {
        res.render('Hospital/pacientes/views/form', {
            moduleName: 'Hospital/pacientes',
            typeform: 'new',
            error_msg: [],
            item: {
                fechaIngreso: new Date()
            },
            title: 'Nuevo Paciente'
        });
    });

    router.post('/pacientes/create', async (req, res) => {
        try {
            const nuevoPaciente = new Pacientes(req.body);
            await nuevoPaciente.save();
            res.redirect('/Hospital/pacientes');
        } catch (error) {
            console.error(error);
            res.redirect('/Hospital/pacientes');
        }
    });

    router.get('/form/:id?', (req, res) => {
        res.render('Hospital/pacientes/views/form', {
            moduleName: 'Hospital/pacientes',
            typeform: req.params.id ? 'edit' : 'new',
            error_msg: [],
            item: null,
            title: 'Pacientes'
        });
    });

    router.post('/form/new', async (req, res) => {
        try {
            const nuevoPaciente = new Pacientes({
                nombre: req.body.nombre,
                edad: req.body.edad,
                genero: req.body.genero,
                diagnostico: req.body.diagnostico,
                habitacion: req.body.habitacion,
                fechaIngreso: req.body.fechaIngreso
            });

            await nuevoPaciente.save();
            res.redirect(`/Hospital/pacientes/list`);
        } catch (error) {
            res.render('Hospital/pacientes/views/form', {
                moduleName: 'Hospital/pacientes',
                error_msg: ['Error al guardar el paciente'],
                item: req.body,
                typeform: 'new'
            });
        }
    });

    router.get('/form/:id?', (req, res) => {
        res.render('Hospital/doctores/views/form', {
            moduleName: 'Hospital/doctores',
            typeform: req.params.id ? 'edit' : 'new',
            error_msg: [],
            item: null,
            title: 'Doctores'
        });
    });

    router.post('/form/new', async (req, res) => {
        try {
            const nuevoDoctor = new Doctores({
                nombre: req.body.nombre,
                especialidad: req.body.especialidad,
                cedula: req.body.cedula,
                telefono: req.body.telefono,
                email: req.body.email,
                area: req.body.area
            });

            await nuevoDoctor.save();
            res.redirect(`/Hospital/doctores/list`);
        } catch (error) {
            res.render('Hospital/doctores/views/form', {
                moduleName: 'Hospital/doctores',
                error_msg: ['Error al guardar el doctor'],
                item: req.body,
                typeform: 'new'
            });
        }
    });

    // Mostrar formulario de nuevo doctor
    router.get('/doctores/new', (req, res) => {
        res.render('Hospital/doctores/views/form', {
            moduleName: 'Hospital/doctores',
            typeform: 'new',
            error_msg: [],
            item: {},
            title: 'Nuevo Doctor'
        });
    });

    // Crear nuevo doctor
    router.post('/doctores/create', async (req, res) => {
        try {
            // Capitalizar la primera letra del turno
            const turno = req.body.turno.charAt(0).toUpperCase() + req.body.turno.slice(1).toLowerCase();
            
            const nuevoDoctor = new Doctores({
                nombre: req.body.nombre,
                cedula: req.body.cedula,
                especialidad: req.body.especialidad,
                turno: turno, // Ahora usamos el valor formateado correctamente
                telefono: req.body.telefono,
                email: req.body.email
            });
            
            await nuevoDoctor.save();
            res.redirect('/Hospital/doctores/list');
        } catch (error) {
            console.error('Error al crear doctor:', error);
            const errorMsg = error.errors?.turno ? 
                `Valor de turno no válido: ${error.errors.turno.value}. Los valores permitidos son: Matutino, Vespertino, Nocturno` : 
                'Error al guardar el doctor';
            
            res.render('Hospital/doctores/views/form', {
                moduleName: 'Hospital/doctores',
                typeform: 'new',
                error_msg: [errorMsg],
                item: req.body,
                title: 'Nuevo Doctor'
            });
        }
    });

    // Mostrar formulario de edición
    router.get('/doctores/edit/:id', async (req, res) => {
        try {
            const doctor = await Doctores.findById(req.params.id);
            if (!doctor) {
                return res.redirect('/Hospital/doctores/list');
            }
            res.render('Hospital/doctores/views/form', {
                moduleName: 'Hospital/doctores',
                typeform: 'edit',
                error_msg: [],
                item: doctor,
                title: 'Editar Doctor'
            });
        } catch (error) {
            console.error(error);
            res.redirect('/Hospital/doctores/list');
        }
    });

    // Actualizar doctor
    router.post('/doctores/update/:id', async (req, res) => {
        try {
            const doctorActualizado = {
                nombre: req.body.nombre,
                cedula: req.body.cedula,
                especialidad: req.body.especialidad,
                turno: req.body.turno,
                telefono: req.body.telefono,
                email: req.body.email
            };
            
            await Doctores.findByIdAndUpdate(req.params.id, doctorActualizado);
            res.redirect('/Hospital/doctores/list');
        } catch (error) {
            console.error('Error al actualizar doctor:', error);
            res.render('Hospital/doctores/views/form', {
                moduleName: 'Hospital/doctores',
                typeform: 'edit',
                error_msg: ['Error al actualizar el doctor'],
                item: req.body,
                title: 'Editar Doctor'
            });
        }
    });

    // Eliminar doctor
    router.delete('/doctores/delete/:id', async (req, res) => {
        try {
            await Doctores.findByIdAndDelete(req.params.id);
            res.json({ success: true });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: 'Error al eliminar el doctor' });
        }
    });

    // Listar doctores
    router.get('/doctores/list', async (req, res) => {
        try {
            const doctores = await Doctores.find();
            res.render('Hospital/doctores/views/list', {
                moduleName: 'Hospital/doctores',
                items: doctores,
                error_msg: [],
                title: 'Lista de Doctores'
            });
        } catch (error) {
            console.error(error);
            res.render('Hospital/doctores/views/list', {
                moduleName: 'Hospital/doctores',
                items: [],
                error_msg: ['Error al cargar la lista de doctores'],
                title: 'Lista de Doctores'
            });
        }
    });

    // Mostrar formulario de nueva área
    router.get('/areas/new', (req, res) => {
        res.render('Hospital/areas/views/form', {
            moduleName: 'Hospital/areas',
            typeform: 'new',
            error_msg: [],
            item: {},
            title: 'Nueva Área'
        });
    });

    // Crear nueva área
    router.post('/areas/create', async (req, res) => {
        try {
            console.log('Body completo recibido:', req.body);
            console.log('Nombre recibido:', req.body.nombre);
            console.log('Tipo de nombre:', typeof req.body.nombre);

            // Agregar validación más robusta
            if (!req.body.nombre || typeof req.body.nombre !== 'string' || req.body.nombre.trim() === '') {
                throw new Error('El nombre del área es requerido');
            }

            const nuevaArea = new Areas({
                nombre: req.body.nombre.trim(),
                descripcion: req.body.descripcion || '',
                piso: Number(req.body.piso) || 1,
                capacidad: Number(req.body.capacidad) || 0,
                especialidad: req.body.especialidad || ''
            });
            
            await nuevaArea.save();
            res.redirect('/Hospital/areas/list');
        } catch (error) {
            console.error('Error al crear área:', error);
            res.render('Hospital/areas/views/form', {
                moduleName: 'Hospital/areas',
                typeform: 'new',
                error_msg: [error.message],
                item: req.body,
                title: 'Nueva Área'
            });
        }
    });

    // Mostrar formulario de edición de área
    router.get('/areas/edit/:id', async (req, res) => {
        try {
            const area = await Areas.findById(req.params.id);
            if (!area) {
                return res.redirect('/Hospital/areas/list');
            }
            res.render('Hospital/areas/views/form', {
                moduleName: 'Hospital/areas',
                typeform: 'edit',
                error_msg: [],
                item: area,
                title: 'Editar Área'
            });
        } catch (error) {
            console.error(error);
            res.redirect('/Hospital/areas/list');
        }
    });

    // Actualizar área
    router.post('/areas/update/:id', async (req, res) => {
        try {
            const areaActualizada = {
                nombre: req.body.nombre,
                descripcion: req.body.descripcion,
                ubicacion: req.body.ubicacion,
                capacidad: req.body.capacidad
            };
            
            await Areas.findByIdAndUpdate(req.params.id, areaActualizada);
            res.redirect('/Hospital/areas/list');
        } catch (error) {
            console.error('Error al actualizar área:', error);
            res.render('Hospital/areas/views/form', {
                moduleName: 'Hospital/areas',
                typeform: 'edit',
                error_msg: ['Error al actualizar el área'],
                item: req.body,
                title: 'Editar Área'
            });
        }
    });

    // Eliminar área
    router.delete('/areas/delete/:id', async (req, res) => {
        try {
            await Areas.findByIdAndDelete(req.params.id);
            res.json({ success: true });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: 'Error al eliminar el área' });
        }
    });

    // Listar áreas
    router.get('/areas/list', async (req, res) => {
        try {
            const areas = await Areas.find();
            res.render('Hospital/areas/views/list', {
                moduleName: 'Hospital/areas',
                items: areas,
                error_msg: [],
                title: 'Lista de Áreas'
            });
        } catch (error) {
            console.error(error);
            res.render('Hospital/areas/views/list', {
                moduleName: 'Hospital/areas',
                items: [],
                error_msg: ['Error al cargar la lista de áreas'],
                title: 'Lista de Áreas'
            });
        }
    });

    app.use('/Hospital', router);
};