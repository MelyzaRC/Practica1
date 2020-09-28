DROP DATABASE practica1Archivos;

CREATE DATABASE practica1Archivos;

SHOW DATABASES;

USE practica1Archivos;

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

CREATE TABLE compania (
	compania int primary key not null auto_increment,
	nombre varchar(200),
    contacto varchar(200),
    correo varchar(200),
    telefono varchar(50)
);

CREATE TABLE codigo_postal(
	codigo_postal int primary key not null,
    ciudad varchar(200),
    region varchar(200)
);

CREATE TABLE proveedor(
	proveedor int primary key not null auto_increment,
    nombre varchar(200),
    correo varchar(200),
    telefono varchar(50),
    fecha_registro varchar(10),
    direccion varchar(200),
    codigo_postal int
);

CREATE TABLE cliente(
	cliente int primary key not null auto_increment,
    nombre varchar(200),
    correo varchar(200),
    telefono varchar(50),
    fecha_registro varchar(10),
    direccion varchar(200),
    codigo_postal int
);

CREATE TABLE categoria_producto(
	categoria int primary key not null auto_increment,
    nombre varchar(200)
);

CREATE TABLE producto(
	producto int primary key not null auto_increment,
    nombre varchar(200),
    precio_unitario decimal,
    categoria int
);
/*COMPRA - Compra de productos a proveedores*/
CREATE TABLE compra(
	no_orden int primary key not null auto_increment,
    compania int,
    proveedor int
);

CREATE TABLE detalle_compra(
	no_detalle int primary key not null auto_increment,
	no_orden int,
    producto int,
    cantidad int
);

/*VENTA - Venta de productos a clientes*/
CREATE TABLE venta(
	no_orden int primary key not null auto_increment,
    compania int,
    cliente int
);

CREATE TABLE detalle_venta(
	no_detalle int primary key not null auto_increment,
	no_orden int,
    producto int,
    cantidad int
);
