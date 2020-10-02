/*BORRAR LA BASE DE DATOS*/
DROP DATABASE practica1Archivos;

/*CREAR LA BASE DE DATOS*/
CREATE DATABASE practica1Archivos;

/*SELECCIONAR LA BASE DE DATOS*/
USE practica1Archivos;

/*CREAR CONTENEDOR DE DATOS COMPLETOS*/
CREATE TABLE temporal (
    nombre_compania varchar(200),
    contacto_compania varchar(200),
    correo_compania varchar(200),
    telefono_compania varchar(200),
    tipo varchar(200),
    nombre varchar(200),
    correo varchar(200),
    telefono varchar(200),
    fecha_registro varchar(200),
    direccion varchar(200),
    ciudad varchar(200),
    codigo_postal varchar(200),
    region varchar(200),
    producto varchar(200),
    categoria_producto varchar(200),
    cantidad varchar(200),
    precio_unitario varchar(200)
);

/*CREACION DE TABLAS*/
CREATE TABLE compania (
	compania int primary key not null auto_increment,
	nombre varchar(200),
    contacto varchar(200),
    correo varchar(200),
    telefono varchar(50)
);

CREATE TABLE region(
	region int primary key not null auto_increment,
    nombre varchar(200)
);

CREATE TABLE codigo_postal(
	codigo_postal int primary key not null,
    ciudad varchar(200),
    region int not null
);
ALTER TABLE codigo_postal ADD FOREIGN KEY (region) REFERENCES region(region);

CREATE TABLE proveedor(
	proveedor int primary key not null auto_increment,
    nombre varchar(200),
    correo varchar(200),
    telefono varchar(50),
    fecha_registro date,
    direccion varchar(200),
    codigo_postal int not null
);
ALTER TABLE proveedor ADD FOREIGN KEY (codigo_postal) REFERENCES codigo_postal(codigo_postal);

CREATE TABLE cliente(
	cliente int primary key not null auto_increment,
    nombre varchar(200),
    correo varchar(200),
    telefono varchar(50),
    fecha_registro date,
    direccion varchar(200),
    codigo_postal int not null
);
ALTER TABLE cliente ADD FOREIGN KEY (codigo_postal) REFERENCES codigo_postal(codigo_postal);

CREATE TABLE categoria_producto(
	categoria int primary key not null auto_increment,
    nombre varchar(200)
);

CREATE TABLE producto(
	producto int primary key not null auto_increment,
    nombre varchar(200),
    precio_unitario decimal(10,2),
    categoria int not null
);
ALTER TABLE producto ADD FOREIGN KEY (categoria) REFERENCES categoria_producto(categoria);

/*COMPRA - Compra de productos a proveedores*/
CREATE TABLE compra(
	no_orden int primary key not null auto_increment,
    compania int not null,
    proveedor int not null
);
ALTER TABLE compra ADD FOREIGN KEY (compania) REFERENCES compania(compania);
ALTER TABLE compra ADD FOREIGN KEY (proveedor) REFERENCES proveedor(proveedor);

CREATE TABLE detalle_compra(
	no_detalle int primary key not null auto_increment,
	no_orden int not null,
    producto int not null,
    cantidad int
);
ALTER TABLE detalle_compra ADD FOREIGN KEY (no_orden) REFERENCES compra(no_orden);
ALTER TABLE detalle_compra ADD FOREIGN KEY (producto) REFERENCES producto(producto);

/*VENTA - Venta de productos a clientes*/
CREATE TABLE venta(
	no_orden int primary key not null auto_increment,
    compania int not null,
    cliente int not null
);
ALTER TABLE venta ADD FOREIGN KEY (compania) REFERENCES compania(compania);
ALTER TABLE venta ADD FOREIGN KEY (cliente) REFERENCES cliente(cliente);

CREATE TABLE detalle_venta(
	no_detalle int primary key not null auto_increment,
	no_orden int not null,
    producto int not null,
    cantidad int
);
ALTER TABLE detalle_venta ADD FOREIGN KEY (no_orden) REFERENCES venta(no_orden);
ALTER TABLE detalle_venta ADD FOREIGN KEY (producto) REFERENCES producto(producto);