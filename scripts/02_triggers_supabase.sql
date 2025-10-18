-- =====================================================
-- TRIGGERS PARA CENTRO DE SALUD
-- =====================================================

-- Trigger para actualizar stock después de crear una factura
CREATE OR REPLACE FUNCTION actualizar_stock_factura()
RETURNS TRIGGER AS $$
BEGIN
    -- Aquí puedes agregar lógica para descontar medicamentos del stock
    -- cuando se facturan
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_actualizar_stock
AFTER INSERT ON detalle_factura
FOR EACH ROW
EXECUTE FUNCTION actualizar_stock_factura();

-- Trigger para validar que no se agenden turnos duplicados
CREATE OR REPLACE FUNCTION validar_turno_duplicado()
RETURNS TRIGGER AS $$
DECLARE
    turno_existente INTEGER;
BEGIN
    SELECT COUNT(*) INTO turno_existente
    FROM turnos
    WHERE id_profesional = NEW.id_profesional
    AND fecha_hora = NEW.fecha_hora
    AND estado != 'C'
    AND id_turno != COALESCE(NEW.id_turno, 0);
    
    IF turno_existente > 0 THEN
        RAISE EXCEPTION 'Ya existe un turno para este profesional en este horario';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_validar_turno
BEFORE INSERT OR UPDATE ON turnos
FOR EACH ROW
EXECUTE FUNCTION validar_turno_duplicado();

-- Trigger para registrar cambios en el estado de turnos
CREATE TABLE IF NOT EXISTS historial_turnos (
    id_historial SERIAL PRIMARY KEY,
    id_turno INTEGER,
    estado_anterior CHAR(1),
    estado_nuevo CHAR(1),
    fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_cambio INTEGER
);

CREATE OR REPLACE FUNCTION registrar_cambio_estado_turno()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.estado IS DISTINCT FROM NEW.estado THEN
        INSERT INTO historial_turnos (id_turno, estado_anterior, estado_nuevo)
        VALUES (NEW.id_turno, OLD.estado, NEW.estado);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_historial_turnos
AFTER UPDATE ON turnos
FOR EACH ROW
EXECUTE FUNCTION registrar_cambio_estado_turno();

-- Trigger para validar fechas de vencimiento de medicamentos
CREATE OR REPLACE FUNCTION validar_fecha_vencimiento()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.fecha_vencimiento <= CURRENT_DATE THEN
        RAISE EXCEPTION 'No se puede agregar stock con fecha de vencimiento pasada o actual';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_validar_vencimiento
BEFORE INSERT OR UPDATE ON stock_farmacia
FOR EACH ROW
EXECUTE FUNCTION validar_fecha_vencimiento();

-- Trigger para crear usuario automáticamente al crear un profesional
CREATE OR REPLACE FUNCTION crear_usuario_profesional()
RETURNS TRIGGER AS $$
DECLARE
    nuevo_usuario VARCHAR;
    nuevo_email VARCHAR;
BEGIN
    -- Generar usuario y email automáticamente
    nuevo_usuario := LOWER(SUBSTRING(NEW.nombre, 1, 1) || NEW.apellido);
    nuevo_email := nuevo_usuario || '@centrodesalud.com';
    
    -- Insertar usuario con rol de profesional (ID_ROL = 2)
    INSERT INTO usuarios (usuario, email, contraseña, id_rol, estado)
    VALUES (nuevo_usuario, nuevo_email, 'cambiar123', 2, 'A')
    RETURNING id_usuario INTO NEW.id_usuario;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_crear_usuario_profesional
BEFORE INSERT ON profesionales
FOR EACH ROW
WHEN (NEW.id_usuario IS NULL)
EXECUTE FUNCTION crear_usuario_profesional();
