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



/*
CONSULTA No.4
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