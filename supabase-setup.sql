-- Script para configurar la base de datos en Supabase
-- Ejecuta este script en el SQL Editor de Supabase

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create profiles table
CREATE TABLE profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    bio TEXT,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    location VARCHAR(255),
    linkedin_url VARCHAR(500),
    github_url VARCHAR(500),
    behance_url VARCHAR(500),
    avatar_url VARCHAR(500),
    cv_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table
CREATE TABLE projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    long_description TEXT,
    image_url VARCHAR(500),
    technologies TEXT[] DEFAULT '{}',
    project_url VARCHAR(500),
    github_url VARCHAR(500),
    behance_url VARCHAR(500),
    featured BOOLEAN DEFAULT FALSE,
    category VARCHAR(50) DEFAULT 'web',
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create experience table
CREATE TABLE experience (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    company VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    current BOOLEAN DEFAULT FALSE,
    location VARCHAR(255),
    achievements TEXT[] DEFAULT '{}',
    technologies TEXT[] DEFAULT '{}',
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create education table
CREATE TABLE education (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    institution VARCHAR(255) NOT NULL,
    degree VARCHAR(255) NOT NULL,
    field VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    current BOOLEAN DEFAULT FALSE,
    location VARCHAR(255),
    achievements TEXT[] DEFAULT '{}',
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create skills table
CREATE TABLE skills (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('design', 'development', 'tools', 'soft')),
    level INTEGER DEFAULT 1 CHECK (level >= 1 AND level <= 5),
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contact_messages table
CREATE TABLE contact_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_users table
CREATE TABLE admin_users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_projects_featured ON projects(featured);
CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_projects_order ON projects(order_index);
CREATE INDEX idx_experience_current ON experience(current);
CREATE INDEX idx_experience_order ON experience(order_index);
CREATE INDEX idx_education_current ON education(current);
CREATE INDEX idx_education_order ON education(order_index);
CREATE INDEX idx_skills_category ON skills(category);
CREATE INDEX idx_skills_order ON skills(order_index);
CREATE INDEX idx_contact_messages_read ON contact_messages(read);
CREATE INDEX idx_contact_messages_created ON contact_messages(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_experience_updated_at BEFORE UPDATE ON experience
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_education_updated_at BEFORE UPDATE ON education
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON skills
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default profile data
INSERT INTO profiles (name, title, bio, email, phone, location, linkedin_url, github_url) VALUES
('Elkin Mac', 'Senior UX/UI Designer', 'Diseñador UX/UI Senior con más de 5 años de experiencia creando experiencias digitales excepcionales. Especializado en diseño centrado en el usuario, investigación UX y desarrollo de productos digitales innovadores.', 'garcia.elkin.salazar@gmail.com', '+54 11 1234-5678', 'Buenos Aires, Argentina', 'https://linkedin.com/in/elkinmac', 'https://github.com/elkinmac');

-- Insert default skills
INSERT INTO skills (name, category, level, order_index) VALUES
('Figma', 'design', 5, 1),
('Adobe XD', 'design', 4, 2),
('Sketch', 'design', 4, 3),
('Adobe Creative Suite', 'design', 4, 4),
('HTML/CSS', 'development', 4, 1),
('JavaScript', 'development', 4, 2),
('React', 'development', 4, 3),
('TypeScript', 'development', 3, 4),
('Git', 'tools', 4, 1),
('Notion', 'tools', 5, 2),
('Slack', 'tools', 5, 3),
('Jira', 'tools', 4, 4),
('Liderazgo', 'soft', 4, 1),
('Comunicación', 'soft', 5, 2),
('Trabajo en Equipo', 'soft', 4, 3),
('Creatividad', 'soft', 5, 4);

-- Insert default experience
INSERT INTO experience (company, position, description, start_date, current, location, achievements, technologies, order_index) VALUES
('TechCorp Solutions', 'Senior UX/UI Designer', 'Lideré el diseño de productos digitales para más de 50 clientes empresariales, mejorando la experiencia de usuario en un 40% y aumentando la conversión en un 25%.', '2022-01-01', true, 'Buenos Aires, Argentina', ARRAY['Diseñé y lanzé 3 productos digitales principales', 'Mentoré a 5 diseñadores junior', 'Implementé sistema de design system', 'Aumenté satisfacción del usuario en 40%'], ARRAY['Figma', 'Adobe XD', 'React', 'Framer'], 1),
('Digital Agency Pro', 'UX/UI Designer', 'Desarrollé interfaces de usuario para aplicaciones móviles y web, trabajando con equipos multidisciplinarios en proyectos de alto impacto.', '2020-03-01', false, 'Buenos Aires, Argentina', ARRAY['Diseñé 20+ aplicaciones móviles', 'Colaboré con 15+ desarrolladores', 'Mejoré tiempo de desarrollo en 30%', 'Gané premio de diseño 2021'], ARRAY['Sketch', 'Principle', 'InVision', 'Zeplin'], 2);

-- Insert default education
INSERT INTO education (institution, degree, field, start_date, end_date, current, location, achievements, order_index) VALUES
('Universidad de Buenos Aires', 'Licenciatura en Diseño Gráfico', 'Diseño Visual', '2015-03-01', '2019-12-15', false, 'Buenos Aires, Argentina', ARRAY['Graduado con honores (9.2/10)', 'Proyecto final destacado', 'Participación en concursos de diseño'], 1),
('Google UX Design Certificate', 'Google UX Design Professional Certificate', 'UX/UI Design', '2021-01-01', '2021-08-31', false, 'Online', ARRAY['Certificación profesional de Google', 'Portfolio de 3 proyectos completos', 'Mentoría de diseñadores senior'], 2);

-- Insert default projects
INSERT INTO projects (title, description, long_description, technologies, featured, category, order_index) VALUES
('E-commerce Mobile App', 'Aplicación móvil completa para e-commerce con diseño centrado en el usuario', 'Desarrollé una aplicación móvil completa para e-commerce que incluye catálogo de productos, carrito de compras, sistema de pagos y seguimiento de pedidos. El diseño se enfoca en la experiencia del usuario con navegación intuitiva y procesos optimizados.', ARRAY['Figma', 'Adobe XD', 'React Native', 'Node.js'], true, 'mobile', 1),
('Dashboard Analytics', 'Dashboard interactivo para análisis de datos empresariales', 'Creé un dashboard completo para análisis de datos empresariales con visualizaciones interactivas, reportes en tiempo real y sistema de alertas. La interfaz permite a los usuarios explorar datos de manera intuitiva.', ARRAY['Figma', 'D3.js', 'React', 'TypeScript'], true, 'web', 2),
('Sistema de Reservas', 'Plataforma web para gestión de reservas y citas', 'Diseñé y desarrollé una plataforma web completa para gestión de reservas que incluye calendario interactivo, notificaciones automáticas y sistema de pagos integrado.', ARRAY['Sketch', 'Vue.js', 'Firebase', 'Stripe'], false, 'web', 3);

-- Create admin user (password: Lineadesangre22)
INSERT INTO admin_users (email, password_hash, name, role) VALUES
('garcia.elkin.salazar@gmail.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Elkin Mac', 'admin');
