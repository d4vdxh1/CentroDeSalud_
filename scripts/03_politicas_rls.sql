-- =====================================================
-- POLÍTICAS DE SEGURIDAD (RLS) PARA CENTRO DE SALUD
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE pacientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE turnos ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultas ENABLE ROW LEVEL SECURITY;
ALTER TABLE profesionales ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE facturas ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_farmacia ENABLE ROW LEVEL SECURITY;
ALTER TABLE ordenes_laboratorio ENABLE ROW LEVEL SECURITY;
ALTER TABLE recetas ENABLE ROW LEVEL SECURITY;

-- Política para que todos los usuarios autenticados puedan leer pacientes
CREATE POLICY "Usuarios autenticados pueden ver pacientes"
ON pacientes FOR SELECT
TO authenticated
USING (true);

-- Política para que usuarios autenticados puedan insertar pacientes
CREATE POLICY "Usuarios autenticados pueden insertar pacientes"
ON pacientes FOR INSERT
TO authenticated
WITH CHECK (true);

-- Política para que usuarios autenticados puedan actualizar pacientes
CREATE POLICY "Usuarios autenticados pueden actualizar pacientes"
ON pacientes FOR UPDATE
TO authenticated
USING (true);

-- Política para turnos
CREATE POLICY "Usuarios autenticados pueden ver turnos"
ON turnos FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Usuarios autenticados pueden crear turnos"
ON turnos FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Usuarios autenticados pueden actualizar turnos"
ON turnos FOR UPDATE
TO authenticated
USING (true);

-- Política para consultas
CREATE POLICY "Usuarios autenticados pueden ver consultas"
ON consultas FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Usuarios autenticados pueden crear consultas"
ON consultas FOR INSERT
TO authenticated
WITH CHECK (true);

-- Política para profesionales
CREATE POLICY "Usuarios autenticados pueden ver profesionales"
ON profesionales FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Usuarios autenticados pueden crear profesionales"
ON profesionales FOR INSERT
TO authenticated
WITH CHECK (true);

-- Política para medicamentos y stock
CREATE POLICY "Usuarios autenticados pueden ver medicamentos"
ON medicamentos FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Usuarios autenticados pueden ver stock"
ON stock_farmacia FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Usuarios autenticados pueden actualizar stock"
ON stock_farmacia FOR UPDATE
TO authenticated
USING (true);

-- Política para facturas
CREATE POLICY "Usuarios autenticados pueden ver facturas"
ON facturas FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Usuarios autenticados pueden crear facturas"
ON facturas FOR INSERT
TO authenticated
WITH CHECK (true);

-- Política para órdenes de laboratorio
CREATE POLICY "Usuarios autenticados pueden ver órdenes"
ON ordenes_laboratorio FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Usuarios autenticados pueden crear órdenes"
ON ordenes_laboratorio FOR INSERT
TO authenticated
WITH CHECK (true);

-- Política para recetas
CREATE POLICY "Usuarios autenticados pueden ver recetas"
ON recetas FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Usuarios autenticados pueden crear recetas"
ON recetas FOR INSERT
TO authenticated
WITH CHECK (true);

-- Política para usuarios (solo lectura para todos, escritura restringida)
CREATE POLICY "Usuarios autenticados pueden ver usuarios"
ON usuarios FOR SELECT
TO authenticated
USING (true);
