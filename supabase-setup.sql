-- MentorIA: Script SQL para Supabase
-- Ejecutar este script en el SQL Editor de Supabase

-- ============================================================================
-- Extensiones necesarias
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS pgcrypto; -- para gen_random_uuid()

-- ============================================================================
-- Limpieza previa (DROP IF EXISTS)
-- ============================================================================
DROP TABLE IF EXISTS recursos_generados CASCADE;
DROP TABLE IF EXISTS configuraciones_docente CASCADE;
DROP TABLE IF EXISTS fuentes_externas CASCADE;
DROP TABLE IF EXISTS retroalimentaciones CASCADE;
DROP TABLE IF EXISTS evaluaciones CASCADE;
DROP TABLE IF EXISTS entregas CASCADE;
DROP TABLE IF EXISTS sesiones CASCADE;
DROP TABLE IF EXISTS actividades CASCADE;
DROP TABLE IF EXISTS clases CASCADE;
DROP TABLE IF EXISTS estudiante_necesidad CASCADE;
DROP TABLE IF EXISTS necesidades_inclusion CASCADE;
DROP TABLE IF EXISTS estudiantes CASCADE;
DROP TABLE IF EXISTS docentes CASCADE;
DROP TABLE IF EXISTS cursos CASCADE;
DROP TABLE IF EXISTS instituciones CASCADE;
DROP TABLE IF EXISTS interacciones_ia CASCADE;

-- ============================================================================
-- Tablas base (UUID PKs)
-- ============================================================================
CREATE TABLE instituciones (
  id_institucion        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre                VARCHAR(150) NOT NULL,
  departamento          VARCHAR(80)  NOT NULL,
  ciudad                VARCHAR(80)  NOT NULL,
  direccion             VARCHAR(120) NOT NULL,
  nit                   VARCHAR(20)  NOT NULL
);

CREATE TABLE docentes (
  id_docente            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_institucion        UUID NOT NULL REFERENCES instituciones(id_institucion),
  nombres               VARCHAR(80) NOT NULL,
  apellidos             VARCHAR(120) NOT NULL,
  tipo_documento        VARCHAR(5) NOT NULL,
  numero_documento      VARCHAR(20) NOT NULL,
  correo                VARCHAR(120),
  celular               VARCHAR(20) NOT NULL,
  area                  VARCHAR(80) NOT NULL,
  regimen_contratacion  VARCHAR(20) NOT NULL
);

CREATE TABLE estudiantes (
  id_estudiante         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_institucion        UUID NOT NULL REFERENCES instituciones(id_institucion),
  nombres               VARCHAR(80) NOT NULL,
  apellidos             VARCHAR(120) NOT NULL,
  tipo_documento        VARCHAR(5) NOT NULL,
  numero_documento      VARCHAR(20) NOT NULL,
  correo                VARCHAR(120),
  celular               VARCHAR(20) NOT NULL,
  fecha_nacimiento      DATE NOT NULL,
  estrato               INT NOT NULL,
  departamento          VARCHAR(80) NOT NULL,
  ciudad                VARCHAR(80) NOT NULL,
  barrio                VARCHAR(80),
  consentimiento_habeas BOOLEAN NOT NULL
);

CREATE TABLE necesidades_inclusion (
  id_necesidad          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre                VARCHAR(80) NOT NULL
);

CREATE TABLE estudiante_necesidad (
  id_estudiante         UUID NOT NULL,
  id_necesidad          UUID NOT NULL,
  severidad             VARCHAR(15) NOT NULL,
  observaciones         VARCHAR(200),
  PRIMARY KEY (id_estudiante, id_necesidad),
  CONSTRAINT fk_en_est FOREIGN KEY (id_estudiante)
    REFERENCES estudiantes(id_estudiante) ON DELETE CASCADE,
  CONSTRAINT fk_en_nec FOREIGN KEY (id_necesidad)
    REFERENCES necesidades_inclusion(id_necesidad) ON DELETE CASCADE
);

