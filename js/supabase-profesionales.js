// Funciones para gestionar PROFESIONALES

// Import Supabase client
const { createClient } = require("@supabase/supabase-js")
const supabaseUrl = "your_supabase_url"
const supabaseKey = "your_supabase_key"
const supabase = createClient(supabaseUrl, supabaseKey)

// Obtener todos los profesionales
async function getProfesionales() {
  try {
    const { data, error } = await supabase
      .from("profesionales")
      .select(`
                *,
                usuarios (
                    usuario,
                    email
                ),
                especialidades_profesionales (
                    especialidades (
                        especialidad
                    )
                )
            `)
      .order("apellido", { ascending: true })

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error("Error al obtener profesionales:", error.message)
    return { success: false, error: error.message }
  }
}

// Obtener profesionales por especialidad
async function getProfesionalesByEspecialidad(idEspecialidad) {
  try {
    const { data, error } = await supabase
      .from("especialidades_profesionales")
      .select(`
                profesionales (
                    *,
                    usuarios (
                        usuario,
                        email
                    )
                )
            `)
      .eq("id_especialidad", idEspecialidad)

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error("Error al obtener profesionales por especialidad:", error.message)
    return { success: false, error: error.message }
  }
}

// Insertar nuevo profesional
async function insertProfesional(profesionalData) {
  try {
    const { data, error } = await supabase.from("profesionales").insert([profesionalData]).select()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error("Error al insertar profesional:", error.message)
    return { success: false, error: error.message }
  }
}

// Obtener todas las especialidades
async function getEspecialidades() {
  try {
    const { data, error } = await supabase.from("especialidades").select("*").order("especialidad", { ascending: true })

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error("Error al obtener especialidades:", error.message)
    return { success: false, error: error.message }
  }
}
