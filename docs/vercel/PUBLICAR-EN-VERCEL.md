# Publicar PClass en Vercel — sin Terminal

Esta guía crea una dirección pública para revisar PClass desde cualquier
navegador. El repositorio puede permanecer privado en GitHub.

## Antes de comenzar

- Confirma que GitHub tenga la última versión del ZIP entregado.
- Ten abierta tu cuenta de GitHub.
- Ten a la mano únicamente `NEXT_PUBLIC_SUPABASE_URL` y
  `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- No uses la contraseña de la base, `Secret key` ni `service_role`.

## 1. Importar el repositorio

1. Abre <https://vercel.com>.
2. Pulsa **Sign Up** o **Log In** y elige continuar con GitHub.
3. Autoriza a Vercel para acceder al repositorio privado cuando lo solicite.
4. En el panel de Vercel pulsa **Add New > Project**.
5. Busca `onlyOne-Pclass`.
6. Pulsa **Import** junto a ese repositorio.

## 2. Revisar la configuración

Antes de publicar, comprueba:

- **Framework Preset:** Next.js.
- **Root Directory:** `./` o vacío.
- **Build Command:** `npm run build:vercel`.
- **Output Directory:** déjalo vacío; no escribas `dist`, `out` ni `.next`.
- **Install Command:** déjalo en automático.

El archivo `vercel.json` del proyecto establece estas opciones. No agregues
comandos diferentes.

## 3. Añadir las variables públicas

Abre **Environment Variables** y agrega una fila por cada valor:

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Clave que empieza con `sb_publishable_` |

Para ambas variables, selecciona **Production**, **Preview** y **Development**
si Vercel muestra esas casillas.

No agregues `SUPABASE_SECRET_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, la contraseña de
la base ni una cadena de conexión.

## 4. Crear la primera publicación

1. Pulsa **Deploy**.
2. No cierres la ventana mientras aparezca **Building**.
3. El resultado correcto muestra **Congratulations** o **Ready**.
4. Pulsa **Continue to Dashboard**.
5. Copia la dirección que termina en `.vercel.app`.

Si aparece un error, no cambies configuraciones al azar. Copia el mensaje
visible —sin variables ni credenciales— y solicita asistencia.

## 5. Autorizar la dirección en Supabase

Reemplaza `TU-DIRECCION.vercel.app` por la dirección exacta obtenida:

1. Abre **Supabase > Authentication > URL Configuration**.
2. En **Site URL** guarda:
   `https://TU-DIRECCION.vercel.app/control-room/set-password`.
3. En **Redirect URLs** agrega:
   `https://TU-DIRECCION.vercel.app/auth/callback`.
4. Agrega también:
   `https://TU-DIRECCION.vercel.app/control-room`.
5. Agrega finalmente:
   `https://TU-DIRECCION.vercel.app/control-room/set-password`.
6. Conserva temporalmente las direcciones anteriores hasta terminar la prueba.

## 6. Verificación mínima

1. Abre la dirección `.vercel.app` en una ventana privada.
2. Confirma que aparezca la entrada Experience OnlyOne sin pedir ChatGPT.
3. Abre `/control-room/login` y confirma que los campos estén habilitados.
4. No envíes invitaciones hasta asignar los roles indicados en la guía de
   Supabase.

Cada cambio confirmado posteriormente en la rama principal de GitHub provocará
una nueva publicación automática en Vercel.
