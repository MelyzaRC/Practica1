const express = require('express');
const router = express.Router();
const mysqlConnection = require('../database');

/*---------------------CONSULTA1---------------------*/
router.get('/consulta1', (req, res) =>{
    res.json('Contenido de la consulta1');
});

/*---------------------CONSULTA2---------------------*/
router.get('/consulta2', (req, res) =>{
    res.json('Contenido de la consulta2');
});

/*---------------------CONSULTA3---------------------*/
router.get('/consulta3', (req, res) =>{
    res.json('Contenido de la consulta3');
});

/*---------------------CONSULTA4---------------------*/
router.get('/consulta4', (req, res) =>{
    res.json('Contenido de la consulta4');
});

/*---------------------CONSULTA5---------------------*/
router.get('/consulta5', (req, res) =>{
    res.json('Contenido de la consulta5');
});

/*---------------------CONSULTA6---------------------*/
router.get('/consulta6', (req, res) =>{
    res.json('Contenido de la consulta6');
});

/*---------------------CONSULTA7---------------------*/
router.get('/consulta7', (req, res) =>{
    res.json('Contenido de la consulta7');
});

/*---------------------CONSULTA8---------------------*/
router.get('/consulta8', (req, res) =>{
    res.json('Contenido de la consulta8');
});

/*---------------------CONSULTA9---------------------*/
router.get('/consulta9', (req, res) =>{
    res.json('Contenido de la consulta9');
});

/*---------------------CONSULTA10---------------------*/
router.get('/consulta10', (req, res) =>{
    res.json('Contenido de la consulta10');
});

/*---------------------ELIMINARTEMPORAL---------------------*/
router.get('/eliminarTemporal', (req, res) =>{
    res.json('Contenido de la consulta eliminarTemporal');
});

/*---------------------ELIMINARMODELO---------------------*/
router.get('/eliminarModelo', (req, res) =>{
    res.json('Contenido de la consulta eliminarModelo');
});

/*---------------------CARGARTEMPORAL---------------------*/
router.get('/cargarTemporal', (req, res) =>{
    const query = `LOAD DATA LOCAL INFILE \'/home/melyza/Documents/Practica1/DataCenterData.csv\'
    INTO TABLE temporal
    FIELDS TERMINATED BY \';\'
    LINES TERMINATED BY \'\n\'
    IGNORE 1 ROWS
    (
        nombre_compania, 
        contacto_compania, 
        correo_compania, 
        telefono_compania, 
        tipo, 
        nombre, 
        correo, 
        telefono,
        fecha_registro, 
        direccion, 
        ciudad, 
        codigo_postal, 
        region, 
        producto, 
        categoria_producto,
        cantidad,
        precio_unitario
    );
    `;
    mysqlConnection.query(query, (err, rows, fields) =>{
        if (!err){
            //res.json(rows);
            res.json({status:'Se ha cargado los datos a la tabla temporal con exito'});
        }else{
            console.log(err);
        }
    });
});

/*---------------------CARGARMODELO---------------------*/
router.get('/cargarModelo', (req, res) =>{
    res.json('Contenido de la consulta cargarModelo');
});

router.get('/verCompanias', (req, res) =>{
    mysqlConnection.query('select * from compania', (err, rows, fields) =>{
        if (!err){
            res.json(rows);
        }else{
            console.log(err);
        }
    });
});


/*
router.get('/:id', (req, res) => {
    const {id} = req.params;
    mysqlConnection.query('select * from employees where id = ?', [id], (err, rows, fields) =>{
        if (!err){
            res.json(rows[0]);
        }else{
            console.log(err);
        }
    });
});

router.post('/', (req, res) =>{
    const {id, name, salary} = req.body;
    const query = `
        CALL employeeAddOrEdit(?, ?, ?);
    `;
    mysqlConnection.query(query, [id, name, salary], (err, rows, fields) =>{
        if (!err){
            res.json({Status: 'Employeed Saved'});
        }else{
            console.log(err);
        }
    })
});

router.put('/:id', (req, res) =>{
    const {name, salary} = req.body;
    const {id} = req.params;
    const query = `
        CALL employeeAddOrEdit(?,?,?)
    `;
    mysqlConnection.query(query, [id, name, salary], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Empleado actualizado'});
        }else{
            console.log(err);
        }
    });
});

router.delete('/:id', (req, res) => {
    const {id} = req.params;
    mysqlConnection.query('DELETE from employees where id =?', [id], (err, rows, fields) =>{
        if(!err){
            res.json({status:'Empleado eliminado'});
        }else{
            console.log(err);
        }
    });
});*/
module.exports = router;