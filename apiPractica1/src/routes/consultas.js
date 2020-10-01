const express = require('express');
const router = express.Router();
const mysqlConnection = require('../database');

/*---------------------CONSULTA1---------------------*/
router.get('/consulta1', (req, res) =>{
    const query = `SELECT 
                        v.nombre AS nombreProveedor, 
                        v.telefono, 
                        r.no_orden, 
                        SUM(d.cantidad * p.precio_unitario) AS total
                    FROM detalle_compra d, producto p, compra r, proveedor v, compania m
                    WHERE
                        d.producto = p.producto 
                    AND 
                        d.no_orden = r.no_orden 
                    AND
                        r.proveedor = v.proveedor 
                    AND 
                        m.compania = r.compania
                    GROUP BY r.no_orden
                    ORDER BY total DESC
                    LIMIT 1;`;
    mysqlConnection.query(query, (err, rows, fields) =>{
        if (!err){
            if (!err){
                res.json(rows);
            }else{
                console.log(err);
            }
        }else{
            console.log(err);
        }
    });
});

/*---------------------CONSULTA2---------------------*/
router.get('/consulta2', (req, res) =>{
    const query = ` SELECT 
	                    v.cliente,
	                    v.nombre,
	                    SUM(d.cantidad * p.precio_unitario) AS total
                    FROM detalle_venta d, producto p, venta r, cliente v
                    WHERE
		                d.producto = p.producto 
	                AND 
		                d.no_orden = r.no_orden 
	                AND
		                r.cliente = v.cliente 
                    GROUP BY r.no_orden
                    ORDER BY total DESC
                    LIMIT 1;`;
    mysqlConnection.query(query, (err, rows, fields) =>{
        if (!err){
            if (!err){
                res.json(rows);
            }else{
                console.log(err);
            }
        }else{
            console.log(err);
        }
    });
});

/*---------------------CONSULTA3---------------------*/
router.get('/consulta3', (req, res) =>{
    const query = ` SELECT 
                        direccion, 
                        region, 
                        ciudad, 
                        codigo_postal
                    FROM(
                        (SELECT p.direccion as direccion, t.region as region, t.ciudad as ciudad, p.codigo_postal as codigo_postal, sum(d.cantidad) as maximo
                        FROM detalle_compra d, proveedor p, codigo_postal t, compra c
                        WHERE 
                            d.no_orden = c.no_orden and 
                            p.proveedor = c.proveedor and 
                            p.codigo_postal = t.codigo_postal 
                        GROUP BY d.no_orden
                        ORDER BY maximo DESC
                        LIMIT 1)
                        UNION ALL
                        (SELECT p.direccion as direccion, t.region as region, t.ciudad as ciudad, p.codigo_postal as codigo_postal, sum(d.cantidad) as maximo
                        FROM detalle_compra d, proveedor p, codigo_postal t, compra c
                        WHERE 
                            d.no_orden = c.no_orden and 
                            p.proveedor = c.proveedor and 
                            p.codigo_postal = t.codigo_postal 
                        GROUP BY d.no_orden
                        ORDER BY maximo ASC
                        LIMIT 1)
                    ) datos;`;
    mysqlConnection.query(query, (err, rows, fields) =>{
        if (!err){
            if (!err){
                res.json(rows);
            }else{
                console.log(err);
            }
        }else{
            console.log(err);
        }
    });
});

/*---------------------CONSULTA4---------------------*/
router.get('/consulta4', (req, res) =>{
    const query = ` SELECT 
                        c.cliente as ID,
                        c.nombre as Nombre,
                        SUM(d.cantidad) AS Cantidad,
                        SUM(d.cantidad * p.precio_unitario) as Total
                    FROM detalle_venta d, venta r, cliente c, categoria_producto a, producto p
                    WHERE
                            d.no_orden = r.no_orden 
                        AND
                            r.cliente = c.cliente 
                        AND 
                            a.categoria = p.categoria 
                        AND
                            p.producto = d.producto
                        AND
                            a.nombre = 'Cheese'
                    GROUP BY ID
                    ORDER BY Cantidad DESC
                    LIMIT 5;`;
    mysqlConnection.query(query, (err, rows, fields) =>{
        if (!err){
            if (!err){
                res.json(rows);
            }else{
                console.log(err);
            }
        }else{
            console.log(err);
        }
    });
});

