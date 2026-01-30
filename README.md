# Documentación - Sistema de Gestión de Mascotas

## Descripción General

Aplicación fullstack para administrar información de mascotas. Frontend en Angular 17 y backend en Node.js/Express con TypeScript.

## Arquitectura

### Backend (Node.js/Express)

**Puerto:** 3000  
**Almacenamiento:** En memoria (Map)

#### Estructura de carpetas

```
backend/src/
├── controllers/     # Lógica de controladores
├── services/        # Lógica de negocio
├── routes/          # Definición de endpoints
├── middlewares/     # Validación y manejo de errores
├── schemas/         # Esquemas de validación Joi
├── entities/        # Modelos de datos
├── dtos/            # Objetos de transferencia
└── utils/           # Utilidades (encriptación)
```

#### Endpoints API

**Base URL:** `http://localhost:3000/api`

| Método    | Ruta          | Descripción |
|--------   |------         |-------------|
| GET       | /health       | Estado del servidor 
| GET       | /pets         | Listar todas las mascotas 
| GET       | /pets/:id     | Obtener mascota por ID 
| POST      | /pets         | Crear nueva mascota 
| PUT       | /pets/:id     | Actualizar mascota 
| DELETE    | /pets/:id     | Eliminar mascota 

#### Modelo de Datos (Pet)

```typescript
{
  id: string,           // UUID generado automáticamente
  name: string,         // Encriptado
  species: string,      // Encriptado
  breed: string,        // Encriptado
  age: number,          
  owner: string,        // Encriptado
  createdAt: Date,
  updatedAt: Date
}
```

#### Validaciones

- **name:** Requerido, mínimo 2 caracteres
- **species:** Requerido, mínimo 2 caracteres  
- **breed:** Requerido, mínimo 2 caracteres
- **age:** Requerido, número positivo
- **owner:** Requerido, mínimo 3 caracteres

#### Middlewares

**validate.middleware.ts**  
Valida datos de entrada usando esquemas Joi. Puede validar body, params o query. Retorna error 400 con detalles si falla.

**error.middleware.ts**  
Captura errores no manejados y los formatea. Incluye `errorHandler` (500) y `notFoundHandler` (404).

#### Encriptación

**encryption.util.ts**  
Usa AES-256-CBC para proteger datos sensibles.

- `encrypt(text)`: Genera IV aleatorio y encripta. Retorna `IV:datosEncriptados`
- `decrypt(encryptedText)`: Extrae IV y desencripta. Retorna texto original o valor sin cambios si falla

**Configuración:**  
Variable de entorno `ENCRYPTION_KEY` o clave por defecto.

#### Respuestas API

Formato estándar:

```typescript
// Éxito
{
  success: true,
  data: T,
  message?: string
}

// Error
{
  success: false,
  error: string,
  details?: ValidationError[]
}
```

### Frontend (Angular 17)

**Puerto:** 4200  
**Características:** Standalone components, señales, reactive forms

#### Estructura de carpetas

```
frontend/src/app/
├── components/          # Componentes UI
│   ├── header/
│   ├── footer/
│   ├── pet-list/       # Lista y búsqueda
│   ├── pet-card/       # Tarjeta individual
│   ├── pet-form/       # Formulario crear/editar
│   └── confirm-modal/  # Modal de confirmación
├── services/           # Servicios HTTP
├── models/             # Interfaces TypeScript
└── environments/       # Variables de entorno
```

#### Componentes

**PetListComponent**  
Muestra lista de mascotas con búsqueda en tiempo real. Filtra por nombre, especie, raza y dueño.

**PetCardComponent**  
Tarjeta individual con información de mascota. Botones para editar y eliminar.

**PetFormComponent**  
Formulario reactivo para crear o editar. Validaciones en frontend que coinciden con backend.

**ConfirmModalComponent**  
Modal de ng-bootstrap para confirmar eliminaciones.

**HeaderComponent / FooterComponent**  
Navegación y pie de página estáticos.

#### Servicios

**PetService**  
Maneja comunicación HTTP con backend.

```typescript
getPets(): Observable<Pet[]>
getPetById(id: string): Observable<Pet>
createPet(pet: CreatePetDto): Observable<Pet>
updatePet(id: string, pet: UpdatePetDto): Observable<Pet>
deletePet(id: string): Observable<void>
```

Incluye manejo de errores y transformación de respuestas.

#### Configuración de Entorno

```typescript
// environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

#### Estilos

Bootstrap 5 con Bootstrap Icons. Estilos personalizados en SCSS modular por componente.

## Instalación y Ejecución

### Backend

```bash
cd backend
npm install
npm run dev    # Desarrollo
npm run build  # Compilar
npm start      # Producción
```

### Frontend

```bash
cd frontend
npm install
npm start      # http://localhost:4200
npm run build  # Compilar para producción
```

## Flujo de Trabajo

1. Usuario interactúa con el frontend
2. Frontend hace petición HTTP al backend
3. Middleware valida datos de entrada
4. Controlador procesa petición
5. Servicio ejecuta lógica de negocio
6. Datos sensibles se encriptan antes de guardar
7. Respuesta se formatea y envía al frontend
8. Frontend actualiza UI con los datos recibidos

## Notas Técnicas

- CORS configurado para localhost:4200
- Datos sensibles (dueño) encriptados en backend
- Sin base de datos persistente, datos se pierden al reiniciar
- Validación doble: frontend (UX) y backend (seguridad)
- Manejo centralizado de errores en ambos lados
- IDs generados con UUID v4

## Dependencias Principales

**Backend:**
- express: Framework web
- joi: Validación de esquemas
- uuid: Generación de IDs
- cors: Configuración CORS

**Frontend:**
- @angular/core: Framework
- @ng-bootstrap/ng-bootstrap: Componentes Bootstrap
- bootstrap: Estilos
- rxjs: Programación reactiva
