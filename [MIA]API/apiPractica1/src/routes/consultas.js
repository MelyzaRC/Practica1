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
    const query = ` TRUNCATE TABLE temporal;`;
    mysqlConnection.query(query, (err, rows, fields) =>{
        if (!err){
            if (!err){
                res.json({'status':'Los datos de la tabla temporal han sido eliminados con exito'});
            }else{
                console.log(err);
            }
        }else{
            console.log(err);
        }
    });
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
    const query0 = `    INSERT INTO compania(nombre, contacto, correo, telefono)
                        SELECT DISTINCT 
                            t.nombre_compania, 
                            t.contacto_compania, 
                            t.correo_compania, 
                            t.telefono_compania 
                        FROM temporal t;`;
    const query1 = `    INSERT INTO region(nombre)
                        SELECT DISTINCT 
                            t.region
                        FROM temporal t;`;
    const query2 = `    INSERT INTO codigo_postal(codigo_postal, ciudad, region)
                        SELECT DISTINCT 
                            CAST(t.codigo_postal AS DECIMAL), 
                            t.ciudad, 
                            r.region
                        FROM temporal t, region r
                        WHERE t.region = r.nombre ;`;
    const query3 = `    INSERT INTO proveedor(nombre, correo, telefono, fecha_registro, direccion, codigo_postal)
                        SELECT DISTINCT 
                            t.nombre, 
                            t.correo,
                            t.telefono, 
                            str_to_date(t.fecha_registro, '%d/%m/%Y'),
                            t.direccion,
                            c.codigo_postal
                        FROM temporal t, codigo_postal c
                        WHERE 
                                t.tipo = 'p'
                            AND 
                                c.codigo_postal = t.codigo_postal;`;
    const query4 = `    INSERT INTO cliente(nombre, correo, telefono, fecha_registro, direccion, codigo_postal)
                        SELECT DISTINCT 
                            t.nombre, 
                            t.correo,
                            t.telefono, 
                            str_to_date(t.fecha_registro, '%d/%m/%Y'),
                            t.direccion,
                            t.codigo_postal
                        FROM temporal t, codigo_postal c
                        WHERE 
                                t.tipo = 'c'
                            AND
                                c.codigo_postal = t.codigo_postal;`;
    const query5 = `    INSERT INTO categoria_producto(nombre)
                        SELECT DISTINCT 
                            t.categoria_producto 
                        FROM temporal t;`;
    const query6 = `    INSERT INTO producto(nombre, precio_unitario, categoria)
                        SELECT DISTINCT 
                            t.producto,
                            CAST(t.precio_unitario AS DECIMAL),
                            c.categoria
                        FROM temporal t, categoria_producto c
                        WHERE
                                c.nombre = t.categoria_producto;`;
    const query7 = `    INSERT INTO compra(compania, proveedor)	
                        SELECT DISTINCT 
                            c.compania,
                            p.proveedor
                        FROM temporal t, compania c, proveedor p
                        WHERE 
                                c.nombre = t.nombre_compania
                            AND
                                p.nombre = t.nombre
                            AND
                                t.tipo = 'p';`;
    const query8 = `    INSERT INTO detalle_compra(no_orden, producto, cantidad)
                        SELECT 
                            c.no_orden, 
                            d.producto, 
                            t.cantidad
                        FROM compra c, proveedor p, compania n, producto d, temporal t
                        WHERE 
                                t.tipo = 'p' 
                            AND
                                c.proveedor = p.proveedor 
                            AND
                                n.compania = c.compania 
                            AND 
                                t.nombre = p.nombre 
                            AND
                                t.nombre_compania = n.nombre 
                            AND
                                d.nombre = t.producto;`;
    const query9 = `    INSERT INTO venta(compania, cliente)	
                        SELECT DISTINCT 
                            c.compania,
                            e.cliente
                        FROM temporal t, compania c, cliente e
                        WHERE 
                                c.nombre = t.nombre_compania
                            AND
                                e.nombre = t.nombre
                            AND
                                t.tipo = 'c';`;
    const query10 = `   INSERT INTO detalle_venta(no_orden, producto, cantidad)
                        SELECT 
                            c.no_orden, 
                            d.producto, 
                            t.cantidad
                        FROM venta c, cliente p, compania n, producto d, temporal t
                        WHERE 
                                t.tipo = 'c' 
                            AND
                                c.cliente = p.cliente
                            AND
                                n.compania = c.compania 
                            AND 
                                t.nombre = p.nombre 
                            AND
                                t.nombre_compania = n.nombre 
                            AND
                                d.nombre = t.producto;`;

    mysqlConnection.query(query0, (err, rows, fields) =>{
        if (!err){
        }else{
        }
    });
    mysqlConnection.query(query1, (err, rows, fields) =>{
        if (!err){
        }else{
        }
    });
    mysqlConnection.query(query2, (err, rows, fields) =>{
        if (!err){
        }else{
        }
    });
    mysqlConnection.query(query3, (err, rows, fields) =>{
        if (!err){
        }else{
        }
    });
    mysqlConnection.query(query4, (err, rows, fields) =>{
        if (!err){
        }else{
        }
    });
    mysqlConnection.query(query5, (err, rows, fields) =>{
        if (!err){
        }else{
        }
    });
    mysqlConnection.query(query6, (err, rows, fields) =>{
        if (!err){
        }else{
        }
    });
    mysqlConnection.query(query7, (err, rows, fields) =>{
        if (!err){
        }else{
        }
    });
    mysqlConnection.query(query8, (err, rows, fields) =>{
        if (!err){
        }else{
        }
    });
    mysqlConnection.query(query9, (err, rows, fields) =>{
        if (!err){
        }else{
        }
    });
    mysqlConnection.query(query10, (err, rows, fields) =>{
        if (!err){
            res.json({status:'Se ha cargado los datos al modelo con exito'});
        }else{
        }
    });
});

