const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan variables de entorno de Supabase');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createProjectTables() {
  console.log('🚀 Creando tablas del sistema de proyectos...');

  try {
    // Crear tabla projects
    console.log('📝 Creando tabla projects...');
    const { error: projectsError } = await supabase.rpc('create_projects_table');
    if (projectsError) {
      console.log('ℹ️ Tabla projects ya existe o error:', projectsError.message);
    } else {
      console.log('✅ Tabla projects creada');
    }

    // Crear tabla project_sections
    console.log('📝 Creando tabla project_sections...');
    const { error: sectionsError } = await supabase.rpc('create_project_sections_table');
    if (sectionsError) {
      console.log('ℹ️ Tabla project_sections ya existe o error:', sectionsError.message);
    } else {
      console.log('✅ Tabla project_sections creada');
    }

    // Crear tabla project_elements
    console.log('📝 Creando tabla project_elements...');
    const { error: elementsError } = await supabase.rpc('create_project_elements_table');
    if (elementsError) {
      console.log('ℹ️ Tabla project_elements ya existe o error:', elementsError.message);
    } else {
      console.log('✅ Tabla project_elements creada');
    }

    // Insertar datos iniciales
    console.log('📝 Insertando datos iniciales...');
    
    // Insertar categorías
    const categories = [
      { name: 'UX/UI Design', slug: 'ux-ui-design', description: 'Diseño de experiencia de usuario e interfaz', color: '#6366f1', icon: 'palette', order_index: 1 },
      { name: 'Web Development', slug: 'web-development', description: 'Desarrollo de aplicaciones web', color: '#10b981', icon: 'code', order_index: 2 },
      { name: 'Mobile App', slug: 'mobile-app', description: 'Aplicaciones móviles', color: '#f59e0b', icon: 'smartphone', order_index: 3 },
      { name: 'Branding', slug: 'branding', description: 'Identidad visual y marca', color: '#ef4444', icon: 'star', order_index: 4 },
      { name: 'E-commerce', slug: 'e-commerce', description: 'Tiendas online y comercio electrónico', color: '#8b5cf6', icon: 'shopping-cart', order_index: 5 },
      { name: 'Dashboard', slug: 'dashboard', description: 'Paneles de control y analytics', color: '#06b6d4', icon: 'bar-chart', order_index: 6 }
    ];

    for (const category of categories) {
      const { error } = await supabase
        .from('project_categories')
        .upsert(category, { onConflict: 'slug' });
      
      if (error) {
        console.log(`ℹ️ Categoría ${category.name} ya existe o error:`, error.message);
      } else {
        console.log(`✅ Categoría ${category.name} insertada`);
      }
    }

    // Insertar tags
    const tags = [
      { name: 'React', slug: 'react', color: '#61dafb' },
      { name: 'Next.js', slug: 'nextjs', color: '#000000' },
      { name: 'TypeScript', slug: 'typescript', color: '#3178c6' },
      { name: 'Tailwind CSS', slug: 'tailwind-css', color: '#06b6d4' },
      { name: 'Figma', slug: 'figma', color: '#f24e1e' },
      { name: 'Adobe XD', slug: 'adobe-xd', color: '#ff61f6' },
      { name: 'Node.js', slug: 'nodejs', color: '#339933' },
      { name: 'MongoDB', slug: 'mongodb', color: '#47a248' },
      { name: 'PostgreSQL', slug: 'postgresql', color: '#336791' },
      { name: 'Supabase', slug: 'supabase', color: '#3ecf8e' }
    ];

    for (const tag of tags) {
      const { error } = await supabase
        .from('project_tags')
        .upsert(tag, { onConflict: 'slug' });
      
      if (error) {
        console.log(`ℹ️ Tag ${tag.name} ya existe o error:`, error.message);
      } else {
        console.log(`✅ Tag ${tag.name} insertado`);
      }
    }

    console.log('🎉 Sistema de proyectos configurado exitosamente!');

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

createProjectTables();
