# Instrucciones de Integración con Supabase

## Archivos Creados

He creado los siguientes archivos para integrar Supabase con tu sistema:

### 1. Configuración
- `js/supabase-config.js` - Configuración principal de Supabase

### 2. Autenticación
- `js/supabase-auth.js` - Funciones de login, logout y gestión de usuarios

### 3. Módulos de Base de Datos
- `js/supabase-pacientes.js` - CRUD de pacientes
- `js/supabase-turnos.js` - Gestión de turnos
- `js/supabase-consultas.js` - Gestión de consultas y recetas
- `js/supabase-profesionales.js` - Gestión de profesionales y especialidades
- `js/supabase-farmacia.js` - Gestión de medicamentos y stock

### 4. Integración Principal
- `js/main-integration.js` - Integra Supabase con tu sistema existente
- `login/login-updated.html` - Página de login actualizada con Supabase
- `index-updated.html` - Página principal con scripts de Supabase

## Pasos para Implementar

### 1. Estructura de Carpetas
Crea la carpeta `js` en la raíz de tu proyecto si no existe:
\`\`\`
CentroDeSalud_/
├── js/
│   ├── supabase-config.js
│   ├── supabase-auth.js
│   ├── supabase-pacientes.js
│   ├── supabase-turnos.js
│   ├── supabase-consultas.js
│   ├── supabase-profesionales.js
│   ├── supabase-farmacia.js
│   └── main-integration.js
├── login/
│   ├── login.html (original)
│   └── login-updated.html (nuevo)
├── index.html (original)
├── index-updated.html (nuevo)
└── script.js
\`\`\`

### 2. Configurar Supabase

#### Paso 1: Habilitar Row Level Security (RLS)
En tu proyecto de Supabase, ve a cada tabla y habilita RLS:

\`\`\`sql
-- Para la tabla USUARIOS (ejemplo)
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- Crear política para permitir lectura
CREATE POLICY "Permitir lectura a usuarios autenticados"
ON usuarios FOR SELECT
TO authenticated
USING (true);

-- Crear política para permitir inserción
CREATE POLICY "Permitir inserción a usuarios autenticados"
ON usuarios FOR INSERT
TO authenticated
WITH CHECK (true);
\`\`\`

Repite esto para todas las tablas según tus necesidades de seguridad.

#### Paso 2: Configurar Autenticación
En Supabase Dashboard:
1. Ve a Authentication → Settings
2. Habilita "Email" como proveedor
3. Configura la URL de redirección: `http://localhost:puerto/index.html`

### 3. Actualizar tus Archivos HTML

Reemplaza tu `index.html` con `index-updated.html` o agrega estos scripts antes del cierre de `</body>`:

\`\`\`html
<!-- Supabase JS -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<!-- Scripts de integración -->
<script src="js/supabase-config.js"></script>
<script src="js/supabase-auth.js"></script>
<script src="js/supabase-pacientes.js"></script>
<script src="js/supabase-turnos.js"></script>
<script src="js/supabase-consultas.js"></script>
<script src="js/supabase-profesionales.js"></script>
<script src="js/supabase-farmacia.js"></script>
<script src="js/main-integration.js"></script>
\`\`\`

### 4. Crear Usuarios en Supabase

Para crear usuarios de prueba, ejecuta en el SQL Editor de Supabase:

\`\`\`sql
-- Primero, crea un usuario en Supabase Auth (hazlo desde el Dashboard)
-- Luego, inserta en tu tabla USUARIOS

INSERT INTO usuarios (usuario, email, contraseña, id_rol, estado)
VALUES ('admin', 'admin@centrodesalud.com', 'hash_password', 1, 'A');
\`\`\`

### 5. Ejemplos de Uso

#### Cargar Pacientes
\`\`\`javascript
// En tu archivo script.js o donde manejes la vista de pacientes
async function mostrarPacientes() {
    showView('ver-pacientes')
    await cargarPacientesEnTabla()
}
\`\`\`

#### Insertar Paciente
\`\`\`javascript
async function guardarNuevoPaciente() {
    const pacienteData = {
        nombre: document.getElementById('nombre').value,
        apellido: document.getElementById('apellido').value,
        documento: document.getElementById('documento').value,
        fecha_nacimiento: document.getElementById('fecha_nacimiento').value,
        sexo: document.getElementById('sexo').value,
        telefono: document.getElementById('telefono').value,
        email: document.getElementById('email').value,
        direccion: document.getElementById('direccion').value,
        grupo_sanguineo: document.getElementById('grupo_sanguineo').value
    }
    
    const result = await insertPaciente(pacienteData)
    
    if (result.success) {
        alert('Paciente registrado exitosamente')
        await cargarPacientesEnTabla()
    } else {
        alert('Error: ' + result.error)
    }
}
\`\`\`

#### Agendar Turno
\`\`\`javascript
async function guardarTurno() {
    const turnoData = {
        id_profesional: parseInt(document.getElementById('profesional').value),
        id_paciente: parseInt(document.getElementById('paciente').value),
        fecha_hora: document.getElementById('fecha_hora').value,
        id_tipo_consulta: parseInt(document.getElementById('tipo_consulta').value),
        estado: 'P' // Pendiente
    }
    
    const result = await agendarTurno(turnoData)
    
    if (result.success) {
        alert('Turno agendado exitosamente')
        await cargarTurnosEnTabla()
    } else {
        alert('Error: ' + result.error)
    }
}
\`\`\`

## Funciones Disponibles

### Autenticación
- `loginUser(email, password)` - Iniciar sesión
- `logoutUser()` - Cerrar sesión
- `getCurrentUser()` - Obtener usuario actual
- `checkAuth()` - Verificar autenticación
- `requireAuth()` - Requerir autenticación (redirige si no está autenticado)

### Pacientes
- `getPacientes()` - Obtener todos los pacientes
- `getPacienteByDocumento(documento)` - Buscar por documento
- `insertPaciente(data)` - Insertar nuevo paciente
- `updatePaciente(id, data)` - Actualizar paciente
- `deletePaciente(id)` - Eliminar paciente

### Turnos
- `getTurnos()` - Obtener todos los turnos
- `getTurnosByFecha(fecha)` - Obtener turnos por fecha
- `verificarDisponibilidad(idProfesional, fechaHora)` - Verificar disponibilidad
- `agendarTurno(data)` - Agendar nuevo turno
- `updateEstadoTurno(id, estado)` - Actualizar estado

### Consultas
- `getConsultas()` - Obtener todas las consultas
- `registrarConsulta(data)` - Registrar nueva consulta
- `getRecetasByConsulta(id)` - Obtener recetas
- `crearReceta(data)` - Crear receta

### Profesionales
- `getProfesionales()` - Obtener todos los profesionales
- `getProfesionalesByEspecialidad(id)` - Filtrar por especialidad
- `insertProfesional(data)` - Insertar profesional
- `getEspecialidades()` - Obtener especialidades

### Farmacia
- `getMedicamentos()` - Obtener medicamentos
- `getStockFarmacia()` - Obtener stock
- `getStockBajo()` - Obtener stock bajo
- `updateStock(id, cantidad)` - Actualizar stock
- `insertMedicamento(data)` - Insertar medicamento

## Próximos Pasos

1. Copia todos los archivos JS a la carpeta `js/`
2. Actualiza tu `index.html` y `login/login.html`
3. Configura las políticas de seguridad en Supabase
4. Crea usuarios de prueba
5. Prueba el login y las funciones básicas
6. Adapta las funciones a tus necesidades específicas

## Soporte

Si necesitas ayuda con alguna función específica o quieres agregar más funcionalidades, házmelo saber.
