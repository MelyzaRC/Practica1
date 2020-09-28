INSERT INTO compania(nombre, contacto, correo, telefono)
SELECT DISTINCT 
	t.nombre_compania, 
    t.contacto_compania, 
    t.correo_compania, 
    t.telefono_compania 
FROM temporal t;

INSERT INTO codigo_postal(codigo_postal, ciudad, region)
SELECT DISTINCT 
	CAST(t.codigo_postal AS DECIMAL), 
    t.ciudad, 
    t.region 
FROM temporal t;

INSERT INTO proveedor(nombre, correo, telefono, fecha_registro, direccion, codigo_postal)
SELECT DISTINCT 
	t.nombre, 
    t.correo,
    t.telefono, 
    t.fecha_registro,
    t.direccion,
    t.codigo_postal
FROM temporal t
WHERE t.tipo = 'p';

INSERT INTO cliente(nombre, correo, telefono, fecha_registro, direccion, codigo_postal)
SELECT DISTINCT 
	t.nombre, 
    t.correo,
    t.telefono, 
    t.fecha_registro,
    t.direccion,
    t.codigo_postal
FROM temporal t
WHERE t.tipo = 'c';

INSERT INTO categoria_producto(nombre)
SELECT DISTINCT 
	t.categoria_producto 
FROM temporal t;

INSERT INTO producto(nombre, precio_unitario, categoria)
SELECT DISTINCT 
	t.producto,
    CAST(t.precio_unitario AS DECIMAL),
    c.categoria
FROM temporal t, categoria_producto c
WHERE
		c.nombre = t.categoria_producto;

INSERT INTO compra(compania, proveedor)	
SELECT DISTINCT 
	c.compania,
    p.proveedor
FROM temporal t, compania c, proveedor p
WHERE 
		c.nombre = t.nombre_compania
    AND
		p.nombre = t.nombre
	AND
		t.tipo = 'p';
        
INSERT INTO detalle_compra(no_orden, producto, cantidad)
SELECT 
	c.no_orden, 
    d.producto, 
    CAST(t.cantidad AS DECIMAL)
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
		d.nombre = t.producto;
        
        
INSERT INTO venta(compania, cliente)	
SELECT DISTINCT 
	c.compania,
    e.cliente
FROM temporal t, compania c, cliente e
WHERE 
		c.nombre = t.nombre_compania
    AND
		e.nombre = t.nombre
	AND
		t.tipo = 'c';

INSERT INTO detalle_venta(no_orden, producto, cantidad)
SELECT 
	c.no_orden, 
    d.producto, 
    CAST(t.cantidad AS DECIMAL)
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
		d.nombre = t.producto;
