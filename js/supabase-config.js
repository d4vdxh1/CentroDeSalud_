// Configuración de Supabase
const SUPABASE_URL = "https://fccinrcbjekzyvalfcaq.supabase.co"
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjY2lucmNiamVrenl2YWxmY2FxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3MDc2OTUsImV4cCI6MjA3NjI4MzY5NX0.i80eCa5H6RV9dObiq2Ww-DRa1Gf8fLGVDImqdcQJrv4"

window.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Verificar conexión
async function verificarConexion() {
  try {
    const { data, error } = await window.supabase.from("PACIENTES").select("count", { count: "exact", head: true })
    if (error) {
      console.error("Error de conexión:", error)
      return false
    }
    console.log("✅ Conexión exitosa con Supabase")
    return true
  } catch (err) {
    console.error("Error al verificar conexión:", err)
    return false
  }
}

// Verificar si el usuario está autenticado
async function checkAuth() {
  const {
    data: { session },
  } = await window.supabase.auth.getSession()
  return session
}

// Redirigir si no está autenticado
async function requireAuth() {
  const session = await checkAuth()
  if (!session) {
    window.location.href = "/login/login.html"
  }
  return session
}
