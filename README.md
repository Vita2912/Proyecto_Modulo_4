# Sistema de Gestión Bancaria

Proyecto integrador correspondiente al Módulo 4.

El objetivo es desarrollar progresivamente un sistema bancario utilizando JavaScript moderno, arquitectura modular, programación orientada a objetos y programación funcional.

## Tecnologías

- HTML5
- CSS3
- JavaScript
- ECMAScript Modules
- Node.js
- npm
- LocalStorage
- Git
- GitHub

## Arquitectura

El proyecto utiliza las siguientes capas:

- Models
- Services
- UI
- Utils
- Tests

## Arquitectura actual

```text
js/
├── main.js
│
├── models/
│   ├── Banco.js
│   ├── Cuenta.js
│   ├── Movimiento.js
│   └── Usuario.js
│
├── services/
│   └── StorageService.js
│
└── utils/
    ├── formatters.js
    ├── helpers.js
    └── validators.js
```

## Models

### Usuario

Representa a una persona registrada dentro del sistema.

### Cuenta

Representa una cuenta bancaria perteneciente a un usuario.

Métodos principales:

- `depositar()`
- `retirar()`

### Movimiento

Representa una operación realizada sobre una cuenta bancaria.

### Banco

Coordina usuarios, cuentas y movimientos y aplica las reglas del dominio bancario.

Métodos principales:

- `agregarUsuario()`
- `buscarUsuarioPorId()`
- `agregarCuenta()`
- `buscarCuentaPorId()`
- `buscarCuentaPorNumero()`
- `obtenerCuentasDeUsuario()`
- `registrarMovimiento()`
- `realizarDeposito()`
- `obtenerMovimientosDeCuenta()`

## Services

### StorageService

Centraliza la comunicación con LocalStorage.

Métodos disponibles:

- `guardar()`
- `obtener()`
- `eliminar()`
- `limpiar()`

## Claves de almacenamiento

El sistema utiliza:

- `STORAGE_KEYS.USUARIOS`
- `STORAGE_KEYS.CUENTAS`
- `STORAGE_KEYS.MOVIMIENTOS`
- `STORAGE_KEYS.SESION`

La clave `SESION` será utilizada en la versión dedicada a autenticación.

## Persistencia

Los objetos JavaScript son convertidos a JSON mediante:

```javascript
JSON.stringify();
```

y recuperados mediante:

```javascript
JSON.parse();
```

Después de recuperar los datos se reconstruyen las instancias de:

- `Usuario`
- `Cuenta`
- `Movimiento`

para recuperar también el comportamiento definido en sus clases.

## Funcionalidades implementadas

Actualmente el sistema permite:

- Crear usuarios.
- Crear cuentas.
- Relacionar cuentas con usuarios.
- Realizar depósitos.
- Registrar movimientos.
- Aplicar reglas básicas del dominio.
- Guardar usuarios en LocalStorage.
- Guardar cuentas en LocalStorage.
- Guardar movimientos en LocalStorage.
- Recuperar datos después de recargar la página.
- Reconstruir instancias de las clases almacenadas.

## Funcionalidades previstas

Durante las siguientes versiones se desarrollarán:

- Registro de usuarios desde interfaz.
- Autenticación.
- Manejo de sesión.
- SweetAlert2.
- Dashboard.
- Gestión de cuenta.
- Transferencias.
- Historial visual de movimientos.
- Manipulación del DOM.
- Eventos.
- Pruebas automatizadas con Jest.

## Versión actual

v0.1.0 — Estructura inicial del proyecto.
v0.2.0 — Arquitectura modular y utilidades base.
v0.3.0 — Modelado del dominio con Programación Orientada a Objetos.
v0.4.0 — Modelo Banco y reglas del dominio bancario.
v0.5.0 — Persistencia con LocalStorage y StorageService.
