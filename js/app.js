// Variables globales
let currentUser = null
const bootstrap = window.bootstrap // Declare the bootstrap variable

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

  if (!window.supabase) {
    alert("Error: Supabase no está cargado correctamente. Verifica que supabase-config.js esté incluido.")
    return
  }

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
    console.log("[v0] No hay sesión activa, redirigiendo al login...")
    window.location.href = "login/login.html"
    return
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
      case "insertar-paciente":
        cargarAlergias()
        break
      case "ver-turnos":
        cargarTurnos()
        break
      case "agendar-turno":
        cargarPacientesSelect()
        cargarProfesionalesSelect()
        cargarTiposConsultas()
        break
      case "ver-consultas":
        cargarConsultas()
        break
      case "registrar-consulta":
        cargarTurnosParaConsulta()
        break
      case "ver-profesionales":
        cargarProfesionales()
        break
      case "insertar-profesional":
        cargarUsuariosSelect()
        cargarEspecialidadesCheckboxes()
        break
      case "ver-medicamentos":
        cargarMedicamentos()
        break
      case "ver-usuarios":
        cargarUsuarios()
        break
      case "insertar-usuario":
        cargarRolesSelect()
        break
      case "gestionar-roles":
        cargarRolesYPermisos()
        break
      case "ver-alergias":
        cargarAlergiasTabla()
        break
      case "ver-contactos-emergencia":
        cargarContactosEmergencia()
        break
      case "ver-recetas":
        cargarRecetas()
        break
      case "ver-tipos-consultas":
        cargarTiposConsultasTabla()
        break
      case "ver-especialidades":
        cargarEspecialidadesTabla()
        break
      case "ver-ordenes":
        cargarOrdenes()
        break
      case "stock-minimo":
        cargarStockMinimo()
        break
      case "ver-facturas":
        cargarFacturas()
        break
    }
  }
}

