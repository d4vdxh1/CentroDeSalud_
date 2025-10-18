// Funciones para gestionar CONSULTAS

// Declare the supabase variable before using it\
const supabase = /* initialize your supabase client here */;

// Obtener todas las consultas
async function getConsultas() {
  try {
    const { data, error } = await supabase
      .from("consultas")
      .select(`
                *,
                turnos (
                    fecha_hora,
                    pacientes (
                        nombre,
                        apellido,
                        documento
                    ),
                    profesionales (
                        nombre,
                        apellido
                    )
                )
            `)
      .order("id_consultas", { ascending: false })

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error("Error al obtener consultas:", error.message)
    return { success: false, error: error.message }
  }
}

// Registrar nueva consulta
async function registrarConsulta(consultaData) {
  try {
    const { data, error } = await supabase.from("consultas").insert([consultaData]).select()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error("Error al registrar consulta:", error.message)
    return { success: false, error: error.message }
  }
}

// Obtener recetas de una consulta
async function getRecetasByConsulta(idConsulta) {
  try {
    const { data, error } = await supabase.from("recetas").select("*").eq("id_consultas", idConsulta)

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error("Error al obtener recetas:", error.message)
    return { success: false, error: error.message }
  }
}

// Crear receta
async function crearReceta(recetaData) {
  try {
    const { data, error } = await supabase.from("recetas").insert([recetaData]).select()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error("Error al crear receta:", error.message)
    return { success: false, error: error.message }
  }
}
