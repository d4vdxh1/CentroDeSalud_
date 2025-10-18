// Funciones para gestionar PACIENTES

const supabase = // Initialize your Supabase client here
  // Obtener todos los pacientes
  async function getPacientes() {
    try {
      const { data, error } = await supabase
        .from("pacientes")
        .select(`
                *,
                alergias (
                    nombre_alergia
                )
            `)
        .order("apellido", { ascending: true })

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error("Error al obtener pacientes:", error.message)
      return { success: false, error: error.message }
    }
  }

// Buscar paciente por documento
async function getPacienteByDocumento(documento) {
  try {
    const { data, error } = await supabase
      .from("pacientes")
      .select(`
                *,
                alergias (
                    nombre_alergia
                ),
                contactos_emergencias (
                    nombre,
                    relacion,
                    telefono
                )
            `)
      .eq("documento", documento)
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error("Error al buscar paciente:", error.message)
    return { success: false, error: error.message }
  }
}

// Insertar nuevo paciente
async function insertPaciente(pacienteData) {
  try {
    const { data, error } = await supabase.from("pacientes").insert([pacienteData]).select()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error("Error al insertar paciente:", error.message)
    return { success: false, error: error.message }
  }
}

// Actualizar paciente
async function updatePaciente(idPaciente, pacienteData) {
  try {
    const { data, error } = await supabase.from("pacientes").update(pacienteData).eq("id_paciente", idPaciente).select()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error("Error al actualizar paciente:", error.message)
    return { success: false, error: error.message }
  }
}

// Eliminar paciente
async function deletePaciente(idPaciente) {
  try {
    const { error } = await supabase.from("pacientes").delete().eq("id_paciente", idPaciente)

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error("Error al eliminar paciente:", error.message)
    return { success: false, error: error.message }
  }
}
