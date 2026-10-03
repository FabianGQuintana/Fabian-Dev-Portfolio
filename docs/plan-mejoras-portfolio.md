# 🚀 Plan de Mejoras — Fabian Dev Portfolio

> Análisis hecho como desarrollador Senior tras revisar toda la base de código.
> Prioridades ordenadas por impacto visual + profesional.

---

## 🔴 Prioridad Alta (Impacto inmediato)

### 1. Sección `#about` — Demasiado vacía

**Estado actual:** Solo un título, un párrafo y badges de tecnologías.
**Problema:** Es la segunda cosa que ve el visitante. Una sección tan escueta transmite "todavía no está listo".

**Propuesta:**
- Agregar una foto profesional (o avatar estilizado) a la izquierda con layout de 2 columnas (`grid lg:grid-cols-[auto_1fr]`).
- Expandir el bio con 2-3 párrafos cortos que cuenten tu historia: de dónde venís, por qué elegiste sistemas, qué te apasiona.
- Separar el `techStack` en categorías (Frontend, Backend, Tools) con iconos por tecnología.
- Considerar un pequeño timeline visual o "journey" dentro del about.

**Archivos a tocar:**
- [`about-section.tsx`](file:///c:/Users/Fabian/OneDrive/Escritorio/Professional-Proyects/Portfolio%20Web/Fabian-Dev-Portfolio/src/features/about/components/about-section.tsx)
- [`src/config/about.ts`](file:///c:/Users/Fabian/OneDrive/Escritorio/Professional-Proyects/Portfolio%20Web/Fabian-Dev-Portfolio/src/config/about.ts) (expandir contenido)

---

### 2. Sección `#experience` — Sin contenido real

**Estado actual:** Muestra un mensaje de "Todavía no hay experiencia cargada acá".
**Problema:** Es un **red flag** enorme en un portfolio profesional. Un reclutador que vea esto cierra la pestaña.

**Propuesta:**
- Cargar al menos 2-3 experiencias (pueden ser proyectos académicos, freelance, o contribuciones open source).
- Diseñar una timeline vertical con animaciones de entrada (`RevealOnScroll`).
- Cada entrada debe tener: empresa/proyecto, rol, período, 2-3 bullets de logros, tecnologías usadas.
- Usar la **Skill de Case Studies** (`docs/SKILL.md`) para transformar bullets simples en narrativas de impacto.

**Archivos a tocar:**
- Componentes en `src/features/experience/components/`
- Contenido en `src/config/` o `src/content/`

---

### 3. `siteConfig` — Links vacíos

**Estado actual:** `linkedin: ""` y `email: ""` en [`site.ts`](file:///c:/Users/Fabian/OneDrive/Escritorio/Professional-Proyects/Portfolio%20Web/Fabian-Dev-Portfolio/src/config/site.ts#L33-L34).
**Problema:** El footer y/o secciones de contacto que usen estos valores van a renderizar enlaces rotos o vacíos.

**Propuesta:**
- Completar los links reales (LinkedIn, email profesional).
- Si no querés exponer el email, al menos tener un `mailto:` protegido o redirigir al formulario de contacto.

---

### 4. CV deshabilitado

**Estado actual:** `resume.enabled: false` en [`site.ts`](file:///c:/Users/Fabian/OneDrive/Escritorio/Professional-Proyects/Portfolio%20Web/Fabian-Dev-Portfolio/src/config/site.ts#L44).
**Problema:** El botón "Descargar CV" existe pero no hace nada. Es confuso para el usuario.

**Propuesta:**
- Crear un CV en PDF y colocarlo en `public/cv/`.
- Activar el flag: `enabled: true`.
- Alternativa temporal: ocultar el botón hasta que esté listo, en vez de mostrarlo deshabilitado.

---

## 🟡 Prioridad Media (Pulido profesional)

### 5. Falta sección `#skills` dedicada

**Estado actual:** Las tecnologías están como badges en About, pero no hay una sección `#skills` independiente. Sin embargo, el modelo 3D del hero ahora linka a `#about` para "Skills & Tecnologías".
**Problema:** No hay un ancla `#skills` real. El link del hero no lleva a ningún lado específico.

**Propuesta:**
- Crear un feature `src/features/skills/` con una `SkillsSection` dedicada.
- Mostrar las tecnologías agrupadas por dominio (Frontend, Backend, DevOps, DB) con íconos y niveles de competencia.
- Agregar el `id="skills"` en esa sección.
- Alternativa mínima: agregar `id="skills"` al bloque de badges dentro de About.

---

### 6. Falta sección `#education`

**Estado actual:** El modelo 3D linka a `#education` pero esa sección no existe en [`page.tsx`](file:///c:/Users/Fabian/OneDrive/Escritorio/Professional-Proyects/Portfolio%20Web/Fabian-Dev-Portfolio/src/app/%5Blocale%5D/page.tsx).
**Problema:** Click en "Analista en Sistemas" → no pasa nada.

**Propuesta:**
- Crear `src/features/education/` con una sección que muestre tu formación académica.
- Timeline con: institución, carrera, período, materias/logros destacados.
- O bien, integrar educación dentro de la sección Experience como un bloque diferenciado.

---

### 7. Imágenes de proyectos

**Estado actual:** Las project cards no tienen screenshots ni previews visuales.
**Problema:** Una tarjeta solo con texto es genérica. Un screenshot le da identidad visual al proyecto inmediatamente.

**Propuesta:**
- Agregar un campo `thumbnail` al modelo de datos de los proyectos.
- Renderizar una imagen (con `next/image`) en la parte superior de cada `ProjectCard`.
- Usar screenshots reales o mockups de cada proyecto.

---

### 8. Mejorar la `ContactSection`

**Propuesta:**
- Agregar información de contacto alternativa junto al formulario (email, LinkedIn, GitHub).
- Mostrar un mapa o zona horaria para dar contexto geográfico.
- Agregar indicadores de disponibilidad ("Disponible para freelance", "Buscando empleo", etc.).

---

## 🟢 Prioridad Baja (Nice-to-haves)

### 9. Animación de carga inicial (Splash)

**Propuesta:**
- Un splash screen breve (1-2s) con el logo/nombre animándose antes de mostrar el contenido.
- Usa `motion/react` para una entrada premium con el nombre desvanecíendose letra por letra.

---

### 10. Dark/Light mode toggle

**Estado actual:** El sistema está hardcodeado a dark mode.
**Propuesta:**
- Agregar un toggle en el header.
- Definir los colores de light mode como una segunda capa de variables CSS.
- Opcional: si el dark mode ES la identidad del sitio, dejarlo así pero documentar la decisión.

---

### 11. Blog / Writing section

**Propuesta:**
- Si escribís artículos técnicos, agregar un blog con MDX.
- Posiciona como thought leader y mejora SEO drásticamente.
- Next.js + MDX es trivial de configurar.

---

### 12. Analytics & Performance

**Estado actual:** Ya tenés `@vercel/analytics` y `@vercel/speed-insights` instalados. ✅
**Propuesta:**
- Verificar que estén correctamente inicializados en el layout.
- Agregar eventos custom para trackear: clics en proyectos, envíos de formulario, descargas de CV.

---

### 13. Testing

**Estado actual:** No hay tests.
**Propuesta:**
- Agregar al menos tests de integración para el formulario de contacto (validación Zod).
- Tests de accesibilidad con `@testing-library` + `jest-axe`.
- Tests E2E con Playwright para los flujos críticos (navegación, contacto).

---

### 14. PWA / Offline support

**Estado actual:** Ya existe [`manifest.ts`](file:///c:/Users/Fabian/OneDrive/Escritorio/Professional-Proyects/Portfolio%20Web/Fabian-Dev-Portfolio/src/app/manifest.ts). ✅
**Propuesta:**
- Agregar un service worker para cache offline básico.
- Hace que tu portfolio sea instalable como app, lo cual impresiona en entrevistas.

---

## 📋 Resumen de prioridades

| # | Mejora | Impacto | Esfuerzo | Prioridad |
|---|--------|---------|----------|-----------|
| 1 | Expandir About | 🔥🔥🔥 | Medio | 🔴 Alta |
| 2 | Cargar Experiencia | 🔥🔥🔥 | Medio | 🔴 Alta |
| 3 | Completar links sociales | 🔥🔥 | Bajo | 🔴 Alta |
| 4 | Activar CV | 🔥🔥 | Bajo | 🔴 Alta |
| 5 | Sección Skills dedicada | 🔥🔥 | Medio | 🟡 Media |
| 6 | Sección Education | 🔥🔥 | Medio | 🟡 Media |
| 7 | Screenshots en proyectos | 🔥🔥 | Medio | 🟡 Media |
| 8 | Mejorar Contact | 🔥 | Bajo | 🟡 Media |
| 9 | Splash screen | 🔥 | Bajo | 🟢 Baja |
| 10 | Light mode | 🔥 | Alto | 🟢 Baja |
| 11 | Blog | 🔥 | Alto | 🟢 Baja |
| 12 | Analytics custom events | 🔥 | Bajo | 🟢 Baja |
| 13 | Testing | 🔥 | Alto | 🟢 Baja |
| 14 | PWA | 🔥 | Medio | 🟢 Baja |

---

> **Recomendación:** Atacar los puntos 1-4 primero. Un portfolio con secciones vacías o links rotos genera más daño que no tener portfolio. Una vez que About, Experience y los datos básicos estén completos, el sitio ya es presentable profesionalmente.
