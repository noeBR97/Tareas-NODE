# Gestión de Tareas – API REST con Node.js y MongoDB

---

## 1. Introducción

El presente proyecto consiste en el desarrollo de una **API REST** orientada a la gestión de tareas y usuarios. La aplicación permite autenticar usuarios, asignar roles, gestionar tareas y realizar diferentes consultas avanzadas sobre dichas tareas.

El sistema ha sido diseñado siguiendo una arquitectura backend clara y modular, aplicando los conceptos aprendidos en el módulo de **Desarrollo Web en Entorno Servidor**.

Como apoyo al backend, se incluye un **cliente web sencillo** que permite interactuar con la API y comprobar su correcto funcionamiento.

---

## 2. Objetivos del proyecto

Los objetivos principales del proyecto son los siguientes:

- Desarrollar una API REST funcional para la gestión de tareas.
- Implementar un sistema de autenticación seguro basado en tokens.
- Controlar el acceso a las funcionalidades según el rol del usuario.
- Permitir la asignación y seguimiento del estado de las tareas.
- Realizar consultas complejas sobre los datos almacenados.
- Aplicar buenas prácticas de organización y separación de responsabilidades.
- Facilitar la comprobación de la API mediante un cliente sencillo.

---

## 3. Tecnologías utilizadas

Para el desarrollo del proyecto se han utilizado tecnologías actuales ampliamente empleadas en el desarrollo backend:

- **Node.js**, como entorno de ejecución del servidor.
- **Express**, para la creación de la API REST y la gestión de rutas.
- **MongoDB**, como base de datos NoSQL orientada a documentos.
- **Mongoose**, para la definición de esquemas y acceso a la base de datos.
- **JSON Web Token (JWT)**, para la autenticación y autorización de usuarios.
- **Redis** (opcional), para el cacheo de consultas frecuentes.
- **HTML y JavaScript**, para el cliente web de pruebas.
- **Librerías de generación de datos aleatorios**, para la creación automática de usuarios.
- **Variables de entorno**, para separar configuración y código.

---

## 4. Autenticación y autorización

El sistema implementa un mecanismo de **autenticación basado en JWT**.  
Los usuarios deben registrarse y posteriormente iniciar sesión para obtener un token de autenticación.

Este token se envía en cada petición a rutas protegidas, permitiendo identificar al usuario autenticado sin necesidad de almacenar sesiones en el servidor.

### 4.1 Control de roles

La aplicación diferencia entre dos tipos de usuarios:

- **Administrador**
- **Usuario estándar**

El control de acceso se realiza mediante middlewares que verifican:
- Que el usuario esté autenticado.
- Que el usuario tenga el rol adecuado para acceder a la funcionalidad solicitada.

Este enfoque garantiza que cada usuario solo pueda realizar las acciones permitidas según su rol.

---

## 5. Modelo de datos

El sistema trabaja con dos entidades principales: **usuarios** y **tareas**.

### 5.1 Usuario

Cada usuario dispone de un identificador único, datos personales básicos, credenciales de acceso y un rol que determina sus permisos dentro del sistema.

### 5.2 Tarea

Las tareas representan unidades de trabajo que pueden ser asignadas a usuarios. Cada tarea incluye una descripción, una duración estimada, un nivel de dificultad y un estado que indica su progreso. Las tareas pueden encontrarse asignadas a un usuario o permanecer sin asignar.

---

## 6. Funcionalidades del sistema

### 6.1 Funcionalidades del administrador

El usuario con rol de administrador puede:

- Crear nuevas tareas.
- Modificar o eliminar tareas existentes.
- Asignar tareas a usuarios.
- Consultar todas las tareas del sistema.
- Generar usuarios de forma automática mediante datos aleatorios.

El administrador tiene acceso completo a la gestión de tareas.

### 6.2 Funcionalidades del usuario estándar

El usuario estándar puede:

- Visualizar las tareas generales disponibles.
- Consultar las tareas que tiene asignadas.
- Asignarse tareas que no estén ocupadas.
- Cambiar el estado de sus tareas conforme avanza su trabajo.

El usuario no puede eliminar tareas ni reasignarlas a otros usuarios.

---

## 7. Consultas implementadas

La API permite realizar diversas consultas avanzadas, entre las que se incluyen:

