# Basic Auth API

---

## Tabla de Contenidos

- [Resumen del Proyecto](#resumen-del-proyecto)
- [Tecnologías y Lenguajes Utilizados](#tecnologías-y-lenguajes-utilizados)
- [Instrucciones Básicas de Instalación y Configuración](#instrucciones-básicas-de-instalación-y-configuración)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Guía de Uso](#guía-de-uso)
- [Detalles de los Módulos/Componentes](#detalles-de-los-móduloscomponentes)
- [Documentación API](#documentación-api)
- [Ejemplos de Código](#ejemplos-de-código)
- [Notas de Desarrollo](#notas-de-desarrollo)
- [Licencia](#licencia)

---

## Resumen del Proyecto

**Basic Auth API** es un proyecto que provee una API Gateway con autenticación JWT para manejar usuarios, roles, permisos y entidades. El proyecto facilita la creación, gestión y aseguramiento de acceso mediante roles y permisos, permitiendo operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre usuarios y recursos relacionados.

Entre las funcionalidades principales se incluyen:

- Registro y login de usuarios con encriptación segura de contraseñas.
- Manejo de roles y permisos para controlar el acceso a recursos y funcionalidades.
- Entidades que representan los diversos recursos sobre los que se aplican los permisos.
- API REST que expone los endpoints para gestionar usuarios, roles, permisos, y entidades.
- Validaciones de seguridad para asegurar la autenticidad y autorización mediante JWT.

---

## Tecnologías y Lenguajes Utilizados

- **Lenguaje:** JavaScript (ES6+)
- **Entorno de ejecución:** Node.js
- **Framework web:** Express.js
- **Base de datos:** MySQL (a través de Sequelize ORM)
- **Autenticación:** JSON Web Tokens (jsonwebtoken)
- **Encriptación de contraseñas:** bcrypt
- **Herramientas de desarrollo:** Nodemon, Jest (para testing)
- **Manejo de variables de entorno:** dotenv
- **ORM:** Sequelize

---

## Instrucciones Básicas de Instalación y Configuración

1. **Clonar el repositorio:**

```bash
git clone https://github.com/danielboggianosa/basic-auth-api.git
cd basic-auth-api
```

2. **Instalar dependencias:**

```bash
npm install
```

3. **Configurar variables de entorno:**

Crear un archivo `.env` en la raíz con las variables necesarias. Ejemplo:

```
APP_PORT=3000
APP_SALT=15

JWT_SECRET=your_jwt_secret_here
JWT_EXP=24h

DB_PORT=3306
DB_HOST=localhost
DB_USER=root
DB_PASS=password
DB_NAME=your_database_name
DB_TIME=+00:00
DB_DIALECT=mysql

USERS_TABLE=users
ROLES_TABLE=roles
ENTITIES_TABLE=entities
PERMISSIONS_TABLE=permissions
ROLE_PERMISSIONS_TABLE=role_permissions
USER_ROLES_TABLE=user_roles

ENVIRONMENT=development
```

4. **Iniciar la aplicación:**

- Modo desarrollo (con hot reload):

```bash
npm run dev
```

- Modo producción:

```bash
npm start
```

5. **Pruebas:**

```bash
npm test
```

6. **Asegurarse que la base de datos está accesible y migrada (Sequelize sincroniza automáticamente al iniciar la app).**

---

## Estructura del Proyecto

```
basic-auth-api/
├── src/
│   ├── application/
│   │   ├── middlewares/
│   │   ├── security/
│   │   ├── use_cases/
│   │   ├── validations/
│   ├── infrastructure/
│   │   ├── config/
│   │   ├── repositories/
│   │   ├── webserver/
│   ├── interfaces/
│   │   ├── controllers/
│   ├── app.js
├── index.js
├── package.json
├── tests/
```

### Descripción de carpetas y archivos clave

- **index.js**: Archivo de entrada de la aplicación que inicializa y levanta el servidor Express en el puerto configurado.
- **src/app.js**: Configura la aplicación Express, incorpora middlewares, rutas y manejo básico de errores.
- **src/infrastructure/config/**: Contiene configuración general como variables de entorno y códigos HTTP.
- **src/infrastructure/repositories/**: Implementaciones para acceso a base de datos usando Sequelize para entidades, usuarios, roles, permisos, etc.
- **src/infrastructure/webserver/api.js**: Configuración de rutas y middleware de seguridad para la API.
- **src/application/security/**: Implementa seguridad y lógicas de autenticación, encriptación y JWT.
- **src/application/use_cases/**: Contiene la lógica principal (casos de uso) para entidades, usuarios, roles y permisos.
- **src/application/validations/**: Validaciones de seguridad y datos para usuarios, autenticación, y roles.
- **src/application/middlewares/**: Middlewares personalizados para manejo de excepciones.
- **src/interfaces/controllers/**: Controladores que reciben las peticiones HTTP y llaman a los casos de uso para procesarlas.
- **tests/**: Carpetas para pruebas unitarias e integradas.

---

## Guía de Uso

### 1. Autenticación

- **Registro:** POST `/api/auth/register`

Envía datos del usuario (nombre, email, username, password) para crear un nuevo usuario.

- **Login:** POST `/api/auth/login`

Envía username y password, recibe datos del usuario y token JWT.

- **Sesión:** GET `/api/auth/sesion`

Con token JWT en header Authorization, valida y extrae información del usuario autenticado.

- **Logout:** GET `/api/auth/logout`

Marca el token como destruido (aunque en realidad es solo una respuesta ya que los JWT no se invalidan en backend).

### 2. Gestión de Usuarios, Roles, Entidades y Permisos

- Los usuarios deben estar autenticados para la mayoría de las acciones.

- Rutas protegidas:

  - `/api/user`
  - `/api/role`
  - `/api/entity`
  - `/api/permission`

- Operaciones CRUD disponibles mediante métodos HTTP REST estándar (GET, POST, PUT, DELETE).

- Control de acceso vía roles y permisos para limitar acciones granulares.

---

## Detalles de los Módulos/Componentes

### 1. **AuthSecurity**

- Propósito: Gestionar autenticación (login, registro), validación de sesión y manejo de tokens JWT.

- Clases / funciones clave:
  - `login`: Busca usuario y verifica contraseña.
  - `register`: Registra usuarios, detecta si es primer usuario (`root`) o usuario general.
  - `sesion`: Valida token y obtiene payload.
  - `logout`: Método que retorna true (placeholder).
  - `passwordMatches`, `passwordSecurity`: Comparación y hash de contraseñas.
  - `tokenSecurity`: Generación y validación de JWT.

- Interacción: Se conecta con repositorios para obtener datos y utiliza los módulos de seguridad para el manejo criptográfico y tokens.

### 2. **Repositories**

- Abstracción sobre la base de datos para cada entidad importante (usuarios, roles, permisos, entidades).

- Usan Sequelize para definir modelos y operaciones sobre tablas correspondientes.

- Ejemplos:
  - `UserRepository` para gestión de usuarios (con include de roles).
  - `RoleRepository` gestiona roles con permisos asociados.
  - `PermissionRepository` para permisos detallados.
  - `EntityRepository` para representar recursos sobre los que se aplican permisos.

### 3. **UseCases**

- Encapsulan la lógica de negocio para las entidades, usuarios, roles, permisos.

- Usan los repositories para acceder a datos.

- Exponen funciones CRUD básicas y algunas adicionales (asignar roles a usuarios, agregar permisos a roles).

### 4. **Validations**

- Validaciones de datos y seguridad para peticiones.

- Usuario: Validación de campos para registro (y hashing de contraseña).

- Seguridad: Middleware para autenticación JWT y autorización basada en permisos para capacidades específicas (e.g. lectura de todos los usuarios).

### 5. **Interfaces / Controllers**

- Controladores Express que definen rutas para la API REST.

- Mediante middlewares invocan validaciones y llaman a casos de uso.

- Manejan respuestas HTTP con códigos de estado usando constantes definidas.

---

## Documentación API

| Endpoint              | Método   | Descripción                                       | Parámetros Entrada                        | Respuesta                                | Autenticación          |
|-----------------------|----------|-------------------------------------------------|------------------------------------------|------------------------------------------|-----------------------|
| `/api/auth/login`     | POST     | Login de usuario                                 | `{ username, password }`                  | `{ success, data: {user data + token} }`| No                    |
| `/api/auth/register`  | POST     | Registro de nuevo usuario                        | `{ firstName, email, username, password, image? }` | `{ success, data: user }`              | No                    |
| `/api/auth/sesion`    | GET      | Validar token y obtener sesión                   | Header: `Authorization: Bearer <token>` | `{ success, data: user data }`          | Sí                    |
| `/api/auth/logout`    | GET      | Logout (placeholder)                             | Header: `Authorization: Bearer <token>` | `{ success, message }`                   | Sí                    |
| `/api/user/`          | GET      | Obtener todos los usuarios                        | Ninguno                                 | `{ success, data: [users] }`             | Sí (con permiso readAll)|
| `/api/user/:id`       | GET      | Obtener usuario por ID                            | ID usuario en URL                       | `{ success, data: user }`                | Sí                    |
| `/api/user/email/:email` | GET   | Obtener usuario por email                         | Email en URL                            | `{ success, data: user }`                | Sí                    |
| `/api/user/`          | POST     | Registrar un nuevo usuario                        | Objeto usuario                          | `{ success, data: user }`                | Sí                    |
| `/api/user/bulk`      | POST     | Registrar múltiples usuarios                      | Array de usuarios                       | `{ success, data: [users] }`             | Sí                    |
| `/api/user/:id`       | PUT      | Actualizar usuario                                | ID en URL y datos usuario               | `{ success, result }`                    | Sí                    |
| `/api/user/:id`       | DELETE   | Eliminar usuario                                 | ID en URL                              | `{ success, result }`                    | Sí                    |
| `/api/user/addRole`   | POST     | Añadir rol a usuario                             | `{ userId, roleId }`                    | `{ success, data }`                      | Sí                    |
| `/api/role/`          | GET      | Obtener roles                                    | Ninguno                                | `{ success, data: [roles] }`             | Sí                    |
| `/api/role/:id`       | GET      | Obtener rol por ID                               | ID en URL                             | `{ success, data: role }`                | Sí                    |
| `/api/role/name/:name`| GET      | Obtener rol por nombre                           | Nombre en URL                         | `{ success, data: role }`                | Sí                    |
| `/api/role/`          | POST     | Crear rol                                       | Datos del rol                         | `{ success, data: role }`                | Sí                    |
| `/api/role/bulk`      | POST     | Crear roles en masa                              | Array de roles                       | `{ success, data: roles }`               | Sí                    |
| `/api/role/:id`       | PUT      | Actualizar rol                                  | ID URL + datos rol                  | `{ success }`                          | Sí                    |
| `/api/role/:id`       | DELETE   | Eliminar rol                                   | ID en URL                         | `{ success }`                          | Sí                    |
| `/api/role/addPermission`| POST  | Añadir permiso a rol                            | `{ roleId, permissionId }`         | `{ success, data }`                     | Sí                    |
| `/api/entity/`        | GET      | Obtener todas las entidades                     | Ninguno                          | `{ success, data: [entities] }`         | Sí                    |
| `/api/entity/:id`     | GET      | Obtener entidad por ID                           | ID en URL                          | `{ success, data: entity }`              | Sí                    |
| `/api/entity/name/:name`| GET     | Obtener entidad por nombre                      | Nombre en URL                   | `{ success, data: entity }`              | Sí                    |
| `/api/entity/`        | POST     | Crear nueva entidad                             | Datos entidad                    | `{ success, data: entity }`              | Sí                    |
| `/api/entity/bulk`    | POST     | Crear entidades en masa                          | Array de entidades              | `{ success, data: entities }`            | Sí                    |
| `/api/entity/:id`     | PUT      | Actualizar entidad                              | ID URL + datos           | `{ success }`                            | Sí                    |
| `/api/entity/:id`     | DELETE   | Eliminar entidad                               | ID URL                        | `{ success }`                            | Sí                    |
| `/api/permission/`    | GET      | Obtener todos los permisos                      | Ninguno                      | `{ success, data: [permissions] }`      | Sí                    |
| `/api/permission/:id` | GET      | Obtener permiso por ID                          | ID en URL                     | `{ success, data: permission }`         | Sí                    |
| `/api/permission/`    | POST     | Crear permiso                                   | Datos permiso                 | `{ success, data: permission }`          | Sí                    |
| `/api/permission/bulk`| POST     | Crear múltiples permisos                        | Array                          | `{ success, data: permissions }`         | Sí                    |
| `/api/permission/:id` | PUT      | Actualizar permiso                             | ID URL + datos            | `{ success }`                            | Sí                    |
| `/api/permission/:id` | DELETE   | Eliminar permiso                               | ID URL                       | `{ success }`                            | Sí                    |

---

## Ejemplos de Código

### Registro de usuario

```js
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "Juan",
  "lastName": "Perez",
  "email": "juan.perez@example.com",
  "username": "juanp",
  "password": "password123",
  "image": "https://example.com/images/juan.png"
}
```

Respuesta:

```json
{
  "success": true,
  "data": {
    "id": 2,
    "firstName": "Juan",
    "lastName": "Perez",
    "email": "juan.perez@example.com",
    "username": "juanp",
    "image": "https://example.com/images/juan.png"
  }
}
```

### Login

```js
POST /api/auth/login
Content-Type: application/json

{
  "username": "juanp",
  "password": "password123"
}
```

Respuesta:

```json
{
  "success": true,
  "data": {
    "id": 2,
    "firstName": "Juan",
    "lastName": "Perez",
    "email": "juan.perez@example.com",
    "username": "juanp",
    "role": 2,
    "token": "jwt-token-aqui"
  }
}
```

### Obtener todos los usuarios (requiere token JWT)

```http
GET /api/user/
Authorization: Bearer <jwt-token-aquí>
```

Respuesta:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "firstName": "Root",
      "lastName": "",
      "email": "root@localhost",
      "username": "root",
      "image": null
    },
    {
      "id": 2,
      "firstName": "Juan",
      "lastName": "Perez",
      "email": "juan.perez@example.com",
      "username": "juanp",
      "image": "https://example.com/images/juan.png"
    }
  ]
}
```

---

## Notas de Desarrollo

- **Patrón Arquitectónico**: El proyecto está organizado siguiendo principios de Clean Architecture, separando responsabilidades entre casos de uso, repositorios, controladores y middleware.

- **Gestión de errores**: Utiliza una clase `Exception` personalizada para manejo uniforme de errores HTTP.

- **Pruebas**: Se utiliza Jest para pruebas unitarias. Comandos listos para correr los tests con `npm test`.

- **Código seguro**: Las contraseñas son hasheadas usando bcrypt con salt de 15 rounds.

- **JSON Web Tokens**: Los tokens tienen duración configurable vía variable de entorno (`JWT_EXP`).

- **Control de acceso granular**: La verificación de permisos se hace en middleware (`SecurityValidations`), siendo posible diferenciar permisos de lectura completa (`readAll`) y lectura individual (`read`), entre otros.

- **Sincronización BD**: Sequelize sincroniza automáticamente las tablas (sin forzar borrado) al iniciar.

- **Código Opcional Comentado**: En varias partes hay métodos comentados para creación de datos por defecto (root, roles, entidades, permisos, usuarios).

- **Contribuciones**: Se recomienda seguir las reglas de estilo presentes en el código y usar Nodemon para desarrollo local rápido.

---

## Licencia

Este proyecto está licenciado bajo la licencia **MIT**. 

Esto permite:

- Uso gratuito, comercial y personal.
- Modificación, distribución y sublicenciamiento del código.
- Uso sin preocuparse por royalties.

Restricciones:

- No ofrece garantías ni responsabilidades por posibles daños derivados del uso.

---

> Para más detalles y actualizaciones consulte el repositorio oficial: [https://github.com/danielboggianosa/basic-auth-api](https://github.com/danielboggianosa/basic-auth-api)

---

**¡Gracias por utilizar Basic Auth API!**
