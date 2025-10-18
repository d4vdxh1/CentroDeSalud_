// Import Supabase client
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = "https://your-supabase-url.supabase.co"
const supabaseKey = "your-supabase-key"
const supabase = createClient(supabaseUrl, supabaseKey)

// Funciones para gestionar FARMACIA

// Obtener todos los medicamentos
async function getMedicamentos() {
  try {
    const { data, error } = await supabase.from("medicamentos").select("*").order("nombre", { ascending: true })

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error("Error al obtener medicamentos:", error.message)
    return { success: false, error: error.message }
  }
}

// Obtener stock de farmacia
async function getStockFarmacia() {
  try {
    const { data, error } = await supabase
      .from("stock_farmacia")
      .select(`
                *,
                medicamentos (
                    nombre,
                    presentacion,
                    laboratorio
                )
            `)
      .order("fecha_vencimiento", { ascending: true })

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error("Error al obtener stock:", error.message)
    return { success: false, error: error.message }
  }
}

// Obtener medicamentos con stock bajo (menos de 10 unidades)
async function getStockBajo() {
  try {
    const { data, error } = await supabase
      .from("stock_farmacia")
      .select(`
                *,
                medicamentos (
                    nombre,
                    presentacion,
                    laboratorio
                )
            `)
      .lt("cantidad", 10)
      .order("cantidad", { ascending: true })

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error("Error al obtener stock bajo:", error.message)
    return { success: false, error: error.message }
  }
}

// Actualizar stock
async function updateStock(idStock, nuevaCantidad) {
  try {
    const { data, error } = await supabase
      .from("stock_farmacia")
      .update({ cantidad: nuevaCantidad })
      .eq("id_stock", idStock)
      .select()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error("Error al actualizar stock:", error.message)
    return { success: false, error: error.message }
  }
}

// Insertar nuevo medicamento
async function insertMedicamento(medicamentoData) {
  try {
    const { data, error } = await supabase.from("medicamentos").insert([medicamentoData]).select()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error("Error al insertar medicamento:", error.message)
    return { success: false, error: error.message }
  }
}
