// Archivo principal para integrar Supabase con el sistema existente

// Funciones necesarias para la autenticación y otras operaciones
async function requireAuth() {
  // Implementación de requireAuth
  // Esta función debería verificar la autenticación del usuario
  // y devolver la sesión actual
}

function getCurrentUser() {
  // Implementación de getCurrentUser
  // Esta función debería devolver el usuario actual
}

async function getStockBajo() {
  // Implementación de getStockBajo
  // Esta función debería obtener el stock bajo
  // y devolver un objeto con success y data
}

async function getTurnosByFecha(fecha) {
  // Implementación de getTurnosByFecha
  // Esta función debería obtener los turnos por fecha
  // y devolver un objeto con success y data
}

async function getPacientes() {
  // Implementación de getPacientes
  // Esta función debería obtener los pacientes
  // y devolver un objeto con success y data
}

async function getTurnos() {
  // Implementación de getTurnos
  // Esta función debería obtener los turnos
  // y devolver un objeto con success y data
}

async function logoutUser() {
  // Implementación de logoutUser
  // Esta función debería cerrar la sesión del usuario
}

// Verificar autenticación al cargar la página
document.addEventListener("DOMContentLoaded", async () => {
  // Verificar si el usuario está autenticado
  const session = await requireAuth()

  // Cargar información del usuario
  const user = getCurrentUser()
  if (user) {
    // Actualizar el nombre del usuario en el navbar
    const userNameElements = document.querySelectorAll(".user-name")
    userNameElements.forEach((el) => {
      el.textContent = user.usuario || user.email
    })

    // Actualizar el rol del usuario
    const userRoleElements = document.querySelectorAll(".user-role")
    userRoleElements.forEach((el) => {
      el.textContent = user.roles?.rol || "Usuario"
    })
  }

  // Cargar datos iniciales del dashboard
  await loadDashboardData()
})

// Cargar datos del dashboard
async function loadDashboardData() {
  try {
    // Cargar stock bajo
    const stockBajo = await getStockBajo()
    if (stockBajo.success) {
      updateStockCriticoCard(stockBajo.data.length)
    }

    // Cargar turnos de hoy
    const hoy = new Date().toISOString().split("T")[0]
    const turnosHoy = await getTurnosByFecha(hoy)
    if (turnosHoy.success) {
      updateTurnosHoyCard(turnosHoy.data.length)
    }

    // Cargar pacientes activos (ejemplo)
    const pacientes = await getPacientes()
    if (pacientes.success) {
      updatePacientesActivosCard(pacientes.data.length)
    }
  } catch (error) {
    console.error("Error al cargar datos del dashboard:", error)
  }
}

// Actualizar card de stock crítico
function updateStockCriticoCard(cantidad) {
  const stockCard = document.querySelector(".dashboard-card:has(.text-danger)")
  if (stockCard) {
    const numberElement = stockCard.querySelector("h2")
    if (numberElement) {
      numberElement.textContent = cantidad
    }
  }
}

// Actualizar card de turnos hoy
function updateTurnosHoyCard(cantidad) {
  const turnosCard = document.querySelector(".dashboard-card:has(.text-primary)")
  if (turnosCard) {
    const numberElement = turnosCard.querySelector("h2")
    if (numberElement) {
      numberElement.textContent = cantidad
    }
  }
}

// Actualizar card de pacientes activos
function updatePacientesActivosCard(cantidad) {
  const pacientesCard = document.querySelector(".dashboard-card:has(.text-info)")
  if (pacientesCard) {
    const numberElement = pacientesCard.querySelector("h2")
    if (numberElement) {
      numberElement.textContent = cantidad
    }
  }
}

// Función para cargar pacientes en la tabla
async function cargarPacientesEnTabla() {
  const result = await getPacientes()

  if (result.success) {
    const tbody = document.querySelector("#tablaPacientes")
    if (tbody) {
      tbody.innerHTML = ""

      result.data.forEach((paciente) => {
        const row = `
                    <tr>
                        <td>${paciente.documento}</td>
                        <td>${paciente.nombre} ${paciente.apellido}</td>
                        <td>${paciente.fecha_nacimiento}</td>
                        <td>${paciente.sexo}</td>
                        <td>${paciente.telefono || "-"}</td>
                        <td>${paciente.email || "-"}</td>
                        <td>
                            <button class="btn btn-sm btn-info" onclick="verPaciente(${paciente.id_paciente})">
                                <i class="bi bi-eye"></i>
                            </button>
                            <button class="btn btn-sm btn-warning" onclick="editarPaciente(${paciente.id_paciente})">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn btn-sm btn-danger" onclick="eliminarPaciente(${paciente.id_paciente})">
                                <i class="bi bi-trash"></i>
                            </button>
                        </td>
                    </tr>
                `
        tbody.innerHTML += row
      })
    }
  } else {
    console.error("Error al cargar pacientes:", result.error)
    alert("Error al cargar pacientes: " + result.error)
  }
}

// Función para cargar turnos en la tabla
async function cargarTurnosEnTabla() {
  const result = await getTurnos()

  if (result.success) {
    const tbody = document.querySelector("#tablaTurnos")
    if (tbody) {
      tbody.innerHTML = ""

      result.data.forEach((turno) => {
        const fechaHora = new Date(turno.fecha_hora)
        const estadoClass = turno.estado === "C" ? "success" : turno.estado === "P" ? "warning" : "danger"
        const estadoText = turno.estado === "C" ? "Confirmado" : turno.estado === "P" ? "Pendiente" : "Cancelado"

        const row = `
                    <tr>
                        <td>${turno.id_turno}</td>
                        <td>${fechaHora.toLocaleDateString()} ${fechaHora.toLocaleTimeString()}</td>
                        <td>${turno.pacientes?.nombre} ${turno.pacientes?.apellido}</td>
                        <td>${turno.profesionales?.nombre} ${turno.profesionales?.apellido}</td>
                        <td>${turno.tipos_consultas?.tipo_consulta || "-"}</td>
                        <td><span class="badge bg-${estadoClass}">${estadoText}</span></td>
                        <td>
                            <button class="btn btn-sm btn-info" onclick="verTurno(${turno.id_turno})">
                                <i class="bi bi-eye"></i>
                            </button>
                            <button class="btn btn-sm btn-success" onclick="confirmarTurno(${turno.id_turno})">
                                <i class="bi bi-check"></i>
                            </button>
                            <button class="btn btn-sm btn-danger" onclick="cancelarTurno(${turno.id_turno})">
                                <i class="bi bi-x"></i>
                            </button>
                        </td>
                    </tr>
                `
        tbody.innerHTML += row
      })
    }
  } else {
    console.error("Error al cargar turnos:", result.error)
    alert("Error al cargar turnos: " + result.error)
  }
}

// Manejar el cierre de sesión
function setupLogoutButton() {
  const logoutButtons = document.querySelectorAll('[onclick="logout()"]')
  logoutButtons.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault()
      if (confirm("¿Está seguro que desea cerrar sesión?")) {
        await logoutUser()
      }
    })
  })
}

// Inicializar botones de logout
setupLogoutButton()