CREATE TABLE cursos (
  id_curso              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_institucion        UUID NOT NULL REFERENCES instituciones(id_institucion),
  nombre                VARCHAR(120) NOT NULL,
  area                  VARCHAR(80) NOT NULL,
  grado                 VARCHAR(10) NOT NULL,
  jornada               VARCHAR(15) NOT NULL
);

CREATE TABLE clases (
  id_clase              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_curso              UUID NOT NULL REFERENCES cursos(id_curso),
  id_docente            UUID NOT NULL REFERENCES docentes(id_docente),
  periodo               VARCHAR(10) NOT NULL,
  fecha_inicio          DATE NOT NULL,
  fecha_fin             DATE NOT NULL
);

CREATE TABLE actividades (
  id_actividad          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_clase              UUID NOT NULL REFERENCES clases(id_clase),
  titulo                VARCHAR(150) NOT NULL,
  objetivo              VARCHAR(180) NOT NULL,
  nivel_taxonomia       VARCHAR(20) NOT NULL,
  tipo_recurso          VARCHAR(30) NOT NULL,
  complejidad           VARCHAR(10) NOT NULL
);

CREATE TABLE sesiones (
  id_sesion             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rol                   VARCHAR(15) NOT NULL, -- Estudiante/Docente
  id_estudiante         UUID NULL REFERENCES estudiantes(id_estudiante),
  id_docente            UUID NULL REFERENCES docentes(id_docente),
  fecha_hora            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  canal                 VARCHAR(15) NOT NULL,
  duracion_min          INT NOT NULL,
  ciudad_origen         VARCHAR(80) NOT NULL
);

CREATE TABLE entregas (
  id_entrega                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_actividad              UUID NOT NULL REFERENCES actividades(id_actividad),
  id_estudiante             UUID NOT NULL REFERENCES estudiantes(id_estudiante),
  fecha_entrega             DATE NOT NULL,
  palabras                  INT NOT NULL,
  fuentes_detectadas        INT NULL,
  similitud_externa_pct     INT NOT NULL,
  razonamiento_original_pct INT NOT NULL,
  texto_respuesta           TEXT NOT NULL
);

CREATE TABLE evaluaciones (
  id_evaluacion         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_entrega            UUID NOT NULL REFERENCES entregas(id_entrega) ON DELETE CASCADE,
  estructura_score      DECIMAL(3,1) NOT NULL,
  evidencia_score       DECIMAL(3,1) NOT NULL,
  critica_score         DECIMAL(3,1) NOT NULL,
  creatividad_score     DECIMAL(3,1) NOT NULL,
  rubrica_total         DECIMAL(3,1) NOT NULL,
  nivel_desempeno       VARCHAR(15) NOT NULL,
  retroalimentacion_resumen VARCHAR(250) NOT NULL
);

CREATE TABLE retroalimentaciones (
  id_retro              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_evaluacion         UUID NOT NULL REFERENCES evaluaciones(id_evaluacion) ON DELETE CASCADE,
  tipo                  VARCHAR(15) NOT NULL, -- Automática/Docente
  sugerencia            VARCHAR(250) NOT NULL,
  accion_recomendada    VARCHAR(150) NOT NULL
);

CREATE TABLE fuentes_externas (
  id_fuente             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_entrega            UUID NOT NULL REFERENCES entregas(id_entrega) ON DELETE CASCADE,
  url                   VARCHAR(300) NOT NULL,
  dominio               VARCHAR(120) NOT NULL,
  porcentaje_contribucion INT NOT NULL,
  tipo_fuente           VARCHAR(40) NOT NULL
);

CREATE TABLE configuraciones_docente (
  id_conf               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_docente            UUID NOT NULL REFERENCES docentes(id_docente),
  objetivo_aprendizaje  VARCHAR(250) NOT NULL,
  necesidades_inclusion_objetivo VARCHAR(200) NOT NULL,
  formato_salida        VARCHAR(15) NOT NULL,
  accesibilidad_requerida VARCHAR(120) NOT NULL,
  fecha_creacion        DATE NOT NULL
);

