// Variables globales
let currentUser = null
const supabase = null // Declare supabase variable

// Funciones de importación o declaración
async function verificarConexion() {
  // Implementación de verificarConexion
  // Esto es un placeholder. Debes implementar la lógica real aquí.
  return true // Retorna true si la conexión es exitosa
}

async function checkAuth() {
  // Implementación de checkAuth
  // Esto es un placeholder. Debes implementar la lógica real aquí.
  return { user: { email: "test@example.com" } } // Retorna una sesión simulada
}

// Inicializar la aplicación
document.addEventListener("DOMContentLoaded", async () => {
  console.log("[v0] Iniciando aplicación...")

  // Verificar conexión con Supabase
  const conexionOk = await verificarConexion()
  if (!conexionOk) {
    alert("Error: No se pudo conectar con la base de datos")
    return
  }

  // Verificar autenticación
  const session = await checkAuth()
  if (session) {
    currentUser = session.user
    document.getElementById("userName").textContent = currentUser.email
    document.getElementById("dashboardUserName").textContent = currentUser.email
  } else {
    // Si no hay sesión, permitir acceso de prueba
    console.log("[v0] Modo de prueba - sin autenticación")
    document.getElementById("userName").textContent = "Usuario de Prueba"
    document.getElementById("dashboardUserName").textContent = "Usuario de Prueba"
  }

  // Cargar tema guardado
  const savedTheme = localStorage.getItem("theme") || "light"
  document.documentElement.setAttribute("data-bs-theme", savedTheme)

  // Cargar datos del dashboard
  await cargarDashboard()

  console.log("[v0] Aplicación iniciada correctamente")
})

// Función para cambiar entre vistas
function showView(viewName) {
  const allViews = document.querySelectorAll(".content-view")
  allViews.forEach((view) => {
    view.style.display = "none"
  })

  const selectedView = document.getElementById("view-" + viewName)
  if (selectedView) {
    selectedView.style.display = "block"

    // Cargar datos según la vista
    switch (viewName) {
      case "ver-pacientes":
        cargarPacientes()
        break
      case "ver-turnos":
        cargarTurnos()
        break
      case "ver-consultas":
        cargarConsultas()
        break
      case "ver-profesionales":
        cargarProfesionales()
        break
      case "ver-medicamentos":
        cargarMedicamentos()
        break
      case "ver-usuarios":
        cargarUsuarios()
        break
    }
  }
}

// Cargar estadísticas del dashboard
async function cargarDashboard() {
  try {
    // Total de pacientes
    const { count: totalPacientes } = await supabase.from("PACIENTES").select("*", { count: "exact", head: true })
    document.getElementById("totalPacientes").textContent = totalPacientes || 0

    // Turnos de hoy
    const hoy = new Date().toISOString().split("T")[0]
    const { count: turnosHoy } = await supabase
      .from("TURNOS")
      .select("*", { count: "exact", head: true })
      .gte("FECHA_HORA", hoy + " 00:00:00")
      .lte("FECHA_HORA", hoy + " 23:59:59")
    document.getElementById("turnosHoy").textContent = turnosHoy || 0

    // Total de profesionales
    const { count: totalProfesionales } = await supabase
      .from("PROFESIONALES")
      .select("*", { count: "exact", head: true })
    document.getElementById("totalProfesionales").textContent = totalProfesionales || 0

    // Stock bajo (menos de 10 unidades)
    const { count: stockBajo } = await supabase
      .from("STOCK_FARMACIA")
      .select("*", { count: "exact", head: true })
      .lt("CANTIDAD", 10)
    document.getElementById("stockBajo").textContent = stockBajo || 0
  } catch (error) {
    console.error("[v0] Error al cargar dashboard:", error)
  }
}

