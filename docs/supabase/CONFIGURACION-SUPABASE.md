# Configuración de Supabase — PClass P0

Esta guía activa la base de datos, el acceso del equipo y los permisos del
BLOQUE 2 sin usar Terminal. Reserva aproximadamente una sesión continua y no
compartas por chat contraseñas ni claves secretas.

## Antes de empezar

Necesitas:

- Acceso de propietario a una organización de Supabase.
- Un gestor de contraseñas.
- Los correos reales de Edinson, Jhean Pier, Jhean Piaget, Kimberly y Kevin.
- La carpeta completa del proyecto PClass entregada en el ZIP.

No necesitas crear cuentas para los asistentes del evento: el registro público
usa Nombre + WhatsApp + consentimiento y no usa OTP en P0.

## 1. Crear el proyecto

1. Abre <https://supabase.com/dashboard> e inicia sesión.
2. Pulsa **New project**.
3. Selecciona la organización propietaria de Personal Class.
4. En **Project name** escribe `pclass-p0-production`.
5. En **Database password**, genera una contraseña única con el gestor de
   contraseñas y guárdala allí. No la envíes por correo ni por este chat.
6. Selecciona la región más cercana a los usuarios principales de Perú entre
   las opciones que muestre Supabase.
7. Revisa el plan y cualquier costo antes de confirmar.
8. Pulsa **Create new project** y espera hasta que el panel muestre el proyecto
   como disponible.

Resultado esperado: ves el panel del proyecto sin alertas de creación pendiente.

## 2. Crear las tablas y reglas de seguridad

1. En la barra izquierda abre **SQL Editor**.
2. Pulsa **New query**.
3. En tu computadora abre el archivo
   `supabase/migrations/202608080001_pclass_p0_schema.sql` del proyecto.
4. Selecciona todo su contenido y cópialo.
5. Pégalo completo en la consulta de Supabase.
6. Comprueba que la primera línea diga `begin;` y la última `commit;`.
7. Pulsa **Run** una sola vez.

Resultado esperado: aparece **Success** y no se devuelve ninguna fila. La
transacción evita que quede una instalación parcial si ocurre un error.

Comprobación visual:

1. Abre **Table Editor**.
2. Confirma que aparezcan, entre otras, `events`, `user_profiles`, `user_roles`,
   `questions`, `question_versions`, `question_publications`, `chat_messages`,
   `download_assets`, `audit_logs`, `plans` y `service_orders`.
3. Abre **Storage** y confirma que exista `pclass-assets` marcado como privado.
4. Abre **Database > Replication** y comprueba que
   `question_publications` figure en `supabase_realtime`.

Si aparece un error, no vuelvas a pulsar Run. Copia únicamente el texto del
error —sin claves ni contraseñas— y envíalo para corregirlo. Al estar dentro de
una transacción, un error revierte la ejecución incompleta.

## 3. Copiar solo las claves correctas

1. Pulsa **Connect** en la parte superior del proyecto. Si no aparece, abre
   **Settings > API Keys**.
2. Copia **Project URL**.
3. Copia **Publishable key**, que normalmente empieza con `sb_publishable_`.
4. No copies ni compartas **Secret key** o `service_role` por chat.
5. En la carpeta PClass duplica `.env.example` y renombra la copia como
   `.env.local`.
6. Abre `.env.local` con un editor de texto y completa únicamente:

   ```text
   NEXT_PUBLIC_SUPABASE_URL=PEGA_AQUÍ_PROJECT_URL
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=PEGA_AQUÍ_PUBLISHABLE_KEY
   ```

7. Guarda el archivo. `.env.local` ya está excluido de Git y del ZIP.

La clave publicable identifica a la aplicación, pero los permisos reales los
aplica RLS. Una clave secreta omite RLS y por eso nunca debe estar en una
variable que comience con `NEXT_PUBLIC_`.

## 4. Preparar el acceso administrativo

Antes de enviar invitaciones, configura la dirección a la que volverán los
usuarios:

1. Abre **Authentication > URL Configuration**.
2. En **Site URL** pega la URL HTTPS pública de PClass, sin `/` al final. Cuando
   se publique el dominio final será `https://live.personalclass.online`.
3. En **Redirect URLs** añade la URL completa terminada en `/auth/callback`.
4. Añade también la URL completa terminada en `/control-room`.
5. Guarda los cambios.

Configura ahora el enlace seguro del correo de invitación:

