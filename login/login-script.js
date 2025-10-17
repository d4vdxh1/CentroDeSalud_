// Esperar a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {
  // Elementos del formulario
  const loginForm = document.getElementById("loginForm")
  const usernameInput = document.getElementById("username")
  const passwordInput = document.getElementById("password")
  const togglePasswordBtn = document.getElementById("togglePassword")
  const toggleIcon = document.getElementById("toggleIcon")
  const loginButton = document.getElementById("loginButton")
  const buttonText = document.getElementById("buttonText")
  const buttonSpinner = document.getElementById("buttonSpinner")
  const errorAlert = document.getElementById("errorAlert")
  const errorMessage = document.getElementById("errorMessage")
  const rememberMeCheckbox = document.getElementById("rememberMe")

  // Función para mostrar/ocultar contraseña
  togglePasswordBtn.addEventListener("click", () => {
    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password"
    passwordInput.setAttribute("type", type)

    // Cambiar icono
    if (type === "text") {
      toggleIcon.classList.remove("bi-eye")
      toggleIcon.classList.add("bi-eye-slash")
    } else {
      toggleIcon.classList.remove("bi-eye-slash")
      toggleIcon.classList.add("bi-eye")
    }
  })

  // Función para mostrar error
  function showError(message) {
    errorMessage.textContent = message
    errorAlert.classList.remove("d-none")

    // Ocultar después de 5 segundos
    setTimeout(() => {
      errorAlert.classList.add("d-none")
    }, 5000)
  }

  // Función para ocultar error
  function hideError() {
    errorAlert.classList.add("d-none")
  }

  // Función para mostrar estado de carga
  function setLoading(isLoading) {
    if (isLoading) {
      loginButton.disabled = true
      buttonText.classList.add("d-none")
      buttonSpinner.classList.remove("d-none")
    } else {
      loginButton.disabled = false
      buttonText.classList.remove("d-none")
      buttonSpinner.classList.add("d-none")
    }
  }

  // Validación del formulario
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault()
    event.stopPropagation()

    // Ocultar errores previos
    hideError()

    // Validar formulario
    if (!loginForm.checkValidity()) {
      loginForm.classList.add("was-validated")
      return
    }

    // Obtener valores
    const username = usernameInput.value.trim()
    const password = passwordInput.value
    const rememberMe = rememberMeCheckbox.checked

    // Mostrar estado de carga
    setLoading(true)

    // Simular llamada al servidor (reemplaza esto con tu lógica real)
    setTimeout(() => {
      // AQUÍ DEBES AGREGAR TU LÓGICA DE AUTENTICACIÓN
      // Ejemplo de validación simple (REEMPLAZAR CON TU BACKEND)

      if (username === "admin" && password === "admin") {
        // Login exitoso
        console.log("Login exitoso")

        // Guardar sesión si "Recordarme" está marcado
        if (rememberMe) {
          localStorage.setItem("rememberUser", username)
        }

        // Redirigir a la página principal del sistema
        // CAMBIA 'dashboard.html' por tu página de administración
        window.location.href = "dashboard.html"
      } else {
        // Login fallido
        setLoading(false)
        showError("Usuario o contraseña incorrectos")
        loginForm.classList.remove("was-validated")
      }
    }, 1500)
  })

  // Cargar usuario guardado si existe
  const savedUsername = localStorage.getItem("rememberUser")
  if (savedUsername) {
    usernameInput.value = savedUsername
    rememberMeCheckbox.checked = true
  }

  // Limpiar validación al escribir
  usernameInput.addEventListener("input", () => {
    if (loginForm.classList.contains("was-validated")) {
      loginForm.classList.remove("was-validated")
    }
  })

  passwordInput.addEventListener("input", () => {
    if (loginForm.classList.contains("was-validated")) {
      loginForm.classList.remove("was-validated")
    }
  })
})