// Cargar pacientes
async function cargarPacientes() {
  const tbody = document.getElementById("tablaPacientesBody")
  tbody.innerHTML = `
    <tr>
      <td colspan="8" class="table-loading">
        <div class="spinner-border" role="status"></div>
        <p class="mt-2">Cargando pacientes...</p>
      </td>
    </tr>
  `

  try {
    const { data, error } = await supabase
      .from("PACIENTES")
      .select("*")
      .order("ID_PACIENTE", { ascending: false })
      .limit(100)

    if (error) throw error

    if (data.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" class="text-center text-muted">
            No hay pacientes registrados
          </td>
        </tr>
      `
      return
    }

    tbody.innerHTML = data
      .map(
        (p) => `
      <tr>
        <td>${p.ID_PACIENTE}</td>
        <td>${p.NOMBRE || ""}</td>
        <td>${p.APELLIDO || ""}</td>
        <td>${p.DOCUMENTO || ""}</td>
        <td>${p.FECHA_NACIMIENTO || ""}</td>
        <td>${p.TELEFONO || ""}</td>
        <td>${p.EMAIL || ""}</td>
        <td>
          <button class="btn btn-sm btn-info" onclick="verDetallePaciente(${p.ID_PACIENTE})">
            <i class="fas fa-eye"></i>
          </button>
        </td>
      </tr>
    `,
      )
      .join("")
  } catch (error) {
    console.error("[v0] Error al cargar pacientes:", error)
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="text-center text-danger">
          Error al cargar pacientes: ${error.message}
        </td>
      </tr>
    `
  }
}

// Cargar turnos
async function cargarTurnos() {
  const tbody = document.getElementById("tablaTurnosBody")
  tbody.innerHTML = `
    <tr>
      <td colspan="7" class="table-loading">
        <div class="spinner-border" role="status"></div>
        <p class="mt-2">Cargando turnos...</p>
      </td>
    </tr>
  `

  try {
    const { data, error } = await supabase
      .from("TURNOS")
      .select(
        `
        *,
        PACIENTES(NOMBRE, APELLIDO),
        PROFESIONALES(NOMBRE, APELLIDO),
        TIPOS_CONSULTAS(TIPO_CONSULTA)
      `,
      )
      .order("FECHA_HORA", { ascending: false })
      .limit(100)

    if (error) throw error

    if (data.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="text-center text-muted">
            No hay turnos registrados
          </td>
        </tr>
      `
      return
    }

    tbody.innerHTML = data
      .map((t) => {
        const estadoTexto = t.ESTADO === "P" ? "Pendiente" : t.ESTADO === "C" ? "Confirmado" : "Cancelado"
        const estadoClass = t.ESTADO === "P" ? "warning" : t.ESTADO === "C" ? "success" : "danger"

        return `
      <tr>
        <td>${t.ID_TURNO}</td>
        <td>${t.PACIENTES?.NOMBRE || ""} ${t.PACIENTES?.APELLIDO || ""}</td>
        <td>${t.PROFESIONALES?.NOMBRE || ""} ${t.PROFESIONALES?.APELLIDO || ""}</td>
        <td>${new Date(t.FECHA_HORA).toLocaleString("es-AR")}</td>
        <td>${t.TIPOS_CONSULTAS?.TIPO_CONSULTA || ""}</td>
        <td><span class="badge bg-${estadoClass}">${estadoTexto}</span></td>
        <td>
          <button class="btn btn-sm btn-info" onclick="verDetalleTurno(${t.ID_TURNO})">
            <i class="fas fa-eye"></i>
          </button>
        </td>
      </tr>
    `
      })
      .join("")
  } catch (error) {
    console.error("[v0] Error al cargar turnos:", error)
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center text-danger">
          Error al cargar turnos: ${error.message}
        </td>
      </tr>
    `
  }
}

// Cargar consultas
async function cargarConsultas() {
  const tbody = document.getElementById("tablaConsultasBody")
  tbody.innerHTML = `
    <tr>
      <td colspan="6" class="table-loading">
        <div class="spinner-border" role="status"></div>
        <p class="mt-2">Cargando consultas...</p>
      </td>
    </tr>
  `

  try {
    const { data, error } = await supabase
      .from("CONSULTAS")
      .select("*")
      .order("ID_CONSULTAS", { ascending: false })
      .limit(100)

    if (error) throw error

    if (data.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center text-muted">
            No hay consultas registradas
          </td>
        </tr>
      `
      return
    }

    tbody.innerHTML = data
      .map(
        (c) => `
      <tr>
        <td>${c.ID_CONSULTAS}</td>
        <td>${c.ID_TURNO}</td>
        <td>${c.MOTIVO || ""}</td>
        <td>${c.DIAGNOSTICO || ""}</td>
        <td>${c.NOTAS || ""}</td>
        <td>
          <button class="btn btn-sm btn-info" onclick="verDetalleConsulta(${c.ID_CONSULTAS})">
            <i class="fas fa-eye"></i>
          </button>
        </td>
      </tr>
    `,
      )
      .join("")
  } catch (error) {
    console.error("[v0] Error al cargar consultas:", error)
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center text-danger">
          Error al cargar consultas: ${error.message}
        </td>
      </tr>
    `
  }
}

// Cargar profesionales
async function cargarProfesionales() {
  const tbody = document.getElementById("tablaProfesionalesBody")
  tbody.innerHTML = `
    <tr>
      <td colspan="6" class="table-loading">
        <div class="spinner-border" role="status"></div>
        <p class="mt-2">Cargando profesionales...</p>
      </td>
    </tr>
  `

  try {
    const { data, error } = await supabase
      .from("PROFESIONALES")
      .select(
        `
        *,
        ESPECIALIDADES_PROFESIONALES(
          ESPECIALIDADES(ESPECIALIDAD)
        )
      `,
      )
      .order("ID_PROFESIONAL", { ascending: false })

    if (error) throw error

    if (data.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center text-muted">
            No hay profesionales registrados
          </td>
        </tr>
      `
      return
    }

    tbody.innerHTML = data
      .map((p) => {
        const especialidades =
          p.ESPECIALIDADES_PROFESIONALES?.map((ep) => ep.ESPECIALIDADES?.ESPECIALIDAD).join(", ") || "Sin especialidad"

        return `
      <tr>
        <td>${p.ID_PROFESIONAL}</td>
        <td>${p.NOMBRE || ""}</td>
        <td>${p.APELLIDO || ""}</td>
        <td>${p.MATRICULA || ""}</td>
        <td>${especialidades}</td>
        <td>
          <button class="btn btn-sm btn-info" onclick="verDetalleProfesional(${p.ID_PROFESIONAL})">
            <i class="fas fa-eye"></i>
          </button>
        </td>
      </tr>
    `
      })
      .join("")
  } catch (error) {
    console.error("[v0] Error al cargar profesionales:", error)
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center text-danger">
          Error al cargar profesionales: ${error.message}
        </td>
      </tr>
    `
  }
}

// Cargar medicamentos
async function cargarMedicamentos() {
  const tbody = document.getElementById("tablaMedicamentosBody")
  tbody.innerHTML = `
    <tr>
      <td colspan="8" class="table-loading">
        <div class="spinner-border" role="status"></div>
        <p class="mt-2">Cargando medicamentos...</p>
      </td>
    </tr>
  `

  try {
    const { data, error } = await supabase
      .from("STOCK_FARMACIA")
      .select(
        `
        *,
        MEDICAMENTOS(NOMBRE, PRESENTACION, LABORATORIO)
      `,
      )
      .order("CANTIDAD", { ascending: true })

    if (error) throw error

    if (data.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" class="text-center text-muted">
            No hay medicamentos en stock
          </td>
        </tr>
      `
      return
    }

    tbody.innerHTML = data
      .map((s) => {
        const cantidadClass = s.CANTIDAD < 10 ? "text-danger fw-bold" : s.CANTIDAD < 20 ? "text-warning" : ""

        return `
      <tr>
        <td>${s.ID_STOCK}</td>
        <td>${s.MEDICAMENTOS?.NOMBRE || ""}</td>
        <td>${s.MEDICAMENTOS?.PRESENTACION || ""}</td>
        <td>${s.MEDICAMENTOS?.LABORATORIO || ""}</td>
        <td>${s.LOTE || ""}</td>
        <td class="${cantidadClass}">${s.CANTIDAD}</td>
        <td>${s.FECHA_VENCIMIENTO || ""}</td>
        <td>${s.UBICACION || ""}</td>
      </tr>
    `
      })
      .join("")
  } catch (error) {
    console.error("[v0] Error al cargar medicamentos:", error)
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="text-center text-danger">
          Error al cargar medicamentos: ${error.message}
        </td>
      </tr>
    `
  }
}

// Cargar usuarios
async function cargarUsuarios() {
  const tbody = document.getElementById("tablaUsuariosBody")
  tbody.innerHTML = `
    <tr>
      <td colspan="6" class="table-loading">
        <div class="spinner-border" role="status"></div>
        <p class="mt-2">Cargando usuarios...</p>
      </td>
    </tr>
  `

  try {
    const { data, error } = await supabase
      .from("USUARIOS")
      .select(
        `
        *,
        ROLES(ROL)
      `,
      )
      .order("ID_USUARIO", { ascending: false })

    if (error) throw error

    if (data.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center text-muted">
            No hay usuarios registrados
          </td>
        </tr>
      `
      return
    }

    tbody.innerHTML = data
      .map((u) => {
        const estadoTexto = u.ESTADO === "A" ? "Activo" : "Inactivo"
        const estadoClass = u.ESTADO === "A" ? "success" : "secondary"

        return `
      <tr>
        <td>${u.ID_USUARIO}</td>
        <td>${u.USUARIO || ""}</td>
        <td>${u.EMAIL || ""}</td>
        <td>${u.ROLES?.ROL || ""}</td>
        <td><span class="badge bg-${estadoClass}">${estadoTexto}</span></td>
        <td>
          <button class="btn btn-sm btn-info" onclick="verDetalleUsuario(${u.ID_USUARIO})">
            <i class="fas fa-eye"></i>
          </button>
        </td>
      </tr>
    `
      })
      .join("")
  } catch (error) {
    console.error("[v0] Error al cargar usuarios:", error)
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center text-danger">
          Error al cargar usuarios: ${error.message}
        </td>
      </tr>
    `
  }
}

// Funciones de búsqueda en tablas
function searchTable(tableId, inputId) {
  const input = document.getElementById(inputId)
  const filter = input.value.toLowerCase()
  const table = document.getElementById(tableId)
  const rows = table.getElementsByTagName("tbody")[0].getElementsByTagName("tr")

  for (let i = 0; i < rows.length; i++) {
    const cells = rows[i].getElementsByTagName("td")
    let found = false

    for (let j = 0; j < cells.length; j++) {
      const cellText = cells[j].textContent || cells[j].innerText
      if (cellText.toLowerCase().indexOf(filter) > -1) {
        found = true
        break
      }
    }

    rows[i].style.display = found ? "" : "none"
  }
}

// Funciones de tema
function toggleThemeMenu() {
  const themeMenu = document.getElementById("themeMenu")
  themeMenu.classList.toggle("show")
}

function setTheme(theme) {
  document.documentElement.setAttribute("data-bs-theme", theme)
  localStorage.setItem("theme", theme)
  toggleThemeMenu()
}

// Función de logout
async function logout() {
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error("Error al cerrar sesión:", error)
  }
  window.location.href = "/login/login.html"
}

// Funciones placeholder para ver detalles
function verDetallePaciente(id) {
  alert(`Ver detalle del paciente ID: ${id}`)
}

function verDetalleTurno(id) {
  alert(`Ver detalle del turno ID: ${id}`)
}

function verDetalleConsulta(id) {
  alert(`Ver detalle de la consulta ID: ${id}`)
}

function verDetalleProfesional(id) {
  alert(`Ver detalle del profesional ID: ${id}`)
}

function verDetalleUsuario(id) {
  alert(`Ver detalle del usuario ID: ${id}`)
}