- Obtención de tareas según su dificultad.
- Búsqueda de tareas dentro de un rango de dificultad.
- Cálculo del número de tareas de máxima dificultad.
- Consulta de tareas asociadas a un usuario concreto.
- Filtrado de tareas de un usuario por dificultad.
- Listado de tareas que no están asignadas.
- Consulta adicional de tareas según su estado.

Estas consultas permiten explotar los datos de forma flexible y eficiente.

---

## 8. Gestión del rango de dificultad

Uno de los aspectos técnicos relevantes del proyecto es la gestión del rango de dificultad.  
Dado que la base de datos no interpreta correctamente el orden lógico de valores textuales, se define una jerarquía explícita de dificultad que permite comparar y filtrar las tareas correctamente.

Este enfoque asegura resultados coherentes al trabajar con rangos de dificultad.

---

## 9. Cliente web

El proyecto incluye un **cliente web sencillo** que permite interactuar con la API de forma visual.  
Desde este cliente es posible:

- Registrar usuarios.
- Iniciar sesión.
- Probar todas las consultas disponibles.
- Introducir y reutilizar el token de autenticación.
- Visualizar mensajes de éxito y error.

El cliente facilita la comprobación del correcto funcionamiento del backend sin necesidad de herramientas externas.

---

## 10. Cacheo con Redis

De forma opcional, el sistema puede utilizar Redis para cachear consultas frecuentes.  
Este mecanismo mejora el rendimiento del sistema al reducir el número de accesos repetidos a la base de datos.

En caso de que Redis no esté disponible, la aplicación continúa funcionando con normalidad.

---

## 11. Endpoints de la API

A continuación se detallan los principales endpoints implementados en la API, organizados según su funcionalidad y el rol del usuario que puede acceder a ellos.

---

### 11.1 Endpoints de autenticación

| Método | Endpoint | Descripción | Autenticación |
|------|---------|------------|---------------|
| POST | `/api/registro` | Registro de un nuevo usuario en el sistema | No |
| POST | `/api/login` | Inicio de sesión y generación de token JWT | No |

---

### 11.2 Endpoints de tareas (Administrador)

| Método | Endpoint | Descripción | Rol requerido |
|------|---------|------------|---------------|
| GET | `/api/tasks` | Obtener todas las tareas del sistema | Administrador |
| GET | `/api/tasks/:idTarea` | Obtener una tarea concreta por su identificador | Administrador |
| POST | `/api/tasks` | Crear una nueva tarea | Administrador |
| PUT | `/api/tasks/:idTarea` | Modificar una tarea existente | Administrador |
| DELETE | `/api/tasks/:idTarea` | Eliminar una tarea | Administrador |
| PUT | `/api/tasks/asignar/:idTarea/:idUsuario` | Asignar una tarea a un usuario | Administrador |
| POST | `/api/tasks/llenar/:n` | Generar usuarios automáticamente | Administrador |

---

### 11.3 Endpoints de tareas (Usuario estándar)

| Método | Endpoint | Descripción | Rol requerido |
|------|---------|------------|---------------|
| GET | `/api/tasks/por-hacer` | Obtener tareas generales disponibles | Usuario |
| GET | `/api/tasks/mis-tareas` | Obtener las tareas asignadas al usuario autenticado | Usuario |
| PUT | `/api/tasks/asignar-propia/:idTarea` | Asignarse una tarea disponible | Usuario |
| PUT | `/api/tasks/cambiar-estado/:idTarea` | Cambiar el estado de una tarea asignada | Usuario |

---

### 11.4 Endpoints de consultas avanzadas

| Método | Endpoint | Descripción | Autenticación |
|------|---------|------------|---------------|
| GET | `/api/tasks/dificultad/:dificultad` | Obtener tareas de una dificultad concreta | Sí |
| GET | `/api/tasks/rango/:min/:max` | Obtener tareas dentro de un rango de dificultad | Sí |
| GET | `/api/tasks/max-dificultad` | Obtener el número de tareas de máxima dificultad | Sí |
| GET | `/api/tasks/usuario/:idUsuario` | Obtener tareas asociadas a un usuario | Sí |
| GET | `/api/tasks/usuario/:idUsuario/dificultad/:dificultad` | Obtener tareas de un usuario filtradas por dificultad | Sí |
| GET | `/api/tasks/sin-asignar` | Obtener tareas que no están asignadas | Sí |
| GET | `/api/tasks/estado/:estado` | Obtener tareas según su estado | Sí |

---

