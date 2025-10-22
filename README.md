
# MentorIA — Plataforma educativa con agentes de IA

MentorIA es un prototipo funcional de plataforma educativa que integra agentes de IA para:

- Asistir a estudiantes con un tutor de pensamiento crítico (modo socrático y modo directo).
- Generar actividades adaptativas para docentes según estilos de aprendizaje y señales de la clase.

Este README explica la arquitectura, cómo ejecutar el proyecto localmente, cómo funcionan los agentes, y cómo personalizar los modelos/prompts.

## Stack y estructura

- **Frontend**: Vite + React (`src/`), UI con componentes Radix/Lucide.
- **Servidor API**: Express (`server/index.js`) con proxy a modelos OpenAI o AWS Bedrock.
- **Proxy local**: Vite reenvía `/api/*` al servidor en `http://localhost:4000` (ver `vite.config.ts`).
- **Integraciones**: Supabase (opcional) para persistencia de actividades y planes guiados; n8n (opcional) como webhook externo para generación.

Estructura relevante:

- `src/components/student-chat.tsx`: Agente Estudiante (tutor IA).
- `src/components/teacher-create.tsx`: Generador de actividades para docentes.
- `server/index.js`: Endpoints `/api/chat`, `/api/activity-agent`, `/api/health`.
- `vite.config.ts`: Proxy de desarrollo `/api -> :4000`.

## Agentes de IA

- **Agente 1: Tutor de Estudiante** (`src/components/student-chat.tsx`)
  - Modos:
    - `coach` (socrático): guía al estudiante con 1–3 preguntas y un micro-plan; evita dar la respuesta final.
    - `direct`: responde de forma breve y directa.
  - Prompt del sistema se construye dinámicamente según el modo (`buildSystemPrompt()`).
  - Heurística local para detectar frases tipo “dame la respuesta” y responder con guía sin llamar al modelo.
  - Llama a `POST /api/chat` con el historial de mensajes. El servidor reenvía a OpenAI o Bedrock.

- **Agente 2: Generador de Actividades** (`src/components/teacher-create.tsx` + `server/index.js`)
  - Recibe parámetros de clase y objetivo y llama a `POST /api/activity-agent`.
  - El servidor puede:
    - Crear una actividad base en Supabase y generar un plan guiado por estudiante vía RPC `iniciar_plan_guiado`.
    - Devolver estadísticas por estilo de aprendizaje y conteos de planes creados.
    - Alternativamente, si `N8N_WEBHOOK_URL` está configurado, delega a un flujo n8n y retorna su respuesta.
  - La UI muestra adaptaciones por **visual/auditory/reading/kinesthetic** y, si no hay planes por estudiante, inyecta ejemplos de muestra.

Notas:

- Existe un archivo alternativo de ejemplo `src/pages/api/activity-agent.ts` que modela una respuesta enriquecida (incluyendo `por_estudiante`) sin depender de Supabase; en Vite no se sirve como API real, está como referencia de contrato/forma de respuesta.

## Ejecución local

1. Instala dependencias

```bash
npm i
```

2. Configura variables de entorno en un archivo `.env` en la raíz del proyecto (ver sección Variables de entorno).

3. Inicia el servidor API (puerto 4000 por defecto)

```bash
npm run server
```

4. En otra terminal, inicia el frontend (puerto 3000)

```bash
npm run dev
```

El frontend usará el proxy definido en `vite.config.ts` para llamar a `/api/*` en el servidor.

## Variables de entorno

Coloca estas claves en `.env` en la raíz del proyecto:

- **Servidor/Modelo**
  - `PROVIDER` = `bedrock` | `openai` (recomendado `bedrock` para Amazon Titan)
  - Si `PROVIDER=bedrock` (Amazon Bedrock):
    - `AWS_REGION` (p.ej. `us-east-1`)
    - `BEDROCK_MODEL_ID` (p.ej. `amazon.titan-text-lite-v1` o `amazon.titan-text-express-v1`)
    - Credenciales AWS vía entorno estándar o perfil local (ver nota más abajo)
  - Si `PROVIDER=openai`:
    - `OPENAI_API_KEY` (requerido)
    - `OPENAI_BASE_URL` (opcional; por defecto `https://api.openai.com/v1`)
    - `OPENAI_MODEL` (por defecto `gpt-4o-mini`)
- **Supabase (opcional, para `/api/activity-agent`)**
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE` (usa solo en servidor; no exponer en cliente)
- **n8n (opcional)**
  - `N8N_WEBHOOK_URL` (si se define, el endpoint delega a este webhook)
- **Servidor**
  - `PORT` (por defecto `4000`)

### Ejemplo de `.env`

Puedes copiar `.env.example` a `.env` y completar tus claves.

- Bedrock (Amazon Titan) recomendado:

```env
PROVIDER=bedrock
AWS_REGION=us-east-1
BEDROCK_MODEL_ID=amazon.titan-text-lite-v1
PORT=4000
```

- OpenAI (opcional):

```env
PROVIDER=openai
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
PORT=4000
```

Nota credenciales AWS: el SDK de AWS toma credenciales desde variables de entorno (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_SESSION_TOKEN`), archivo de perfiles (`~/.aws/credentials`) o rol de instancia. No se incluyen en `.env.example` por seguridad.

