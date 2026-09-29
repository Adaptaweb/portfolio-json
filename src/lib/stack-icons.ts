// Colour logos in public/stack/ (devicon and simple-icons), each with its brand colour as "r g b"
// for the tile glow. Technologies without an official open logo are listed as text under their
// category instead of getting a made-up icon.
type StackIcon = { file: string; rgb: string }

const ICONS: Record<string, StackIcon> = {
  Python: { file: 'python', rgb: '55 118 171' },
  FastAPI: { file: 'fastapi', rgb: '0 150 136' },
  SQLAlchemy: { file: 'sqlalchemy', rgb: '202 39 39' },
  Pydantic: { file: 'pydantic', rgb: '233 32 99' },
  pytest: { file: 'pytest', rgb: '10 158 220' },
  'Node.js': { file: 'nodejs', rgb: '95 160 78' },
  PHP: { file: 'php', rgb: '119 123 180' },
  Laravel: { file: 'laravel', rgb: '255 45 32' },
  'C#': { file: 'csharp', rgb: '155 79 150' },
  React: { file: 'react', rgb: '97 218 251' },
  TypeScript: { file: 'typescript', rgb: '49 120 198' },
  JavaScript: { file: 'javascript', rgb: '247 223 30' },
  Vite: { file: 'vitejs', rgb: '189 52 254' },
  'Tailwind CSS': { file: 'tailwindcss', rgb: '56 189 248' },
  'shadcn/ui': { file: 'shadcnui', rgb: '255 255 255' },
  'TanStack Table': { file: 'tanstack', rgb: '236 232 209' },
  Astro: { file: 'astro', rgb: '255 93 1' },
  Flutter: { file: 'flutter', rgb: '71 197 251' },
  Dart: { file: 'dart', rgb: '0 180 171' },
  Android: { file: 'android', rgb: '61 220 132' },
  PostgreSQL: { file: 'postgresql', rgb: '65 130 190' },
  MongoDB: { file: 'mongodb', rgb: '71 162 72' },
  MySQL: { file: 'mysql', rgb: '77 163 217' },
  SQLite: { file: 'sqlite', rgb: '15 128 204' },
  Docker: { file: 'docker', rgb: '36 150 237' },
  Nginx: { file: 'nginx', rgb: '0 150 57' },
  k6: { file: 'k6', rgb: '125 100 255' },
  Git: { file: 'git', rgb: '240 80 50' },
  GitHub: { file: 'github', rgb: '255 255 255' },
  Jira: { file: 'jira', rgb: '38 132 255' },
}

export const stackIcon = (name: string) => {
  const icon = ICONS[name]
  return icon ? { src: `/stack/${icon.file}.svg`, rgb: icon.rgb } : undefined
}