// Cargar estadísticas del dashboard
async function cargarDashboard() {
  try {
    // Total de pacientes
    const { count: totalPacientes } = await window.supabase
      .from("PACIENTES")
      .select("*", { count: "exact", head: true })
    document.getElementById("totalPacientes").textContent = totalPacientes || 0

    // Turnos de hoy
    const hoy = new Date().toISOString().split("T")[0]
    const { count: turnosHoy } = await window.supabase
      .from("TURNOS")
      .select("*", { count: "exact", head: true })
      .gte("FECHA_HORA", hoy + " 00:00:00")
      .lte("FECHA_HORA", hoy + " 23:59:59")
    document.getElementById("turnosHoy").textContent = turnosHoy || 0

    // Total de profesionales
    const { count: totalProfesionales } = await window.supabase
      .from("PROFESIONALES")
      .select("*", { count: "exact", head: true })
    document.getElementById("totalProfesionales").textContent = totalProfesionales || 0

    // Stock bajo (menos de 10 unidades)
    const { count: stockBajo } = await window.supabase
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
    const { data, error } = await window.supabase
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
          <button class="btn btn-sm btn-info me-1" onclick="verDetallePaciente(${p.ID_PACIENTE})" title="Ver detalle">
            <i class="bi bi-eye"></i>
          </button>
          <button class="btn btn-sm btn-warning me-1" onclick="editarPaciente(${p.ID_PACIENTE})" title="Editar">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="btn btn-sm btn-danger" onclick="eliminarPaciente(${p.ID_PACIENTE})" title="Eliminar">
            <i class="bi bi-trash"></i>
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
    const { data, error } = await window.supabase
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
          <button class="btn btn-sm btn-info me-1" onclick="verDetalleTurno(${t.ID_TURNO})" title="Ver detalle">
            <i class="bi bi-eye"></i>
          </button>
          <button class="btn btn-sm btn-danger" onclick="eliminarTurno(${t.ID_TURNO})" title="Eliminar">
            <i class="bi bi-trash"></i>
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
    const { data, error } = await window.supabase
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
    const { data, error } = await window.supabase
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
          <button class="btn btn-sm btn-info me-1" onclick="verDetalleProfesional(${p.ID_PROFESIONAL})" title="Ver detalle">
            <i class="bi bi-eye"></i>
          </button>
          <button class="btn btn-sm btn-danger" onclick="eliminarProfesional(${p.ID_PROFESIONAL})" title="Eliminar">
            <i class="bi bi-trash"></i>
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
    const { data, error } = await window.supabase
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
    const { data, error } = await window.supabase
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
          <button class="btn btn-sm btn-info me-1" onclick="verDetalleUsuario(${u.ID_USUARIO})" title="Ver detalle">
            <i class="bi bi-eye"></i>
          </button>
          <button class="btn btn-sm btn-danger" onclick="eliminarUsuario(${u.ID_USUARIO})" title="Eliminar">
            <i class="bi bi-trash"></i>
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
  try {
    const { error } = await window.supabase.auth.signOut()
    if (error) {
      console.error("Error al cerrar sesión:", error)
    }
    // Redirigir al login
    window.location.href = "login/login.html"
  } catch (err) {
    console.error("Error en logout:", err)
    // Forzar redirección aunque haya error
    window.location.href = "login/login.html"
  }
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

// Función para cargar turnos disponibles para registrar consulta
async function cargarTurnosParaConsulta() {
  const select = document.getElementById("turnoConsulta")
  select.innerHTML = '<option value="">Cargando turnos...</option>'

  try {
    // Get turnos that are confirmed and don't have a consultation yet
    const { data: turnos, error } = await window.supabase
      .from("TURNOS")
      .select(
        `
        ID_TURNO,
        FECHA_HORA,
        PACIENTES(NOMBRE, APELLIDO),
        PROFESIONALES(NOMBRE, APELLIDO),
        TIPOS_CONSULTAS(TIPO_CONSULTA)
      `,
      )
      .eq("ESTADO", "C")
      .order("FECHA_HORA", { ascending: false })
      .limit(50)

    if (error) throw error

    // Filter out turnos that already have consultations
    const { data: consultas, error: consultasError } = await window.supabase.from("CONSULTAS").select("ID_TURNO")

    if (consultasError) throw consultasError

    const turnosConConsulta = new Set(consultas.map((c) => c.ID_TURNO))
    const turnosSinConsulta = turnos.filter((t) => !turnosConConsulta.has(t.ID_TURNO))

    if (turnosSinConsulta.length === 0) {
      select.innerHTML = '<option value="">No hay turnos disponibles para registrar consulta</option>'
      return
    }

    select.innerHTML =
      '<option value="">Seleccione un turno...</option>' +
      turnosSinConsulta
        .map(
          (t) => `
        <option value="${t.ID_TURNO}">
          Turno #${t.ID_TURNO} - ${t.PACIENTES?.NOMBRE || ""} ${t.PACIENTES?.APELLIDO || ""} - 
          ${new Date(t.FECHA_HORA).toLocaleString("es-AR")} - 
          ${t.TIPOS_CONSULTAS?.TIPO_CONSULTA || ""}
        </option>
      `,
        )
        .join("")
  } catch (error) {
    console.error("[v0] Error al cargar turnos para consulta:", error)
    select.innerHTML = '<option value="">Error al cargar turnos</option>'
  }
}

// Función para registrar una nueva consulta
async function registrarConsulta(event) {
  event.preventDefault()

  const idTurno = document.getElementById("turnoConsulta").value
  const motivo = document.getElementById("motivoConsulta").value
  const diagnostico = document.getElementById("diagnosticoConsulta").value
  const notas = document.getElementById("notasConsulta").value

  if (!idTurno) {
    alert("Por favor seleccione un turno")
    return
  }

  try {
    const { data, error } = await window.supabase.from("CONSULTAS").insert([
      {
        ID_TURNO: Number.parseInt(idTurno),
        MOTIVO: motivo,
        DIAGNOSTICO: diagnostico || null,
        NOTAS: notas || null,
      },
    ])

    if (error) throw error

    alert("Consulta registrada exitosamente")
    document.getElementById("formRegistrarConsulta").reset()
    showView("ver-consultas")
  } catch (error) {
    console.error("[v0] Error al registrar consulta:", error)
    alert("Error al registrar la consulta: " + error.message)
  }
}

// ========== FUNCIONES PARA PACIENTES ==========

async function insertarPaciente(event) {
  event.preventDefault()

  const paciente = {
    NOMBRE: document.getElementById("nombrePaciente").value,
    APELLIDO: document.getElementById("apellidoPaciente").value,
    DOCUMENTO: document.getElementById("documentoPaciente").value,
    FECHA_NACIMIENTO: document.getElementById("fechaNacPaciente").value,
    SEXO: document.getElementById("sexoPaciente").value,
    TELEFONO: document.getElementById("telefonoPaciente").value || null,
    EMAIL: document.getElementById("emailPaciente").value || null,
    DIRECCION: document.getElementById("direccionPaciente").value || null,
    GRUPO_SANGUINEO: document.getElementById("grupoSanguineoPaciente").value || null,
    ID_ALERGIA: document.getElementById("alergiaPaciente").value || null,
  }

  try {
    const { data, error } = await window.supabase.from("PACIENTES").insert([paciente]).select()

    if (error) throw error

    alert("Paciente registrado exitosamente")
    document.getElementById("formInsertarPaciente").reset()
    showView("ver-pacientes")
  } catch (error) {
    console.error("[v0] Error al insertar paciente:", error)
    alert("Error al registrar paciente: " + error.message)
  }
}

async function editarPaciente(id) {
  try {
    const { data, error } = await window.supabase.from("PACIENTES").select("*").eq("ID_PACIENTE", id).single()

    if (error) throw error

    document.getElementById("editIdPaciente").value = data.ID_PACIENTE
    document.getElementById("editNombrePaciente").value = data.NOMBRE || ""
    document.getElementById("editApellidoPaciente").value = data.APELLIDO || ""
    document.getElementById("editDocumentoPaciente").value = data.DOCUMENTO || ""
    document.getElementById("editTelefonoPaciente").value = data.TELEFONO || ""
    document.getElementById("editEmailPaciente").value = data.EMAIL || ""

    const modal = new bootstrap.Modal(document.getElementById("modalEditarPaciente"))
    modal.show()
  } catch (error) {
    console.error("[v0] Error al cargar paciente:", error)
    alert("Error al cargar datos del paciente")
  }
}

async function guardarEdicionPaciente() {
  const id = document.getElementById("editIdPaciente").value
  const paciente = {
    NOMBRE: document.getElementById("editNombrePaciente").value,
    APELLIDO: document.getElementById("editApellidoPaciente").value,
    DOCUMENTO: document.getElementById("editDocumentoPaciente").value,
    TELEFONO: document.getElementById("editTelefonoPaciente").value || null,
    EMAIL: document.getElementById("editEmailPaciente").value || null,
  }

  try {
    const { error } = await window.supabase.from("PACIENTES").update(paciente).eq("ID_PACIENTE", id)

    if (error) throw error

    alert("Paciente actualizado exitosamente")
    bootstrap.Modal.getInstance(document.getElementById("modalEditarPaciente")).hide()
    cargarPacientes()
  } catch (error) {
    console.error("[v0] Error al actualizar paciente:", error)
    alert("Error al actualizar paciente: " + error.message)
  }
}

async function eliminarPaciente(id) {
  if (!confirm("¿Está seguro de eliminar este paciente?")) return

  try {
    const { error } = await window.supabase.from("PACIENTES").delete().eq("ID_PACIENTE", id)

    if (error) throw error

    alert("Paciente eliminado exitosamente")
    cargarPacientes()
  } catch (error) {
    console.error("[v0] Error al eliminar paciente:", error)
    alert("Error al eliminar paciente: " + error.message)
  }
}

// ========== FUNCIONES PARA TURNOS ==========

async function agendarTurno(event) {
  event.preventDefault()

  const turno = {
    ID_PACIENTE: Number.parseInt(document.getElementById("pacienteTurno").value),
    ID_PROFESIONAL: Number.parseInt(document.getElementById("profesionalTurno").value),
    FECHA_HORA: document.getElementById("fechaHoraTurno").value,
    ID_TIPO_CONSULTA: Number.parseInt(document.getElementById("tipoConsultaTurno").value),
    ESTADO: document.getElementById("estadoTurno").value,
  }

  try {
    const { data, error } = await window.supabase.from("TURNOS").insert([turno]).select()

    if (error) throw error

    alert("Turno agendado exitosamente")
    document.getElementById("formAgendarTurno").reset()
    showView("ver-turnos")
  } catch (error) {
    console.error("[v0] Error al agendar turno:", error)
    alert("Error al agendar turno: " + error.message)
  }
}

async function eliminarTurno(id) {
  if (!confirm("¿Está seguro de eliminar este turno?")) return

  try {
    const { error } = await window.supabase.from("TURNOS").delete().eq("ID_TURNO", id)

    if (error) throw error

    alert("Turno eliminado exitosamente")
    cargarTurnos()
  } catch (error) {
    console.error("[v0] Error al eliminar turno:", error)
    alert("Error al eliminar turno: " + error.message)
  }
}

// ========== FUNCIONES PARA PROFESIONALES ==========

async function insertarProfesional(event) {
  event.preventDefault()

  const profesional = {
    NOMBRE: document.getElementById("nombreProfesional").value,
    APELLIDO: document.getElementById("apellidoProfesional").value,
    MATRICULA: document.getElementById("matriculaProfesional").value,
    ID_USUARIO: document.getElementById("usuarioProfesional").value || null,
  }

  try {
    const { data, error } = await window.supabase.from("PROFESIONALES").insert([profesional]).select()

    if (error) throw error

    // Insertar especialidades seleccionadas
    const especialidadesSeleccionadas = Array.from(document.querySelectorAll('input[name="especialidad"]:checked')).map(
      (cb) => Number.parseInt(cb.value),
    )

    if (especialidadesSeleccionadas.length > 0 && data[0]) {
      const especialidadesProfesional = especialidadesSeleccionadas.map((idEsp) => ({
        ID_PROFESIONAL: data[0].ID_PROFESIONAL,
        ID_ESPECIALIDAD: idEsp,
      }))

      await window.supabase.from("ESPECIALIDADES_PROFESIONALES").insert(especialidadesProfesional)
    }

    alert("Profesional registrado exitosamente")
    document.getElementById("formInsertarProfesional").reset()
    showView("ver-profesionales")
  } catch (error) {
    console.error("[v0] Error al insertar profesional:", error)
    alert("Error al registrar profesional: " + error.message)
  }
}

async function eliminarProfesional(id) {
  if (!confirm("¿Está seguro de eliminar este profesional?")) return

  try {
    const { error } = await window.supabase.from("PROFESIONALES").delete().eq("ID_PROFESIONAL", id)

    if (error) throw error

    alert("Profesional eliminado exitosamente")
    cargarProfesionales()
  } catch (error) {
    console.error("[v0] Error al eliminar profesional:", error)
    alert("Error al eliminar profesional: " + error.message)
  }
}

// ========== FUNCIONES PARA USUARIOS ==========

async function insertarUsuario(event) {
  event.preventDefault()

  const usuario = {
    USUARIO: document.getElementById("nombreUsuario").value,
    EMAIL: document.getElementById("emailUsuario").value,
    CONTRASEÑA: document.getElementById("contrasenaUsuario").value,
    ID_ROL: Number.parseInt(document.getElementById("rolUsuario").value),
    ESTADO: document.getElementById("estadoUsuario").value,
  }

  try {
    const { data, error } = await window.supabase.from("USUARIOS").insert([usuario]).select()

    if (error) throw error

    alert("Usuario registrado exitosamente")
    document.getElementById("formInsertarUsuario").reset()
    showView("ver-usuarios")
  } catch (error) {
    console.error("[v0] Error al insertar usuario:", error)
    alert("Error al registrar usuario: " + error.message)
  }
}

async function eliminarUsuario(id) {
  if (!confirm("¿Está seguro de eliminar este usuario?")) return

  try {
    const { error } = await window.supabase.from("USUARIOS").delete().eq("ID_USUARIO", id)

    if (error) throw error

    alert("Usuario eliminado exitosamente")
    cargarUsuarios()
  } catch (error) {
    console.error("[v0] Error al eliminar usuario:", error)
    alert("Error al eliminar usuario: " + error.message)
  }
}

// ========== FUNCIONES PARA ROLES Y PERMISOS ==========

let rolSeleccionadoId = null

async function cargarRolesYPermisos() {
  // Cargar roles
  try {
    const { data: roles, error: rolesError } = await window.supabase.from("ROLES").select("*").order("ID_ROL")

    if (rolesError) throw rolesError

    const tbody = document.getElementById("tablaRolesBody")
    tbody.innerHTML = roles
      .map(
        (r) => `
      <tr>
        <td>${r.ID_ROL}</td>
        <td>${r.ROL}</td>
        <td>
          <button class="btn btn-sm btn-info" onclick="asignarPermisosRol(${r.ID_ROL}, '${r.ROL}')">
            <i class="bi bi-key"></i> Permisos
          </button>
        </td>
      </tr>
    `,
      )
      .join("")

    // Cargar permisos
    const { data: permisos, error: permisosError } = await window.supabase
      .from("PERMISOS")
      .select("*")
      .order("ID_PERMISO")

    if (permisosError) throw permisosError

    const tbodyPermisos = document.getElementById("tablaPermisosBody")
    tbodyPermisos.innerHTML = permisos
      .map(
        (p) => `
      <tr>
        <td>${p.ID_PERMISO}</td>
        <td>${p.PERMISO}</td>
      </tr>
    `,
      )
      .join("")
  } catch (error) {
    console.error("[v0] Error al cargar roles y permisos:", error)
  }
}

async function asignarPermisosRol(idRol, nombreRol) {
  rolSeleccionadoId = idRol
  document.getElementById("rolSeleccionadoNombre").textContent = nombreRol
  document.getElementById("asignacionPermisos").style.display = "block"

  try {
    // Obtener todos los permisos
    const { data: permisos, error: permisosError } = await window.supabase
      .from("PERMISOS")
      .select("*")
      .order("ID_PERMISO")

    if (permisosError) throw permisosError

    // Obtener permisos actuales del rol
    const { data: permisosRol, error: permisosRolError } = await window.supabase
      .from("ROLES_PERMISOS")
      .select("ID_PERMISO")
      .eq("ID_ROL", idRol)

    if (permisosRolError) throw permisosRolError

    const permisosActuales = new Set(permisosRol.map((p) => p.ID_PERMISO))

    // Crear checkboxes
    const container = document.getElementById("permisosCheckboxes")
    container.innerHTML = permisos
      .map(
        (p) => `
      <div class="col-md-6 mb-2">
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="${p.ID_PERMISO}" 
                 id="permiso${p.ID_PERMISO}" ${permisosActuales.has(p.ID_PERMISO) ? "checked" : ""}>
          <label class="form-check-label" for="permiso${p.ID_PERMISO}">
            ${p.PERMISO}
          </label>
        </div>
      </div>
    `,
      )
      .join("")
  } catch (error) {
    console.error("[v0] Error al cargar permisos del rol:", error)
  }
}

async function guardarPermisosRol() {
  if (!rolSeleccionadoId) return

  try {
    // Eliminar permisos actuales
    await window.supabase.from("ROLES_PERMISOS").delete().eq("ID_ROL", rolSeleccionadoId)

    // Obtener permisos seleccionados
    const permisosSeleccionados = Array.from(document.querySelectorAll("#permisosCheckboxes input:checked")).map(
      (cb) => ({
        ID_ROL: rolSeleccionadoId,
        ID_PERMISO: Number.parseInt(cb.value),
      }),
    )

    if (permisosSeleccionados.length > 0) {
      const { error } = await window.supabase.from("ROLES_PERMISOS").insert(permisosSeleccionados)

      if (error) throw error
    }

    alert("Permisos actualizados exitosamente")
  } catch (error) {
    console.error("[v0] Error al guardar permisos:", error)
    alert("Error al guardar permisos: " + error.message)
  }
}

// ========== FUNCIONES PARA CARGAR DATOS EN FORMULARIOS ==========

async function cargarAlergias() {
  try {
    const { data, error } = await window.supabase.from("ALERGIAS").select("*").order("NOMBRE_ALERGIA")

    if (error) throw error

    const select = document.getElementById("alergiaPaciente")
    select.innerHTML =
      '<option value="">Sin alergia</option>' +
      data.map((a) => `<option value="${a.ID_ALERGIA}">${a.NOMBRE_ALERGIA}</option>`).join("")
  } catch (error) {
    console.error("[v0] Error al cargar alergias:", error)
  }
}

async function cargarPacientesSelect() {
  try {
    const { data, error } = await window.supabase
      .from("PACIENTES")
      .select("ID_PACIENTE, NOMBRE, APELLIDO")
      .order("APELLIDO")

    if (error) throw error

    const select = document.getElementById("pacienteTurno")
    select.innerHTML =
      '<option value="">Seleccione un paciente...</option>' +
      data.map((p) => `<option value="${p.ID_PACIENTE}">${p.APELLIDO}, ${p.NOMBRE}</option>`).join("")
  } catch (error) {
    console.error("[v0] Error al cargar pacientes:", error)
  }
}

async function cargarProfesionalesSelect() {
  try {
    const { data, error } = await window.supabase
      .from("PROFESIONALES")
      .select("ID_PROFESIONAL, NOMBRE, APELLIDO")
      .order("APELLIDO")

    if (error) throw error

    const select = document.getElementById("profesionalTurno")
    select.innerHTML =
      '<option value="">Seleccione un profesional...</option>' +
      data.map((p) => `<option value="${p.ID_PROFESIONAL}">${p.APELLIDO}, ${p.NOMBRE}</option>`).join("")
  } catch (error) {
    console.error("[v0] Error al cargar profesionales:", error)
  }
}

async function cargarTiposConsultas() {
  try {
    const { data, error } = await window.supabase.from("TIPOS_CONSULTAS").select("*").order("TIPO_CONSULTA")

    if (error) throw error

    const select = document.getElementById("tipoConsultaTurno")
    select.innerHTML =
      '<option value="">Seleccione tipo de consulta...</option>' +
      data.map((t) => `<option value="${t.ID_TIPO_CONSULTA}">${t.TIPO_CONSULTA}</option>`).join("")
  } catch (error) {
    console.error("[v0] Error al cargar tipos de consultas:", error)
  }
}

async function cargarUsuariosSelect() {
  try {
    const { data, error } = await window.supabase.from("USUARIOS").select("ID_USUARIO, USUARIO").order("USUARIO")

    if (error) throw error

    const select = document.getElementById("usuarioProfesional")
    select.innerHTML =
      '<option value="">Sin usuario asignado</option>' +
      data.map((u) => `<option value="${u.ID_USUARIO}">${u.USUARIO}</option>`).join("")
  } catch (error) {
    console.error("[v0] Error al cargar usuarios:", error)
  }
}

async function cargarEspecialidadesCheckboxes() {
  try {
    const { data, error } = await window.supabase.from("ESPECIALIDADES").select("*").order("ESPECIALIDAD")

    if (error) throw error

    const container = document.getElementById("especialidadesProfesional")
    container.innerHTML = data
      .map(
        (e) => `
      <div class="form-check">
        <input class="form-check-input" type="checkbox" name="especialidad" value="${e.ID_ESPECIALIDAD}" id="esp${e.ID_ESPECIALIDAD}">
        <label class="form-check-label" for="esp${e.ID_ESPECIALIDAD}">
          ${e.ESPECIALIDAD}
        </label>
      </div>
    `,
      )
      .join("")
  } catch (error) {
    console.error("[v0] Error al cargar especialidades:", error)
  }
}

async function cargarRolesSelect() {
  try {
    const { data, error } = await window.supabase.from("ROLES").select("*").order("ROL")

    if (error) throw error

    const select = document.getElementById("rolUsuario")
    select.innerHTML =
      '<option value="">Seleccione un rol...</option>' +
      data.map((r) => `<option value="${r.ID_ROL}">${r.ROL}</option>`).join("")
  } catch (error) {
    console.error("[v0] Error al cargar roles:", error)
  }
}

async function cargarAlergiasTabla() {
  const tbody = document.getElementById("tablaAlergiasBody")
  try {
    const { data, error } = await window.supabase.from("ALERGIAS").select("*").order("ID_ALERGIA")

    if (error) throw error

    tbody.innerHTML = data
      .map(
        (a) => `
      <tr>
        <td>${a.ID_ALERGIA}</td>
        <td>${a.NOMBRE_ALERGIA}</td>
        <td>
          <button class="btn btn-sm btn-info">
            <i class="bi bi-eye"></i>
          </button>
        </td>
      </tr>
    `,
      )
      .join("")
  } catch (error) {
    console.error("[v0] Error:", error)
    tbody.innerHTML = '<tr><td colspan="3" class="text-danger">Error al cargar datos</td></tr>'
  }
}

async function cargarContactosEmergencia() {
  const tbody = document.getElementById("tablaContactosBody")
  try {
    const { data, error } = await window.supabase
      .from("CONTACTOS_EMERGENCIAS")
      .select("*, PACIENTES(NOMBRE, APELLIDO)")
      .order("ID_CONTACTO")

    if (error) throw error

    tbody.innerHTML = data
      .map(
        (c) => `
      <tr>
        <td>${c.ID_CONTACTO}</td>
        <td>${c.PACIENTES?.NOMBRE} ${c.PACIENTES?.APELLIDO}</td>
        <td>${c.NOMBRE}</td>
        <td>${c.RELACION}</td>
        <td>${c.TELEFONO}</td>
      </tr>
    `,
      )
      .join("")
  } catch (error) {
    console.error("[v0] Error:", error)
    tbody.innerHTML = '<tr><td colspan="5" class="text-danger">Error al cargar datos</td></tr>'
  }
}

async function cargarRecetas() {
  const tbody = document.getElementById("tablaRecetasBody")
  try {
    const { data, error } = await window.supabase.from("RECETAS").select("*").order("ID_RECETA", { ascending: false })

    if (error) throw error

    tbody.innerHTML = data
      .map(
        (r) => `
      <tr>
        <td>${r.ID_RECETA}</td>
        <td>${r.ID_CONSULTAS}</td>
        <td>${r.DESCRIPCION || ""}</td>
        <td>${r.FECHA_EMISION || ""}</td>
      </tr>
    `,
      )
      .join("")
  } catch (error) {
    console.error("[v0] Error:", error)
    tbody.innerHTML = '<tr><td colspan="4" class="text-danger">Error al cargar datos</td></tr>'
  }
}

async function cargarTiposConsultasTabla() {
  const tbody = document.getElementById("tablaTiposConsultasBody")
  try {
    const { data, error } = await window.supabase.from("TIPOS_CONSULTAS").select("*").order("ID_TIPO_CONSULTA")

    if (error) throw error

    tbody.innerHTML = data
      .map(
        (t) => `
      <tr>
        <td>${t.ID_TIPO_CONSULTA}</td>
        <td>${t.TIPO_CONSULTA}</td>
      </tr>
    `,
      )
      .join("")
  } catch (error) {
    console.error("[v0] Error:", error)
    tbody.innerHTML = '<tr><td colspan="2" class="text-danger">Error al cargar datos</td></tr>'
  }
}

async function cargarEspecialidadesTabla() {
  const tbody = document.getElementById("tablaEspecialidadesBody")
  try {
    const { data, error } = await window.supabase.from("ESPECIALIDADES").select("*").order("ID_ESPECIALIDAD")

    if (error) throw error

    tbody.innerHTML = data
      .map(
        (e) => `
      <tr>
        <td>${e.ID_ESPECIALIDAD}</td>
        <td>${e.ESPECIALIDAD}</td>
      </tr>
    `,
      )
      .join("")
  } catch (error) {
    console.error("[v0] Error:", error)
    tbody.innerHTML = '<tr><td colspan="2" class="text-danger">Error al cargar datos</td></tr>'
  }
}

async function cargarOrdenes() {
  const tbody = document.getElementById("tablaOrdenesBody")
  try {
    const { data, error } = await window.supabase
      .from("ORDENES_LABORATORIO")
      .select("*, PACIENTES(NOMBRE, APELLIDO), PROFESIONALES(NOMBRE, APELLIDO)")
      .order("ID_ORDEN", { ascending: false })

    if (error) throw error

    tbody.innerHTML = data
      .map((o) => {
        const estadoTexto = o.ESTADO === "P" ? "Pendiente" : o.ESTADO === "C" ? "Completado" : "Cancelado"
        const estadoClass = o.ESTADO === "P" ? "warning" : o.ESTADO === "C" ? "success" : "danger"

        return `
        <tr>
          <td>${o.ID_ORDEN}</td>
          <td>${o.ID_CONSULTAS}</td>
          <td>${o.PACIENTES?.NOMBRE} ${o.PACIENTES?.APELLIDO}</td>
          <td>${o.PROFESIONALES?.NOMBRE} ${o.PROFESIONALES?.APELLIDO}</td>
          <td>${o.FECHA_SOLICITUD}</td>
          <td><span class="badge bg-${estadoClass}">${estadoTexto}</span></td>
          <td>${o.RESULTADO_URL ? '<a href="' + o.RESULTADO_URL + '" target="_blank">Ver</a>' : "Sin resultado"}</td>
        </tr>
      `
      })
      .join("")
  } catch (error) {
    console.error("[v0] Error:", error)
    tbody.innerHTML = '<tr><td colspan="7" class="text-danger">Error al cargar datos</td></tr>'
  }
}

async function cargarStockMinimo() {
  const tbody = document.getElementById("tablaStockMinimoBody")
  try {
    const { data, error } = await window.supabase
      .from("STOCK_FARMACIA")
      .select("*, MEDICAMENTOS(NOMBRE, PRESENTACION)")
      .lt("CANTIDAD", 10)
      .order("CANTIDAD")

    if (error) throw error

    tbody.innerHTML = data
      .map(
        (s) => `
      <tr>
        <td>${s.ID_STOCK}</td>
        <td>${s.MEDICAMENTOS?.NOMBRE}</td>
        <td>${s.MEDICAMENTOS?.PRESENTACION}</td>
        <td class="text-danger fw-bold">${s.CANTIDAD}</td>
        <td>${s.UBICACION}</td>
      </tr>
    `,
      )
      .join("")
  } catch (error) {
    console.error("[v0] Error:", error)
    tbody.innerHTML = '<tr><td colspan="5" class="text-danger">Error al cargar datos</td></tr>'
  }
}

async function cargarFacturas() {
  const tbody = document.getElementById("tablaFacturasBody")
  try {
    const { data, error } = await window.supabase
      .from("FACTURAS")
      .select("*, PACIENTES(NOMBRE, APELLIDO)")
      .order("ID_FACTURA", { ascending: false })

    if (error) throw error

    tbody.innerHTML = data
      .map(
        (f) => `
      <tr>
        <td>${f.ID_FACTURA}</td>
        <td>${f.PACIENTES?.NOMBRE} ${f.PACIENTES?.APELLIDO}</td>
        <td>${f.FECHA}</td>
        <td>$${f.TOTAL}</td>
        <td>${f.FORMA_PAGO === "EF" ? "Efectivo" : f.FORMA_PAGO === "TC" ? "Tarjeta" : "Otro"}</td>
      </tr>
    `,
      )
      .join("")
  } catch (error) {
    console.error("[v0] Error:", error)
    tbody.innerHTML = '<tr><td colspan="5" class="text-danger">Error al cargar datos</td></tr>'
  }
}
