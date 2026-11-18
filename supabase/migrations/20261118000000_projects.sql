-- Portafolio "Señal": casos de estudio.
-- Cada fila guarda el caso completo y bilingüe en `content` (forma del tipo
-- Project de lib/content/projects/types.ts). El sitio solo lee; escribir
-- requiere la service role (panel de Supabase o un admin futuro).

create table if not exists public.projects (
  slug        text primary key check (slug ~ '^[a-z0-9-]+$'),
  position    integer not null default 0,
  published   boolean not null default true,
  content     jsonb not null check (jsonb_typeof(content) = 'object'),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.projects is 'Casos de estudio del portafolio (contenido bilingüe en JSON).';

create index if not exists projects_published_position_idx
  on public.projects (published, position);

-- updated_at automático
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

-- Seguridad: lectura pública solo de lo publicado; sin escritura pública.
alter table public.projects enable row level security;

drop policy if exists "Lectura pública de proyectos publicados" on public.projects;
create policy "Lectura pública de proyectos publicados"
  on public.projects
  for select
  to anon, authenticated
  using (published);