## Enrutamiento de modelos (Bedrock)

El endpoint `POST /api/chat` en `server/index.js` decide la forma de invocar Bedrock según `BEDROCK_MODEL_ID`:

- **AI21 (prefijo `ai21.`)**
  - Usa `ConverseCommand` con `messages` estructurados.
- **Amazon Titan (prefijo `amazon.titan-`)**
  - Construye un `inputText` con el historial y usa `InvokeModelCommand` con `textGenerationConfig`.
- **Otros modelos (p.ej. Anthropic en Bedrock)**
  - Usa el esquema tipo Anthropic: `anthropic_version`, `messages` con `{type:'text'}` y `InvokeModelCommand`.

Si `PROVIDER=openai`, se llama al endpoint `chat/completions` estándar de OpenAI.

## Ejemplos cURL

- **Bedrock (Amazon Titan)**

```bash
curl -X POST http://localhost:4000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role":"system","content":"Responde breve en español"},
      {"role":"user","content":"Dame 2 ideas para iniciar un ensayo"}
    ]
  }'
```

- **OpenAI (alternativo)**

```bash
curl -X POST http://localhost:4000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role":"system","content":"Responde breve en español"},
      {"role":"user","content":"Dame 2 ideas para iniciar un ensayo"}
    ]
  }'
```

## Endpoints principales

- `GET /api/health`
  - Estado del servidor y modelo activo.
- `POST /api/chat`
  - Cuerpo: `{ messages: Array<{role: 'system'|'user'|'assistant', content: string}> }`
  - Respuesta: `{ content: string }` (texto del asistente)
  - Implementación: `server/index.js`, compatible con OpenAI o AWS Bedrock.
- `POST /api/activity-agent`
  - Cuerpo mínimo: `{ id_clase, titulo, objetivo, nivel_taxonomia, tipo_recurso, complejidad, contexto? }`
  - Comportamiento:
    - Si `N8N_WEBHOOK_URL` está definido: reenvía la petición y retorna su JSON.
    - Si hay Supabase: crea actividad, obtiene estudiantes, inicializa planes guiados por RPC y devuelve estadísticas.
  - Respuesta típica: `{ activity, stats, por_estilo }` y, si el flujo externo lo aporta, también `por_estudiante`.

- `POST /api/insights`
  - Stub implementado para recibir señales del chat del estudiante.
  - Cuerpo: libre (JSON). Respuesta: `{ ok: true, received: <payload> }`.
  - Implementación: `server/index.js`. Pensado para conectar analítica más adelante.

Nota: El componente `student-chat.tsx` envía señales a `/api/insights`; este endpoint ya está implementado como stub y responde 200 con eco del payload.

## Personalización de modelos y prompts

- Edita el modelo y proveedor vía `.env`:
  - `PROVIDER=openai|bedrock`, `OPENAI_MODEL`, `BEDROCK_MODEL_ID`.
- Ajusta el prompt del tutor en `src/components/student-chat.tsx` dentro de `buildSystemPrompt()`.
- Ajusta adaptaciones por estilo en `src/components/teacher-create.tsx` (objeto `defaultAdaptations`).

## Desarrollo y pruebas

- El proxy de Vite está configurado en `vite.config.ts` para que `/api/*` apunte a `http://localhost:4000`.
- Scripts (`package.json`):
  - `npm run dev`: frontend Vite en `:3000`.
  - `npm run server`: servidor Express en `:4000`.

## Troubleshooting (Windows)

- **Variables de entorno**: usa un archivo `.env` en la raíz; `server/index.js` lo carga con `dotenv` (ruta fija).
- **Credenciales AWS**: si usas PowerShell, puedes definirlas con `$Env:AWS_ACCESS_KEY_ID="..."` etc., o configurar `~/.aws/credentials` con AWS CLI.
- **Conflicto de puertos**: si `3000` o `4000` están ocupados, cambia `PORT` en `.env` para el servidor y el `server.port` en `vite.config.ts` para el frontend.
- **CORS/Proxy**: el proxy de Vite ya envía `/api/*` a `http://localhost:4000`. Asegúrate de arrancar primero el servidor.

## Buenas prácticas y seguridad

- **No commitees** `.env` ni credenciales. Usa `.env.example` como plantilla.
- **Claves de servidor**: `SUPABASE_SERVICE_ROLE` solo debe vivir del lado servidor, nunca en cliente.
- **Logs**: no imprimas claves en consola. El servidor ya oculta detalles y devuelve errores genéricos al cliente.

## Roadmap sugerido

- **Implementar `/api/insights`** y un pequeño repositorio en `src/server/` para almacenar señales del chat del estudiante.
- **Unificar contrato** de `/api/activity-agent` para siempre incluir `por_estudiante` (ya sea desde Supabase o flujo n8n).
- **Añadir autenticación** básica para separar roles estudiante/docente.
- **Agregar tests** de integración para `/api/chat` y `/api/activity-agent`.
- **Documentar esquema Supabase** (tablas `actividades`, `clase_estudiante`, `perfil_aprendizaje_estudiante`, `estilos_aprendizaje`, RPC `iniciar_plan_guiado`).

## Créditos

- UI basada en componentes Radix/Lucide.
- Inspiración visual del proyecto “Educational Platform Mockups”.