CREATE TABLE recursos_generados (
  id_recurso            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_conf               UUID NOT NULL REFERENCES configuraciones_docente(id_conf) ON DELETE CASCADE,
  titulo                VARCHAR(150) NOT NULL,
  tipo                  VARCHAR(30) NOT NULL,
  duracion_estimada_min INT NOT NULL,
  accesibilidad_tags    VARCHAR(120) NOT NULL,
  url_recurso           VARCHAR(200) NOT NULL
);

-- ============================================================================
-- Tabla adicional: INTERACCIONES_IA
-- ============================================================================
CREATE TABLE interacciones_ia (
  id_interaccion        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_estudiante         UUID NULL REFERENCES estudiantes(id_estudiante) ON DELETE SET NULL,
  rol                   VARCHAR(20) NOT NULL, -- 'Estudiante' o 'AgenteIA'
  mensaje               TEXT NOT NULL,
  fecha_hora            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  estilo_aprendizaje    VARCHAR(50) NULL
);

-- ============================================================================
-- Tablas para guías iniciales y micro-retos
-- ============================================================================
CREATE TABLE estilos_aprendizaje (
  id_estilo UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre    VARCHAR(40) UNIQUE NOT NULL,
  descripcion TEXT
);

CREATE TABLE perfil_aprendizaje_estudiante (
  id_estudiante UUID PRIMARY KEY REFERENCES estudiantes(id_estudiante) ON DELETE CASCADE,
  id_estilo_principal UUID NULL REFERENCES estilos_aprendizaje(id_estilo),
  fortalezas TEXT,
  debilidades TEXT
);

