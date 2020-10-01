/*CONSULTA NO.1
	-nombre del proveedor
	-número de teléfono
	-número de orden
	-total de la orden por la cual se haya pagado la mayor cantidad de dinero.
*/
SELECT 
	v.nombre as nombreProveedor, 
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
LIMIT 1;
/*RESULTADO -> 'Kiona Trevino', '054-441-4452', '179', '16934', 'Sociosqu PC'*/


/*CONSULTA NO. 2
	-Número de cliente
    -Nombre y pellido
    -Total (de productos) del cliente que más productos ha comprado.
*/
SELECT 
	c.cliente,
	c.nombre,
    SUM(d.cantidad) AS total
FROM detalle_venta d, venta r, cliente c
WHERE
		d.no_orden = r.no_orden 
	AND
		r.cliente = c.cliente 
GROUP BY r.no_orden
ORDER BY total DESC
LIMIT 1;
/*RESULTADO->'84', 'Macon Bowman', '56'*/
/*Si fuera total de dinero*/
SELECT 
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
LIMIT 1;
/*RESULTADO->'84', 'Macon Bowman', '16526'*/


/*CONSULTA NO.3
	-Dirección
    -Región
    -Ciudad
    -Código postal hacia la cual se han hecho más solicitudes de pedidos y a cuál menos 
    (en una sola consulta).
*/
SELECT 
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
) datos;
/*Resultado->
MAS    '694-5400 Vel Ave', 'Oklahoma', 'Tulsa', '52461', '68'
MENOS  'P.O. Box 127, 9754 Ornare, Street', 'WA', 'Vancouver', '86739', '1'
*/

/*CONSULTA No.4
	-Número de cliente, 
    -Nombre, 
    -Apellido,
    -Número de órdenes que ha realizado
    -Total de cada uno de los cinco clientes que más han comprado productos de la categoría ‘Cheese’.
*/
SELECT 
	c.cliente,
	c.nombre,
    SUM(d.cantidad) AS totalProductos,
    SUM(d.cantidad * p.precio_unitario) as totalMonetario
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
GROUP BY c.cliente
ORDER BY totalProductos DESC
LIMIT 5;
/*RESULTADO->
'59', 'Forrest Good', '28', '8714'
'26', 'Chadwick Osborne', '25', '7396'
'15', 'Allistair Mcguire', '17', '5033'
'49', 'Briar Morrison', '16', '6666'
'69', 'Felicia Wolf', '15', '3380'
*/

/*CONSULTA No. 5
	-Número de mes de la fecha de registro, 
    -Nombre y apellido de todos los clientes que más han comprado y los que menos han comprado (en dinero) utilizando una sola consulta.
*/
SELECT
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
;
/*RESULTADO->
'07', 'Macon Bowman', '16526.00'
'12', 'Evelyn Serrano', '8.00'
*/

/*CONSULTA No. 6 
	-Nombre de la categoría más y menos vendida y el total vendido en dinero (en una sola consulta).
*/
SELECT
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
ORDER BY Total DESC;

/*RESULTADO ->
'Fresh Vegetables', '218747.00'
'Pets', '44396.00'
*/

/*
CONSULTA No. 7
	-Top 5 de proveedores que más productos han vendido (en dinero) de la categoría de productos ‘Fresh Vegetables’.
*/
SELECT 
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
LIMIT 5;

/*RESULTADO->
'14', 'Xaviera Black', '39', '12556'
'40', 'Abraham Chapman', '36', '11737'
'2', 'Henry Carlson', '39', '11694'
'31', 'Wyoming Terrell', '31', '11220'
'3', 'Caryn Salinas', '27', '11200'
*/

/*CONSULTA No. 8
	-dirección, 
    -región, 
    -ciudad y 
    -código postal de los clientes que más han comprado y de los que menos (en dinero) en una sola consulta.
*/
SELECT
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
HAVING SUM(d.cantidad*o.precio_unitario) = 	(
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
                                                                        )datos
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
                                                                        )datos
											)
ORDER BY SUM(d.cantidad*o.precio_unitario) DESC
;
/*RESULTADO->
'9603 Augue. Road', 'Georgia', '13020', '47103.00'
'P.O. Box 874, 8180 Tellus St.', 'Colorado', '81516', '1059.00'
*/

/*CONSULTA No. 9
	-Nombre del proveedor,
    -Número de teléfono, 
    -Número de orden,
	-Total de la orden por la cual se haya obtenido la menor cantidad de producto.
*/
SELECT
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
;
/*RESULTADO->
'Henry Carlson', '063-340-7971', '508', '101.00'
'Elvis Bass', '034-155-7886', '496', '161.00'
'Wayne Simmons', '072-145-3002', '484', '407.00'
'Jameson Owens', '082-747-4799', '445', '129.00'
'Elizabeth Fox', '026-375-4130', '230', '208.00'
'Macey Mcdowell', '088-708-7987', '217', '392.00'
'Stuart Brewer', '019-896-4001', '117', '297.00'
'Fuller Reid', '085-287-5494', '99', '308.00'
'Henry Carlson', '063-340-7971', '74', '415.00'
'Ingrid Fry', '039-523-0192', '64', '183.00'
'Pearl Parker', '036-029-0248', '51', '53.00'
'Unity Cooley', '005-349-6264', '25', '53.00'
*/


