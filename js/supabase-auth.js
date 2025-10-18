// Funciones de autenticación con Supabase

const supabase = // Declarar o importar la variable supabase aquí
  // Iniciar sesión
  async function loginUser(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      })

      if (error) throw error

      // Obtener información del usuario desde la tabla USUARIOS
      const { data: userData, error: userError } = await supabase
        .from("usuarios")
        .select(`
                *,
                roles (
                    rol
                )
            `)
        .eq("email", email)
        .single()

      if (userError) throw userError

      // Guardar información del usuario en localStorage
      localStorage.setItem("user", JSON.stringify(userData))

      return { success: true, user: userData }
    } catch (error) {
      console.error("Error en login:", error.message)
      return { success: false, error: error.message }
    }
  }

// Cerrar sesión
async function logoutUser() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error

    localStorage.removeItem("user")
    window.location.href = "/login/login.html"
  } catch (error) {
    console.error("Error al cerrar sesión:", error.message)
  }
}

// Obtener usuario actual
function getCurrentUser() {
  const userStr = localStorage.getItem("user")
  return userStr ? JSON.parse(userStr) : null
}

// Verificar si el usuario tiene un rol específico
function hasRole(roleName) {
  const user = getCurrentUser()
  return user && user.roles && user.roles.rol === roleName
}
