# PClass — Experience OnlyOne

Plataforma mobile-first de Personal Class para el evento **Solucionario UNCP
2026-II**.

Este repositorio está en construcción por bloques. La versión actual incorpora
el **BLOQUE 2: Supabase, autenticación administrativa, roles y RLS**. La
infraestructura está lista, pero no almacenará datos reales hasta conectarla a
un proyecto Supabase del propietario.

## Qué puede revisarse en esta versión

- Entrada Experience OnlyOne.
- Navegación móvil y de escritorio.
- Rutas de Live, Chat, Solucionario, Registro, Recursos, Resultados, Orientación y Mi PClass.
- Estructura operativa inicial del Control Room.
- Logotipo oficial de Personal Class Academia.
- Identidad PClass con tipografía Overlock autoalojada y colores aprobados.
- Composición realineada con los mockups definitivos entregados.
- Segundo evento preparado a nivel de rutas; la configuración persistente se
  realizará desde las tablas multievento incluidas.
- Inicio y cierre de sesión reales para el Control Room.
- Invitaciones administrativas compatibles con la plantilla predeterminada de
  Supabase, sin SMTP adicional, y creación segura de contraseña.
- Cinco roles operativos con permisos aplicados en la base de datos.
- Historial académico inmutable y publicación pública sin datos del equipo.
- Storage privado para recursos y estructura de planes, promociones y servicios
  futuros sin checkout.

## Rutas principales

| Pantalla | Dirección |
|---|---|
| Entrada | `/` |
| Live | `/uncp-2026-ii/live` |
| Solucionario | `/uncp-2026-ii/solucionario` |
| Registro progresivo | `/uncp-2026-ii/registro` |
| Recursos | `/uncp-2026-ii/recursos` |
| Resultados | `/uncp-2026-ii/resultados` |
| Orientación | `/uncp-2026-ii/orientacion` |
| Mi PClass | `/uncp-2026-ii/mi-pclass` |
| Control Room | `/control-room` |
| Acceso del equipo | `/control-room/login` |
| Crear contraseña desde invitación | `/control-room/set-password` |

## Subir este código a GitHub sin terminal

1. Descarga y descomprime el ZIP entregado con esta versión.
2. Entra a [github.com](https://github.com) e inicia sesión.
3. Pulsa **New repository**.
4. Escribe `pclass-p0` como nombre.
5. Elige **Private**.
6. No marques las opciones para crear README, `.gitignore` o licencia, porque el
   proyecto ya los incluye.
7. Pulsa **Create repository**.
8. En la siguiente pantalla pulsa **uploading an existing file**.
9. Arrastra todas las carpetas y archivos descomprimidos a la ventana.
10. Escribe `BLOQUE 2 - Supabase, acceso y permisos` en el campo del cambio.
11. Pulsa **Commit changes**.

Resultado esperado: GitHub mostrará las carpetas `app`, `components`, `lib`,
`public`, `supabase`, `docs` y `tests`, además de este README.

Para revertir la carga antes de confirmar, cierra la página o pulsa **Cancel
changes**. Después de confirmar, no borres archivos individualmente; usa el
historial de GitHub o solicita asistencia.

## Ejecución local para una persona técnica

Solo si deseas abrir el proyecto fuera de Codex, pega este único comando dentro
de la carpeta descomprimida, en Terminal:

```bash
npm install && npm run dev
```

Resultado esperado: aparecerá una dirección local similar a
`http://localhost:3000`. Ábrela en el navegador.

Para revertirlo, cierra la Terminal y elimina únicamente la carpeta
`node_modules` creada dentro del proyecto. El código no se modifica.

## Publicación final

La publicación oficial seguirá usando **GitHub → Vercel →
live.personalclass.online**, como define el Build Pack. La conexión clic por clic
se completará en el BLOQUE 10, cuando Supabase, permisos, datos, pruebas y
contingencia estén terminados.

Para obtener desde ahora una vista pública de revisión, sigue
[la guía de Vercel sin Terminal](docs/vercel/PUBLICAR-EN-VERCEL.md). El proyecto
incluye una compilación nativa de Next.js para Vercel; GitHub Pages no se usa
porque las sesiones, cookies y rutas administrativas requieren ejecución en el
servidor.

## Seguridad de esta entrega

- No contiene contraseñas ni credenciales.
- No contiene datos personales.
- No muestra métricas, usuarios o respuestas ficticias.
- Phoenix no aparece en la interfaz pública.
- El Control Room exige una sesión y un rol cuando Supabase está conectado.
- Las 27 tablas tienen RLS habilitado.
- Los datos personales no tienen lectura pública.
- Las respuestas confirmadas requieren un validador humano y las publicaciones
  no pueden sobrescribirse ni borrarse silenciosamente.
- El bucket `pclass-assets` es privado y limita tipos y tamaño de archivo.

## Activar Supabase sin Terminal

Sigue [la guía clic por clic](docs/supabase/CONFIGURACION-SUPABASE.md). No envíes
por chat la contraseña de la base, claves secretas ni contraseñas de operadores.

## Verificaciones del BLOQUE 2

- Compilación de producción: aprobada.
- Compilación nativa para Vercel: aprobada.
- Entrada pública: aprobada.
- Rutas públicas/operativas, invitación, contraseña y logout: aprobados.
- Esquema mínimo y estructuras futuras: 27 tablas verificadas.
- RLS: 27 de 27 tablas verificadas.
- Publicación académica segura y sin PII: aprobada.
- Revisión automática: 8 pruebas aprobadas, 0 fallidas.
- Auditoría de dependencias de producción: 0 vulnerabilidades conocidas.
- Aplicación real de la migración y pruebas entre roles: pendientes de que el
  propietario cree el proyecto Supabase.

## Próximo bloque

**Activar y probar Supabase; después, BLOQUE 3 — evento, landing, live y señales
de respaldo.**

Para cerrar el BLOQUE 2 son necesarios un proyecto Supabase y los correos reales
de los cinco operadores. No se deben enviar contraseñas ni claves secretas por
chat.
