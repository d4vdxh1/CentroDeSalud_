// Import Supabase client
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "YOUR_SUPABASE_URL"
const supabaseKey = "YOUR_SUPABASE_KEY"
const supabase = createClient(supabaseUrl, supabaseKey)

// Funciones para gestionar TURNOS

// Obtener todos los turnos
async function getTurnos() {
  try {
    const { data, error } = await supabase
      .from("turnos")
      .select(`
                *,
                pacientes (
                    nombre,
                    apellido,
                    documento
                ),
                profesionales (
                    nombre,
                    apellido,
                    matricula
                ),
                tipos_consultas (
                    tipo_consulta
                )
            `)
      .order("fecha_hora", { ascending: true })

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error("Error al obtener turnos:", error.message)
    return { success: false, error: error.message }
  }
}

// Obtener turnos por fecha
async function getTurnosByFecha(fecha) {
  try {
    const { data, error } = await supabase
      .from("turnos")
      .select(`
                *,
                pacientes (
                    nombre,
                    apellido,
                    documento
                ),
                profesionales (
                    nombre,
                    apellido
                ),
                tipos_consultas (
                    tipo_consulta
                )
            `)
      .gte("fecha_hora", `${fecha} 00:00:00`)
      .lte("fecha_hora", `${fecha} 23:59:59`)
      .order("fecha_hora", { ascending: true })

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error("Error al obtener turnos por fecha:", error.message)
    return { success: false, error: error.message }
  }
}

// Verificar disponibilidad de turno
async function verificarDisponibilidad(idProfesional, fechaHora) {
  try {
    const { data, error } = await supabase
      .from("turnos")
      .select("id_turno")
      .eq("id_profesional", idProfesional)
      .eq("fecha_hora", fechaHora)

    if (error) throw error
    return { success: true, disponible: data.length === 0 }
  } catch (error) {
    console.error("Error al verificar disponibilidad:", error.message)
    return { success: false, error: error.message }
  }
}

// Agendar nuevo turno
async function agendarTurno(turnoData) {
  try {
    const { data, error } = await supabase.from("turnos").insert([turnoData]).select()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error("Error al agendar turno:", error.message)
    return { success: false, error: error.message }
  }
}

// Actualizar estado del turno
async function updateEstadoTurno(idTurno, estado) {
  try {
    const { data, error } = await supabase.from("turnos").update({ estado: estado }).eq("id_turno", idTurno).select()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error("Error al actualizar estado del turno:", error.message)
    return { success: false, error: error.message }
  }
}
