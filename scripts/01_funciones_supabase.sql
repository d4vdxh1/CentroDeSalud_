-- =====================================================
-- FUNCIONES Y PROCEDIMIENTOS PARA CENTRO DE SALUD
-- =====================================================

-- Función para obtener pacientes con sus alergias
CREATE OR REPLACE FUNCTION obtener_pacientes_completo()
RETURNS TABLE (
    id_paciente INTEGER,
    nombre VARCHAR,
    apellido VARCHAR,
    documento VARCHAR,
    fecha_nacimiento DATE,
    sexo CHAR,
    telefono VARCHAR,
    email VARCHAR,
    direccion VARCHAR,
    grupo_sanguineo VARCHAR,
    alergias TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id_paciente,
        p.nombre,
        p.apellido,
        p.documento,
        p.fecha_nacimiento,
        p.sexo,
        p.telefono,
        p.email,
        p.direccion,
        p.grupo_sanguineo,
        COALESCE(a.nombre_alergia, 'Sin alergias') as alergias
    FROM pacientes p
    LEFT JOIN alergias a ON p.id_alergia = a.id_alergia
    ORDER BY p.apellido, p.nombre;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener turnos del día con información completa
CREATE OR REPLACE FUNCTION obtener_turnos_dia(fecha_consulta DATE)
RETURNS TABLE (
    id_turno INTEGER,
    fecha_hora TIMESTAMP,
    paciente_nombre VARCHAR,
    paciente_apellido VARCHAR,
    profesional_nombre VARCHAR,
    profesional_apellido VARCHAR,
    tipo_consulta VARCHAR,
    estado CHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.id_turno,
        t.fecha_hora,
        pac.nombre as paciente_nombre,
        pac.apellido as paciente_apellido,
        prof.nombre as profesional_nombre,
        prof.apellido as profesional_apellido,
        tc.tipo_consulta,
        t.estado
    FROM turnos t
    INNER JOIN pacientes pac ON t.id_paciente = pac.id_paciente
    INNER JOIN profesionales prof ON t.id_profesional = prof.id_profesional
    LEFT JOIN tipos_consultas tc ON t.id_tipo_consulta = tc.id_tipo_consulta
    WHERE DATE(t.fecha_hora) = fecha_consulta
    ORDER BY t.fecha_hora;
END;
$$ LANGUAGE plpgsql;

-- Función para verificar disponibilidad de profesional
CREATE OR REPLACE FUNCTION verificar_disponibilidad_profesional(
    p_id_profesional INTEGER,
    p_fecha_hora TIMESTAMP
)
RETURNS BOOLEAN AS $$
DECLARE
    turno_existente INTEGER;
BEGIN
    SELECT COUNT(*) INTO turno_existente
    FROM turnos
    WHERE id_profesional = p_id_profesional
    AND fecha_hora = p_fecha_hora
    AND estado != 'C'; -- C = Cancelado
    
    RETURN turno_existente = 0;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener stock bajo de medicamentos
CREATE OR REPLACE FUNCTION obtener_stock_bajo(cantidad_minima INTEGER DEFAULT 10)
RETURNS TABLE (
    id_medicamento INTEGER,
    nombre_medicamento VARCHAR,
    presentacion VARCHAR,
    laboratorio VARCHAR,
    cantidad_total BIGINT,
    lotes_disponibles BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        m.id_medicamento,
        m.nombre,
        m.presentacion,
        m.laboratorio,
        SUM(sf.cantidad) as cantidad_total,
        COUNT(sf.id_stock) as lotes_disponibles
    FROM medicamentos m
    INNER JOIN stock_farmacia sf ON m.id_medicamento = sf.id_medicamento
    WHERE sf.fecha_vencimiento > CURRENT_DATE
    GROUP BY m.id_medicamento, m.nombre, m.presentacion, m.laboratorio
    HAVING SUM(sf.cantidad) < cantidad_minima
    ORDER BY cantidad_total ASC;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener consultas con información completa
CREATE OR REPLACE FUNCTION obtener_consultas_completas()
RETURNS TABLE (
    id_consulta INTEGER,
    fecha_hora TIMESTAMP,
    paciente_nombre VARCHAR,
    paciente_apellido VARCHAR,
    profesional_nombre VARCHAR,
    profesional_apellido VARCHAR,
    motivo VARCHAR,
    diagnostico VARCHAR,
    notas VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id_consultas,
        t.fecha_hora,
        pac.nombre as paciente_nombre,
        pac.apellido as paciente_apellido,
        prof.nombre as profesional_nombre,
        prof.apellido as profesional_apellido,
        c.motivo,
        c.diagnostico,
        c.notas
    FROM consultas c
    INNER JOIN turnos t ON c.id_turno = t.id_turno
    INNER JOIN pacientes pac ON t.id_paciente = pac.id_paciente
    INNER JOIN profesionales prof ON t.id_profesional = prof.id_profesional
    ORDER BY t.fecha_hora DESC;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener profesionales con sus especialidades
CREATE OR REPLACE FUNCTION obtener_profesionales_especialidades()
RETURNS TABLE (
    id_profesional INTEGER,
    nombre VARCHAR,
    apellido VARCHAR,
    matricula VARCHAR,
    especialidades TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id_profesional,
        p.nombre,
        p.apellido,
        p.matricula,
        STRING_AGG(e.especialidad, ', ') as especialidades
    FROM profesionales p
    LEFT JOIN especialidades_profesionales ep ON p.id_profesional = ep.id_profesional
    LEFT JOIN especialidades e ON ep.id_especialidad = e.id_especialidad
    GROUP BY p.id_profesional, p.nombre, p.apellido, p.matricula
    ORDER BY p.apellido, p.nombre;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener historial completo de un paciente
CREATE OR REPLACE FUNCTION obtener_historial_paciente(p_id_paciente INTEGER)
RETURNS TABLE (
    fecha_consulta TIMESTAMP,
    profesional VARCHAR,
    motivo VARCHAR,
    diagnostico VARCHAR,
    recetas TEXT,
    ordenes_lab TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.fecha_hora as fecha_consulta,
        CONCAT(prof.nombre, ' ', prof.apellido) as profesional,
        c.motivo,
        c.diagnostico,
        COALESCE(STRING_AGG(DISTINCT r.descripcion, '; '), 'Sin recetas') as recetas,
        COALESCE(STRING_AGG(DISTINCT ol.resultado_url, '; '), 'Sin órdenes') as ordenes_lab
    FROM turnos t
    INNER JOIN profesionales prof ON t.id_profesional = prof.id_profesional
    LEFT JOIN consultas c ON t.id_turno = c.id_turno
    LEFT JOIN recetas r ON c.id_consultas = r.id_consultas
    LEFT JOIN ordenes_laboratorio ol ON c.id_consultas = ol.id_consultas
    WHERE t.id_paciente = p_id_paciente
    GROUP BY t.fecha_hora, prof.nombre, prof.apellido, c.motivo, c.diagnostico
    ORDER BY t.fecha_hora DESC;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener estadísticas del dashboard
CREATE OR REPLACE FUNCTION obtener_estadisticas_dashboard()
RETURNS TABLE (
    total_pacientes BIGINT,
    turnos_hoy BIGINT,
    profesionales_activos BIGINT,
    stock_critico BIGINT,
    consultas_mes BIGINT,
    facturas_pendientes BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM pacientes) as total_pacientes,
        (SELECT COUNT(*) FROM turnos WHERE DATE(fecha_hora) = CURRENT_DATE AND estado != 'C') as turnos_hoy,
        (SELECT COUNT(*) FROM profesionales) as profesionales_activos,
        (SELECT COUNT(*) FROM (
            SELECT m.id_medicamento
            FROM medicamentos m
            INNER JOIN stock_farmacia sf ON m.id_medicamento = sf.id_medicamento
            WHERE sf.fecha_vencimiento > CURRENT_DATE
            GROUP BY m.id_medicamento
            HAVING SUM(sf.cantidad) < 10
        ) as stock_bajo) as stock_critico,
        (SELECT COUNT(*) FROM consultas c 
         INNER JOIN turnos t ON c.id_turno = t.id_turno 
         WHERE EXTRACT(MONTH FROM t.fecha_hora) = EXTRACT(MONTH FROM CURRENT_DATE)
         AND EXTRACT(YEAR FROM t.fecha_hora) = EXTRACT(YEAR FROM CURRENT_DATE)) as consultas_mes,
        (SELECT COUNT(*) FROM facturas WHERE forma_pago = 'PE') as facturas_pendientes;
END;
$$ LANGUAGE plpgsql;
