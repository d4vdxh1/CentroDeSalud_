-- =====================================================
-- DATOS INICIALES PARA CENTRO DE SALUD
-- =====================================================

-- Insertar roles
INSERT INTO roles (id_rol, rol) VALUES
(1, 'Administrador'),
(2, 'Profesional'),
(3, 'Recepcionista'),
(4, 'Farmaceutico')
ON CONFLICT (id_rol) DO NOTHING;

-- Insertar permisos
INSERT INTO permisos (id_permiso, permiso) VALUES
(1, 'Gestionar Pacientes'),
(2, 'Gestionar Turnos'),
(3, 'Gestionar Consultas'),
(4, 'Gestionar Profesionales'),
(5, 'Gestionar Farmacia'),
(6, 'Gestionar Facturación'),
(7, 'Gestionar Usuarios'),
(8, 'Ver Reportes')
ON CONFLICT (id_permiso) DO NOTHING;

-- Asignar permisos a roles
INSERT INTO roles_permisos (id_rol, id_permiso) VALUES
-- Administrador tiene todos los permisos
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7), (1, 8),
-- Profesional
(2, 1), (2, 2), (2, 3), (2, 8),
-- Recepcionista
(3, 1), (3, 2), (3, 6),
-- Farmacéutico
(4, 5), (4, 8)
ON CONFLICT DO NOTHING;

-- Insertar especialidades
INSERT INTO especialidades (especialidad) VALUES
('Medicina General'),
('Pediatría'),
('Cardiología'),
('Traumatología'),
('Ginecología'),
('Dermatología'),
('Oftalmología'),
('Odontología')
ON CONFLICT DO NOTHING;

-- Insertar tipos de consultas
INSERT INTO tipos_consultas (tipo_consulta) VALUES
('Consulta General'),
('Control'),
('Urgencia'),
('Seguimiento'),
('Primera Vez')
ON CONFLICT DO NOTHING;

-- Insertar alergias comunes
INSERT INTO alergias (nombre_alergia) VALUES
('Penicilina'),
('Aspirina'),
('Ibuprofeno'),
('Lactosa'),
('Gluten'),
('Polen'),
('Ácaros'),
('Ninguna')
ON CONFLICT DO NOTHING;

-- Insertar medicamentos de ejemplo
INSERT INTO medicamentos (nombre, presentacion, laboratorio) VALUES
('Paracetamol', '500mg - Comprimidos', 'Laboratorio ABC'),
('Ibuprofeno', '400mg - Comprimidos', 'Laboratorio XYZ'),
('Amoxicilina', '500mg - Cápsulas', 'Laboratorio DEF'),
('Omeprazol', '20mg - Cápsulas', 'Laboratorio GHI'),
('Losartán', '50mg - Comprimidos', 'Laboratorio JKL')
ON CONFLICT DO NOTHING;