/*---------------------ELIMINARMODELO---------------------*/
router.get('/eliminarModelo', (req, res) =>{
    const query0 = `SET FOREIGN_KEY_CHECKS = 0;`;
    const query1 = `TRUNCATE region;`;
    const query2 = `TRUNCATE codigo_postal;`;
    const query3 = `TRUNCATE proveedor;`;
    const query4 = `TRUNCATE cliente;`;
    const query5 = `TRUNCATE compania;`;
    const query6 = `TRUNCATE categoria_producto;`;
    const query7 = `TRUNCATE producto;`;
    const query8 = `TRUNCATE venta;`;
    const query9 = `TRUNCATE compra`;
    const query10 = `TRUNCATE detalle_venta`;
    const query11 = `TRUNCATE detalle_compra`;
    const query12 = `SET FOREIGN_KEY_CHECKS = 1;`;
    mysqlConnection.query(query0, (err, rows, fields) =>{
        if (!err){
        }else{
        }
    });
    mysqlConnection.query(query1, (err, rows, fields) =>{
        if (!err){
        }else{
        }
    });
    mysqlConnection.query(query2, (err, rows, fields) =>{
        if (!err){
        }else{
        }
    });
    mysqlConnection.query(query3, (err, rows, fields) =>{
        if (!err){
        }else{
        }
    });
    mysqlConnection.query(query4, (err, rows, fields) =>{
        if (!err){
        }else{
        }
    });
    mysqlConnection.query(query5, (err, rows, fields) =>{
        if (!err){
        }else{
        }
    });
    mysqlConnection.query(query6, (err, rows, fields) =>{
        if (!err){
        }else{
        }
    });
    mysqlConnection.query(query7, (err, rows, fields) =>{
        if (!err){
        }else{
        }
    });
    mysqlConnection.query(query8, (err, rows, fields) =>{
        if (!err){
        }else{
        }
    });
    mysqlConnection.query(query9, (err, rows, fields) =>{
        if (!err){
        }else{
        }
    });
    mysqlConnection.query(query10, (err, rows, fields) =>{
        if (!err){
        }else{
        }
    });
    mysqlConnection.query(query11, (err, rows, fields) =>{
        if (!err){
        }else{
        }
    });
    mysqlConnection.query(query12, (err, rows, fields) =>{
        if (!err){
            res.json({status:'Se ha vaciado el modelo con exito'});
        }else{
        }
    });
});

module.exports = router;