/*---------------------CONSULTA5---------------------*/
router.get('/consulta5', (req, res) =>{
    const query = ` SELECT
                        date_format( t2.fecha_registro,'%m') as Mes,
                        t2.nombre as Cliente,
                        SUM(p2.precio_unitario*d2.cantidad) as TotalActual
                    FROM venta v2, detalle_venta d2, cliente t2, producto p2
                    WHERE
                            v2.no_orden = d2.no_orden
                        AND 
                            v2.cliente = t2.cliente
                        AND 
                            p2.producto = d2.producto
                    GROUP BY v2.no_orden
                    HAVING 
                            TotalActual = (SELECT max(Total) as maximo FROM (
                                                                    SELECT 
                                                                        SUM(p.precio_unitario*d.cantidad) as Total
                                                                    FROM venta v, detalle_venta d, cliente t, producto p
                                                                    WHERE
                                                                            v.no_orden = d.no_orden
                                                                        AND 
                                                                            v.cliente = t.cliente
                                                                        AND 
                                                                            p.producto = d.producto
                                                                    GROUP BY v.no_orden 
                                                                    ORDER BY Total DESC
                                                                )datos )
                        OR 
                            TotalActual = (SELECT min(Total) as minimo FROM (
                                                                    SELECT 
                                                                        SUM(p.precio_unitario*d.cantidad) as Total
                                                                    FROM venta v, detalle_venta d, cliente t, producto p
                                                                    WHERE
                                                                            v.no_orden = d.no_orden
                                                                        AND 
                                                                            v.cliente = t.cliente
                                                                        AND 
                                                                            p.producto = d.producto
                                                                    GROUP BY v.no_orden 
                                                                    ORDER BY Total DESC
                                                                )datos )
                    ORDER BY TotalActual DESC
                    ;`;
    mysqlConnection.query(query, (err, rows, fields) =>{
        if (!err){
            if (!err){
                res.json(rows);
            }else{
                console.log(err);
            }
        }else{
            console.log(err);
        }
    });
});

/*---------------------CONSULTA6---------------------*/
router.get('/consulta6', (req, res) =>{
    const query = ` SELECT
                        c.nombre as Categoria,
                        SUM(d.cantidad*p.precio_unitario) as Total
                    FROM categoria_producto c, producto p, detalle_venta d
                    WHERE
                            c.categoria = p.categoria
                        AND
                            d.producto = p.producto
                    GROUP BY c.categoria
                    HAVING Total = (SELECT 
                                        max(Total1) AS maximo 
                                    FROM (
                                        SELECT SUM(p1.precio_unitario*d1.cantidad) as Total1 
                                        FROM
                                            categoria_producto c1, producto p1, detalle_venta d1
                                        WHERE 
                                                c1.categoria = p1.categoria
                                            AND
                                                d1.producto = p1.producto
                                        GROUP BY c1.categoria)datos
                                    )
                                OR 
                            Total = (SELECT 
                                        min(Total1) AS minimo 
                                    FROM (
                                        SELECT SUM(p1.precio_unitario*d1.cantidad) as Total1 
                                        FROM
                                            categoria_producto c1, producto p1, detalle_venta d1
                                        WHERE 
                                                c1.categoria = p1.categoria
                                            AND
                                                d1.producto = p1.producto
                                        GROUP BY c1.categoria)datos
                                    )
                    ORDER BY Total DESC`;
    mysqlConnection.query(query, (err, rows, fields) =>{
        if (!err){
            if (!err){
                res.json(rows);
            }else{
                console.log(err);
            }
        }else{
            console.log(err);
        }
    });
});

/*---------------------CONSULTA7---------------------*/
router.get('/consulta7', (req, res) =>{
    const query = ` SELECT 
                        p.proveedor as ID,
                        p.nombre as Proveedor,
                        SUM(d.cantidad) as Cantidad,
                        SUM(d.cantidad * t.precio_unitario) as Total
                    FROM proveedor p, compra c, producto t, categoria_producto g, detalle_compra d
                    WHERE
                            p.proveedor = c.proveedor 
                        AND
                            c.no_orden = d.no_orden
                        AND
                            d.producto = t.producto 
                        AND 
                            t.categoria = g.categoria
                        AND 
                            g.nombre = 'Fresh Vegetables'
                    GROUP BY ID
                    ORDER BY Total DESC
                    LIMIT 5;`;
    mysqlConnection.query(query, (err, rows, fields) =>{
        if (!err){
            if (!err){
                res.json(rows);
            }else{
                console.log(err);
            }
        }else{
            console.log(err);
        }
    });
});

