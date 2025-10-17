// Función para cambiar entre vistas
function showView(viewName) {
  // Ocultar todas las vistas
  const allViews = document.querySelectorAll(".content-view")
  allViews.forEach((view) => {
    view.style.display = "none"
  })

  // Mostrar la vista seleccionada
  const selectedView = document.getElementById("view-" + viewName)
  if (selectedView) {
    selectedView.style.display = "block"
  }
}

function showDashboardMenu(module) {
  // Mapeo de módulos a sus vistas principales
  const moduleViews = {
    pacientes: "ver-pacientes",
    turnos: "ver-turnos",
    consultas: "ver-consultas",
    profesionales: "ver-profesionales",
    laboratorio: "ver-ordenes",
    farmacia: "ver-medicamentos",
    facturacion: "ver-facturas",
    usuarios: "ver-usuarios",
  }

  const viewName = moduleViews[module]
  if (viewName) {
    showView(viewName)
  }
}

function toggleThemeMenu() {
  const themeMenu = document.getElementById("themeMenu")
  themeMenu.classList.toggle("show")
}

function setTheme(theme) {
  const html = document.documentElement
  html.setAttribute("data-bs-theme", theme)
  localStorage.setItem("theme", theme)
  toggleThemeMenu()
}

function searchPacientes() {
  const input = document.getElementById("searchPacientes")
  const filter = input.value.toLowerCase()
  const table = document.getElementById("tablaPacientes")
  const rows = table.getElementsByTagName("tr")

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

function searchUsuarios() {
  const input = document.getElementById("searchUsuarios")
  const filter = input.value.toLowerCase()
  const table = document.getElementById("tablaUsuarios")
  const rows = table.getElementsByTagName("tr")

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

function searchTurnos() {
  const input = document.getElementById("searchTurnos")
  const filter = input.value.toLowerCase()
  const table = document.getElementById("tablaTurnos")
  const rows = table.getElementsByTagName("tr")

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

function searchConsultas() {
  const input = document.getElementById("searchConsultas")
  const filter = input.value.toLowerCase()
  const table = document.getElementById("tablaConsultas")
  const rows = table.getElementsByTagName("tr")

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

function searchProfesionales() {
  const input = document.getElementById("searchProfesionales")
  const filter = input.value.toLowerCase()
  const table = document.getElementById("tablaProfesionales")
  const rows = table.getElementsByTagName("tr")

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

function searchOrdenes() {
  const input = document.getElementById("searchOrdenes")
  const filter = input.value.toLowerCase()
  const table = document.getElementById("tablaOrdenes")
  const rows = table.getElementsByTagName("tr")

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

function searchFacturas() {
  const input = document.getElementById("searchFacturas")
  const filter = input.value.toLowerCase()
  const table = document.getElementById("tablaFacturas")
  const rows = table.getElementsByTagName("tr")

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

function searchMedicamentos() {
  const input = document.getElementById("searchMedicamentos")
  const filter = input.value.toLowerCase()
  const table = document.getElementById("tablaMedicamentos")
  const rows = table.getElementsByTagName("tr")

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

function searchAlergias() {
  const input = document.getElementById("searchAlergias")
  const filter = input.value.toLowerCase()
  const table = document.getElementById("tablaAlergias")
  const rows = table.getElementsByTagName("tr")

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

function searchContactos() {
  const input = document.getElementById("searchContactos")
  const filter = input.value.toLowerCase()
  const table = document.getElementById("tablaContactos")
  const rows = table.getElementsByTagName("tr")

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

function searchRecetas() {
  const input = document.getElementById("searchRecetas")
  const filter = input.value.toLowerCase()
  const table = document.getElementById("tablaRecetas")
  const rows = table.getElementsByTagName("tr")

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

function searchTiposConsultas() {
  const input = document.getElementById("searchTiposConsultas")
  const filter = input.value.toLowerCase()
  const table = document.getElementById("tablaTiposConsultas")
  const rows = table.getElementsByTagName("tr")

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

function searchEspecialidades() {
  const input = document.getElementById("searchEspecialidades")
  const filter = input.value.toLowerCase()
  const table = document.getElementById("tablaEspecialidades")
  const rows = table.getElementsByTagName("tr")

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

document.addEventListener("click", (event) => {
  const themeMenu = document.getElementById("themeMenu")
  const themeBtn = document.querySelector(".theme-toggle-btn")

  if (themeMenu && themeBtn && !themeMenu.contains(event.target) && !themeBtn.contains(event.target)) {
    themeMenu.classList.remove("show")
  }
})

// Inicialización cuando el documento está listo
document.addEventListener("DOMContentLoaded", () => {
  console.log("Sistema de Gestión del Centro de Salud cargado correctamente")

  const savedTheme = localStorage.getItem("theme") || "light"
  document.documentElement.setAttribute("data-bs-theme", savedTheme)

  showView("dashboard")

  const searchPacientesInput = document.getElementById("searchPacientes")
  if (searchPacientesInput) {
    searchPacientesInput.addEventListener("keyup", searchPacientes)
  }

  const searchUsuariosInput = document.getElementById("searchUsuarios")
  if (searchUsuariosInput) {
    searchUsuariosInput.addEventListener("keyup", searchUsuarios)
  }

  const searchTurnosInput = document.getElementById("searchTurnos")
  if (searchTurnosInput) {
    searchTurnosInput.addEventListener("keyup", searchTurnos)
  }

  const searchConsultasInput = document.getElementById("searchConsultas")
  if (searchConsultasInput) {
    searchConsultasInput.addEventListener("keyup", searchConsultas)
  }

  const searchProfesionalesInput = document.getElementById("searchProfesionales")
  if (searchProfesionalesInput) {
    searchProfesionalesInput.addEventListener("keyup", searchProfesionales)
  }

  const searchOrdenesInput = document.getElementById("searchOrdenes")
  if (searchOrdenesInput) {
    searchOrdenesInput.addEventListener("keyup", searchOrdenes)
  }

  const searchFacturasInput = document.getElementById("searchFacturas")
  if (searchFacturasInput) {
    searchFacturasInput.addEventListener("keyup", searchFacturas)
  }

  const searchMedicamentosInput = document.getElementById("searchMedicamentos")
  if (searchMedicamentosInput) {
    searchMedicamentosInput.addEventListener("keyup", searchMedicamentos)
  }

  const searchAlergiasInput = document.getElementById("searchAlergias")
  if (searchAlergiasInput) {
    searchAlergiasInput.addEventListener("keyup", searchAlergias)
  }

  const searchContactosInput = document.getElementById("searchContactos")
  if (searchContactosInput) {
    searchContactosInput.addEventListener("keyup", searchContactos)
  }

  const searchRecetasInput = document.getElementById("searchRecetas")
  if (searchRecetasInput) {
    searchRecetasInput.addEventListener("keyup", searchRecetas)
  }

  const searchTiposConsultasInput = document.getElementById("searchTiposConsultas")
  if (searchTiposConsultasInput) {
    searchTiposConsultasInput.addEventListener("keyup", searchTiposConsultas)
  }

  const searchEspecialidadesInput = document.getElementById("searchEspecialidades")
  if (searchEspecialidadesInput) {
    searchEspecialidadesInput.addEventListener("keyup", searchEspecialidades)
  }
})