1. Abre **Authentication > Email Templates**.
2. Selecciona **Invite user**.
3. Conserva el asunto que prefieras y reemplaza el contenido por:

   ```html
   <h2>Invitación al Control Room de PClass</h2>
   <p>Personal Class te ha autorizado como integrante del equipo.</p>
   <p>
     <a href="{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=invite">
       Aceptar invitación y crear contraseña
     </a>
   </p>
   ```

4. Pulsa **Save changes**.

Este enlace entrega a PClass un token de un solo uso. La aplicación lo valida
en el servidor, elimina el token de la dirección visible y recién entonces
abre la pantalla para crear la contraseña.

Luego invita a cada operador:

1. Abre **Authentication > Users**.
2. Pulsa **Add user** y elige **Send invitation**.
3. Introduce el correo real del operador.
4. Pulsa **Invite user**.
5. Repite para los cinco operadores.
6. Cada persona debe abrir su correo, aceptar la invitación y crear su propia
   contraseña de al menos 12 caracteres. Nadie debe comunicar esa contraseña a
   otra persona. Si el enlace vence, envía una invitación nueva.

Finalmente abre el proveedor **Email** dentro de Authentication y desactiva el
registro público de nuevos usuarios. Las invitaciones administrativas deben ser
la única vía de alta del Control Room.

## 5. Asignar los roles reales

Haz este paso únicamente cuando las cinco invitaciones ya aparezcan en
**Authentication > Users**.

1. Vuelve a **SQL Editor**.
2. Pulsa **New query**.
3. Copia la consulta siguiente.
4. Reemplaza `CORREO_REAL` por el correo exacto de Edinson.
5. Pulsa **Run**.

```sql
insert into public.user_roles (user_id, event_id, role, can_validate, notes)
select id, null, 'director', false, 'Edinson'
from auth.users
where lower(email) = lower('CORREO_REAL');
```

Resultado esperado: **Success. 1 row affected**. Si indica 0 filas, el correo no
coincide o la invitación aún no creó el usuario.

Repite la misma consulta cambiando únicamente nombre, rol y `can_validate`:

| Persona | role | can_validate |
|---|---|---|
| Edinson | `director` | `false` |
| Jhean Pier | `coordinator` | `false` |
| Jhean Piaget | `academic` | `true` |
| Kimberly | `moderator` | `false` |
| Kevin | `technical_admin` | `false` |

No asignes el rol `director` a otra cuenta sin aprobación de Edinson.

## 6. Verificar el acceso

1. Abre una invitación real de prueba.
2. Confirma que aparezca **Invitación confirmada** y crea la contraseña.
3. Confirma que abra `/control-room` y muestre el rol y correo correctos.
4. Pulsa **Salir** y confirma que vuelva a `/control-room/login`.
5. Inicia sesión otra vez con la contraseña recién creada.
6. Prueba una cuenta autenticada sin fila en `user_roles`; debe mostrar **Falta
   asignar un rol** y no debe abrir el panel.

## 7. Verificaciones de seguridad en Supabase

1. Abre **Database > Advisors > Security**.
2. Ejecuta el análisis.
3. Confirma que las tablas públicas del proyecto tengan RLS habilitado.
4. No ignores alertas críticas; guarda una captura o copia el texto para
   revisarlo.
5. En **Storage**, confirma nuevamente que `pclass-assets` siga privado.

Los archivos del evento usarán enlaces firmados temporales. Nunca se publicará
directamente la ruta privada de Storage.

## Reversión segura

- Si SQL muestra un error antes de `commit`, la transacción revierte los cambios.
- Si la instalación terminó correctamente, no borres tablas ni usuarios de forma
  manual. Solicita una migración de reversión revisada.
- Si todavía no existe ningún dato real y decidieras abandonar por completo el
  proyecto, primero exporta cualquier configuración y confirma el alcance antes
  de eliminarlo desde Supabase. La eliminación del proyecto es destructiva.

## Referencias oficiales

- [Usuarios e invitaciones](https://supabase.com/docs/guides/auth/users)
- [Plantillas de correo y verificación en servidor](https://supabase.com/docs/guides/auth/auth-email-templates)
- [Autenticación SSR y cookies](https://supabase.com/docs/guides/auth/server-side)
- [Claves publicables y secretas](https://supabase.com/docs/guides/getting-started/api-keys)
- [Buckets privados](https://supabase.com/docs/guides/storage/buckets/fundamentals)
- [Políticas RLS de Storage](https://supabase.com/docs/guides/storage/security/access-control)