/*---------------------CONSULTA8---------------------*/
router.get('/consulta8', (req, res) =>{
    const query = ` SELECT
                        t.direccion as Direccion,
                        r.nombre as Region,
                        c.codigo_postal as CodigoPostal
                    FROM codigo_postal c, region r, cliente t, detalle_venta d, venta v, producto o
                    WHERE
                            c.codigo_postal = t.codigo_postal
                        AND
                            c.region = r.region
                        AND 
                            d.producto = o.producto
                        AND 
                            v.no_orden = d.no_orden
                        AND 
                            v.cliente = t.cliente
                    GROUP BY t.cliente
                    HAVING SUM(d.cantidad*o.precio_unitario) = 	    (  
                                                                    SELECT MAX(Total) FROM	(
                                                                                                SELECT
                                                                                                    SUM(d1.cantidad*o1.precio_unitario) as Total
                                                                                                FROM codigo_postal c1, region r1, cliente t1, detalle_venta d1, venta v1, producto o1
                                                                                                WHERE
                                                                                                        c1.codigo_postal = t1.codigo_postal
                                                                                                    AND
                                                                                                        c1.region = r1.region
                                                                                                    AND 
                                                                                                        d1.producto = o1.producto
                                                                                                    AND 
                                                                                                        v1.no_orden = d1.no_orden
                                                                                                    AND 
                                                                                                        v1.cliente = t1.cliente
                                                                                                GROUP BY t1.cliente
                                                                                            ) datos
                                                                    )
                            OR
                            SUM(d.cantidad*o.precio_unitario) = 	(
                                                                    SELECT MIN(Total) FROM	(
                                                                                                SELECT
                                                                                                    SUM(d1.cantidad*o1.precio_unitario) as Total
                                                                                                FROM codigo_postal c1, region r1, cliente t1, detalle_venta d1, venta v1, producto o1
                                                                                                WHERE
                                                                                                        c1.codigo_postal = t1.codigo_postal
                                                                                                    AND
                                                                                                        c1.region = r1.region
                                                                                                    AND 
                                                                                                        d1.producto = o1.producto
                                                                                                    AND 
                                                                                                        v1.no_orden = d1.no_orden
                                                                                                    AND 
                                                                                                        v1.cliente = t1.cliente
                                                                                                GROUP BY t1.cliente
                                                                                            ) datos
                                                                    )
                    ORDER BY SUM(d.cantidad*o.precio_unitario) DESC
                    ;`;
    mysqlConnection.query(query, (err, rows, fields) =>{
        if (!err){
            if (!err){
                res.json(rows);
            }else{
                console.log(err);
            }
        }else{
            console.log(err);
        }
    });
});

/*---------------------CONSULTA9---------------------*/
router.get('/consulta9', (req, res) =>{
    const query = ` SELECT
                        p.nombre,
                        p.telefono,
                        v.no_orden,
                        SUM(d.cantidad*t.precio_unitario) as Total
                    FROM proveedor p, compra v, detalle_compra d, producto t, compania n
                    WHERE
                            v.proveedor = p.proveedor
                        AND
                            d.no_orden = v.no_orden
                        AND 
                            d.producto = t.producto 
                        AND 
                            v.compania = n.compania 
                    GROUP BY v.no_orden
                    HAVING
                        SUM(d.cantidad) = (
                                            SELECT 
                                                MIN(Cantidad)
                                            FROM (
                                                SELECT 
                                                    SUM(d1.cantidad) as Cantidad
                                                FROM proveedor p1, compra v1, detalle_compra d1, producto t1, compania n1
                                                WHERE
                                                        v1.proveedor = p1.proveedor
                                                    AND
                                                        d1.no_orden = v1.no_orden
                                                    AND 
                                                        d1.producto = t1.producto 
                                                    AND 
                                                        v1.compania = n1.compania
                                                GROUP BY v1.no_orden
                                                ORDER BY Cantidad ASC
                                            )datos
                                )
                    ORDER BY Total DESC;
                    ;`;
    mysqlConnection.query(query, (err, rows, fields) =>{
        if (!err){
            if (!err){
                res.json(rows);
            }else{
                console.log(err);
            }
        }else{
            console.log(err);
        }
    });
});


/*---------------------CONSULTA10---------------------*/
router.get('/consulta10', (req, res) =>{
    const query = ` SELECT
                        c.cliente as ID,
                        c.nombre as Cliente,
                        c.correo as Email,
                        c.telefono as Telefono,
                        c.fecha_registro as FechaRegistro,
                        c.codigo_postal as CodigoPostal,
                        SUM(d.cantidad) as Cantidad
                    FROM cliente c, venta v, detalle_venta d, producto p, categoria_producto g
                    WHERE
                            c.cliente = v.cliente
                        AND
                            d.no_orden = v.no_orden
                        AND 
                            d.producto = p.producto 
                        AND
                            p.categoria = g.categoria
                        AND 
                            g.nombre = 'Seafood'
                    GROUP BY c.cliente
                    ORDER BY SUM(d.cantidad) DESC
                    LIMIT 10;`;
    mysqlConnection.query(query, (err, rows, fields) =>{
        if (!err){
            if (!err){
                res.json(rows);
            }else{
                console.log(err);
            }
        }else{
            console.log(err);
        }
    });
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