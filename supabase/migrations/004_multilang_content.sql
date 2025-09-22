-- =====================================================
-- MIGRACIÓN PARA SOPORTE MULTIIDIOMA
-- =====================================================

-- Agregar campo language a todas las tablas de contenido
ALTER TABLE typewriter_texts ADD COLUMN IF NOT EXISTS language VARCHAR(2) DEFAULT 'es';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS language VARCHAR(2) DEFAULT 'es';
ALTER TABLE about_info ADD COLUMN IF NOT EXISTS language VARCHAR(2) DEFAULT 'es';
ALTER TABLE contact_info ADD COLUMN IF NOT EXISTS language VARCHAR(2) DEFAULT 'es';

-- Crear índices para optimizar consultas por idioma
CREATE INDEX IF NOT EXISTS idx_typewriter_texts_language ON typewriter_texts(language);
CREATE INDEX IF NOT EXISTS idx_projects_language ON projects(language);
CREATE INDEX IF NOT EXISTS idx_about_info_language ON about_info(language);
CREATE INDEX IF NOT EXISTS idx_contact_info_language ON contact_info(language);

-- Actualizar registros existentes para que tengan language = 'es'
UPDATE typewriter_texts SET language = 'es' WHERE language IS NULL;
UPDATE projects SET language = 'es' WHERE language IS NULL;
UPDATE about_info SET language = 'es' WHERE language IS NULL;
UPDATE contact_info SET language = 'es' WHERE language IS NULL;

-- Insertar contenido en inglés para los textos del typewriter
INSERT INTO typewriter_texts (text_content, order_index, language) VALUES
  ('Senior UX/UI Designer specialist', 1, 'en'),
  ('Interaction Design', 2, 'en'),
  ('Digital Strategy', 3, 'en'),
  ('AI-Powered Design', 4, 'en');

-- Insertar proyectos en inglés
INSERT INTO projects (title, description, order_index, language) VALUES
  ('UX Research', 'Deep user research to create exceptional and human-centered experiences', 1, 'en'),
  ('UI Design', 'Modern, functional and visually impactful interface design that connects with users', 2, 'en'),
  ('Digital Strategy', 'Comprehensive digital strategy development that transforms brands and products', 3, 'en'),
  ('AI Design', 'Innovative projects that combine artificial intelligence with creative design', 4, 'en');

-- Insertar información personal en inglés
INSERT INTO about_info (title, description, language) VALUES
  ('About me', 'I am a UX/UI designer with over 5 years of experience creating exceptional digital experiences.', 'en');

-- Insertar información de contacto en inglés
INSERT INTO contact_info (contact_type, label, value, icon_name, order_index, language) VALUES
  ('whatsapp', 'WhatsApp', '+54 11 1234-5678', 'whatsapp', 1, 'en'),
  ('linkedin', 'LinkedIn', 'Connect', 'linkedin', 2, 'en'),
  ('location', 'Location', 'Buenos Aires, Argentina', 'location', 3, 'en');

-- Agregar restricción para que language solo pueda ser 'es' o 'en'
ALTER TABLE typewriter_texts ADD CONSTRAINT chk_typewriter_language CHECK (language IN ('es', 'en'));
ALTER TABLE projects ADD CONSTRAINT chk_projects_language CHECK (language IN ('es', 'en'));
ALTER TABLE about_info ADD CONSTRAINT chk_about_language CHECK (language IN ('es', 'en'));
ALTER TABLE contact_info ADD CONSTRAINT chk_contact_language CHECK (language IN ('es', 'en'));

-- Crear índices compuestos para optimizar consultas por idioma y orden
CREATE INDEX IF NOT EXISTS idx_typewriter_lang_order ON typewriter_texts(language, order_index);
CREATE INDEX IF NOT EXISTS idx_projects_lang_order ON projects(language, order_index);
CREATE INDEX IF NOT EXISTS idx_contact_lang_order ON contact_info(language, order_index);