CREATE TABLE plan_guiado (
  id_plan UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_actividad UUID NOT NULL REFERENCES actividades(id_actividad) ON DELETE CASCADE,
  id_estudiante UUID NOT NULL REFERENCES estudiantes(id_estudiante) ON DELETE CASCADE,
  estilo_aprendizaje VARCHAR(50), -- snapshot del momento
  estado VARCHAR(15) NOT NULL DEFAULT 'activo', -- activo|pausado|cerrado
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE pasos_plan (
  id_paso UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_plan UUID NOT NULL REFERENCES plan_guiado(id_plan) ON DELETE CASCADE,
  orden INT NOT NULL,
  tipo VARCHAR(20) NOT NULL, -- esquema|paso|tarea|pregunta
  contenido JSONB NOT NULL,  -- flexible: {titulo, texto, checklist, recursos, etc.}
  sugerido_por VARCHAR(10) NOT NULL DEFAULT 'IA', -- IA|Docente
  completado BOOLEAN NOT NULL DEFAULT FALSE,
  completado_en TIMESTAMPTZ
);

CREATE TABLE micro_retros (
  id_reto UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_paso UUID NOT NULL REFERENCES pasos_plan(id_paso) ON DELETE CASCADE,
  prompt TEXT NOT NULL,                 -- "Escribe 2 ideas clave del párrafo..."
  habilidad_objetivo VARCHAR(40) NULL,  -- inferencia|síntesis|argumento|...
  pista TEXT NULL,                      -- ayudas graduales
  criterio_aceptacion TEXT NULL,        -- qué valida que supere el reto (rubrica breve)
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE respuestas_estudiante (
  id_respuesta UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_reto UUID NULL REFERENCES micro_retros(id_reto) ON DELETE CASCADE,
  id_paso UUID NULL REFERENCES pasos_plan(id_paso) ON DELETE CASCADE,
  id_estudiante UUID NOT NULL REFERENCES estudiantes(id_estudiante) ON DELETE CASCADE,
  contenido TEXT NOT NULL,
  calificacion JSONB NULL, -- {rubrica:{...}, autoeval:{...}}
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- Índices sugeridos
-- ============================================================================
CREATE INDEX idx_docentes_inst            ON docentes(id_institucion);
CREATE INDEX idx_estudiantes_inst         ON estudiantes(id_institucion);
CREATE INDEX idx_cursos_inst              ON cursos(id_institucion);
CREATE INDEX idx_clases_curso             ON clases(id_curso);
CREATE INDEX idx_clases_docente           ON clases(id_docente);
CREATE INDEX idx_actividades_clase        ON actividades(id_clase);
CREATE INDEX idx_entregas_actividad       ON entregas(id_actividad);
CREATE INDEX idx_entregas_estudiante      ON entregas(id_estudiante);
CREATE INDEX idx_eval_entrega             ON evaluaciones(id_entrega);
CREATE INDEX idx_retro_eval               ON retroalimentaciones(id_evaluacion);
CREATE INDEX idx_fuentes_entrega          ON fuentes_externas(id_entrega);
CREATE INDEX idx_conf_docente             ON configuraciones_docente(id_docente);
CREATE INDEX idx_rec_conf                 ON recursos_generados(id_conf);
CREATE INDEX idx_interacciones_estudiante ON interacciones_ia(id_estudiante);
CREATE INDEX idx_plan_guiado_act_est ON plan_guiado(id_actividad, id_estudiante);
CREATE INDEX idx_pasos_plan_plan_orden ON pasos_plan(id_plan, orden);
CREATE INDEX idx_retos_paso ON micro_retros(id_paso);
CREATE INDEX idx_respuestas_estudiante ON respuestas_estudiante(id_estudiante, creado_en);

-- ============================================================================
-- Función helper: iniciar plan guiado para un estudiante en una actividad
-- ============================================================================
CREATE OR REPLACE FUNCTION iniciar_plan_guiado(p_id_actividad UUID, p_id_estudiante UUID,
                                               p_estilo VARCHAR DEFAULT NULL)
RETURNS UUID LANGUAGE plpgsql AS $$
DECLARE v_plan UUID;
BEGIN
  INSERT INTO plan_guiado(id_actividad, id_estudiante, estilo_aprendizaje)
  VALUES (p_id_actividad, p_id_estudiante, p_estilo)
  RETURNING id_plan INTO v_plan;

  -- Paso 1 (esquema inicial)
  INSERT INTO pasos_plan(id_plan, orden, tipo, contenido)
  VALUES (v_plan, 1, 'esquema', jsonb_build_object(
    'titulo','Esquema inicial',
    'secciones', jsonb_build_array('Introducción','Ideas clave','Ejemplos','Cierre')
  ));

  -- Paso 2 (tareas adaptadas)
  INSERT INTO pasos_plan(id_plan, orden, tipo, contenido)
  VALUES (v_plan, 2, 'tarea', jsonb_build_object(
    'titulo','Tareas adaptadas',
    'checklist', jsonb_build_array(
      'Define el objetivo en tus palabras',
      'Lista 3 conceptos previos',
      'Formula 2 preguntas que tengas'
    )
  ));

  -- Paso 3 (primera pregunta socrática)
  INSERT INTO pasos_plan(id_plan, orden, tipo, contenido)
  VALUES (v_plan, 3, 'pregunta', jsonb_build_object(
    'texto','¿Qué evidencia necesitarías para explicar este tema a un compañero?'
  ));

  RETURN v_plan;
END $$;

-- ============================================================================
-- Datos de ejemplo para testing
-- ============================================================================

-- Insertar estilos de aprendizaje
INSERT INTO estilos_aprendizaje (nombre, descripcion) VALUES
('visual', 'Aprende mejor con imágenes, diagramas y representaciones visuales'),
('auditory', 'Aprende mejor escuchando y participando en discusiones'),
('reading', 'Aprende mejor leyendo y escribiendo'),
('kinesthetic', 'Aprende mejor con actividades prácticas y manipulativas');

-- Insertar institución de ejemplo
INSERT INTO instituciones (nombre, departamento, ciudad, direccion, nit) VALUES
('Colegio MentorIA Demo', 'Cundinamarca', 'Bogotá', 'Calle 123 #45-67', '900123456-7');

-- Insertar docente de ejemplo
INSERT INTO docentes (id_institucion, nombres, apellidos, tipo_documento, numero_documento, correo, celular, area, regimen_contratacion) 
SELECT id_institucion, 'María', 'González', 'CC', '12345678', 'maria.gonzalez@colegio.edu', '3001234567', 'Ciencias Sociales', 'Nombramiento'
FROM instituciones WHERE nombre = 'Colegio MentorIA Demo';

-- Insertar estudiantes de ejemplo
INSERT INTO estudiantes (id_institucion, nombres, apellidos, tipo_documento, numero_documento, correo, celular, fecha_nacimiento, estrato, departamento, ciudad, barrio, consentimiento_habeas)
SELECT id_institucion, 'Ana', 'Rodríguez', 'CC', '87654321', 'ana.rodriguez@estudiante.edu', '3007654321', '2005-03-15', 3, 'Cundinamarca', 'Bogotá', 'Chapinero', true
FROM instituciones WHERE nombre = 'Colegio MentorIA Demo';

INSERT INTO estudiantes (id_institucion, nombres, apellidos, tipo_documento, numero_documento, correo, celular, fecha_nacimiento, estrato, departamento, ciudad, barrio, consentimiento_habeas)
SELECT id_institucion, 'Luis', 'Martínez', 'CC', '11223344', 'luis.martinez@estudiante.edu', '3001122334', '2005-07-22', 2, 'Cundinamarca', 'Bogotá', 'Usaquén', true
FROM instituciones WHERE nombre = 'Colegio MentorIA Demo';

-- Insertar curso de ejemplo
INSERT INTO cursos (id_institucion, nombre, area, grado, jornada)
SELECT id_institucion, 'Historia 10°', 'Ciencias Sociales', '10°', 'Mañana'
FROM instituciones WHERE nombre = 'Colegio MentorIA Demo';

-- Insertar clase de ejemplo
INSERT INTO clases (id_curso, id_docente, periodo, fecha_inicio, fecha_fin)
SELECT c.id_curso, d.id_docente, '2024-1', '2024-01-15', '2024-06-15'
FROM cursos c, docentes d, instituciones i
WHERE c.nombre = 'Historia 10°' AND d.nombres = 'María' AND i.nombre = 'Colegio MentorIA Demo';

-- Insertar actividad de ejemplo
INSERT INTO actividades (id_clase, titulo, objetivo, nivel_taxonomia, tipo_recurso, complejidad)
SELECT cl.id_clase, 'Análisis del cambio climático', 'Desarrollar pensamiento crítico sobre causas y consecuencias del cambio climático', 'analizar', 'mixto', 'media'
FROM clases cl, cursos c, instituciones i
WHERE c.nombre = 'Historia 10°' AND i.nombre = 'Colegio MentorIA Demo';

-- Insertar perfiles de aprendizaje
INSERT INTO perfil_aprendizaje_estudiante (id_estudiante, id_estilo_principal, fortalezas, debilidades)
SELECT e.id_estudiante, es.id_estilo, 'Buena síntesis visual', 'Dificultad con textos largos'
FROM estudiantes e, estilos_aprendizaje es
WHERE e.nombres = 'Ana' AND es.nombre = 'visual';

INSERT INTO perfil_aprendizaje_estudiante (id_estudiante, id_estilo_principal, fortalezas, debilidades)
SELECT e.id_estudiante, es.id_estilo, 'Excelente en debates', 'Dificultad con escritura'
FROM estudiantes e, estilos_aprendizaje es
WHERE e.nombres = 'Luis' AND es.nombre = 'auditory';

-- ============================================================================
-- Mensaje de confirmación
-- ============================================================================
SELECT 'Base de datos MentorIA configurada exitosamente!' as mensaje;
