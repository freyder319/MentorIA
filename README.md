# MentorIA - Plataforma Educativa con Inteligencia Artificial

Una plataforma web que ayuda a estudiantes y profesores usando inteligencia artificial para crear actividades personalizadas y mejorar el aprendizaje.

## 🎯 ¿Qué hace MentorIA?

**Para Estudiantes:**

- Chatear con un asistente de IA que entiende tu estilo de aprendizaje
- Recibir ayuda personalizada para mejorar tus argumentos
- Obtener actividades adaptadas a cómo aprendes mejor

**Para Profesores:**

- Crear actividades educativas automáticamente con IA
- Ver métricas de progreso de los estudiantes
- Generar contenido adaptado a diferentes estilos de aprendizaje

## 🚀 Cómo usar MentorIA

### Opción 1: Usar la versión en línea (Recomendado)

1. Ve a la URL que te proporcione tu profesor
2. Regístrate como estudiante o profesor
3. ¡Comienza a usar la plataforma!

### Opción 2: Instalar en tu computadora

1. Descarga este proyecto
2. Instala Node.js (versión 18 o superior)
3. Sigue las instrucciones de instalación abajo

## 📋 Instalación paso a paso

### 1. Preparar tu computadora

```bash
# Instalar Node.js desde https://nodejs.org
# Verificar que funciona:
node --version
npm --version
```

### 2. Descargar el proyecto

```bash
# Descargar el código
git clone https://github.com/tu-usuario/mentoria-platform.git
cd mentoria-platform
```

### 3. Instalar dependencias

```bash
npm install
```

### 4. Configurar variables de entorno

Crea un archivo llamado `.env` en la carpeta principal con este contenido:

```bash
# Configuración básica
PORT=4000
NODE_ENV=development

# Base de datos (ya configurada)
SUPABASE_URL=https://catccvmyffumdnqcymxk.supabase.co
SUPABASE_SERVICE_ROLE=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhdGNjdm15ZmZ1bWRucWN5bXhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwOTcyOTQsImV4cCI6MjA3NjY3MzI5NH0.W0aqtdZizL1Yt1f4aIa0Gb_Fbi9nj2dABAgdso8Ox88

# Frontend
VITE_SUPABASE_URL=https://catccvmyffumdnqcymxk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhdGNjdm15ZmZ1bWRucWN5bXhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwOTcyOTQsImV4cCI6MjA3NjY3MzI5NH0.W0aqtdZizL1Yt1f4aIa0Gb_Fbi9nj2dABAgdso8Ox88

# Inteligencia Artificial (OpenAI)

# OpenAI Configuration
PROVIDER=openai
OPENAI_API_KEY=sk-tu_clave_aqui
OPENAI_MODEL=gpt-4o-mini
```

### 5. Ejecutar la aplicación

```bash
# Terminal 1: Servidor backend
npm run server

# Terminal 2: Frontend (en otra ventana de terminal)
npm run dev
```

### 6. Abrir en el navegador

- Ve a: `http://localhost:3000`
- ¡Listo! Ya puedes usar MentorIA

## 🔧 Comandos útiles

```bash
npm run dev      # Iniciar solo el frontend
npm run server   # Iniciar solo el servidor
npm run build    # Crear versión para producción
npm run start    # Iniciar versión de producción
```

## 📁 Estructura del proyecto

```
MentorIA/
├── src/                    # Código del frontend (React)
│   ├── components/         # Componentes de la interfaz
│   ├── pages/             # Páginas de la aplicación
│   └── lib/               # Utilidades y configuraciones
├── server/                # Código del backend (Node.js)
│   ├── index.js           # Servidor principal
│   ├── mcp.js             # Sistema de comunicación entre agentes
│   └── a2a-agent.js       # Agente de análisis de argumentos
├── package.json           # Configuración del proyecto
└── README.md             # Este archivo
```

## 🎮 Cómo usar la plataforma

### Como Estudiante:

1. **Registrarse**: Crea tu cuenta con tu información
2. **Chat con IA**: Haz preguntas sobre tus tareas
3. **Recibir ayuda**: La IA te dará consejos personalizados
4. **Mejorar argumentos**: Recibe feedback sobre tus escritos

### Como Profesor:

1. **Crear actividades**: Usa el generador de actividades con IA
2. **Configurar clases**: Establece objetivos y parámetros
3. **Ver métricas**: Monitorea el progreso de los estudiantes
4. **Personalizar**: Adapta actividades a diferentes estilos de aprendizaje

## 🔍 Características principales

- **🤖 Inteligencia Artificial**: Usa AWS Bedrock o OpenAI para generar contenido
- **📊 Base de Datos**: Supabase para almacenar información de usuarios
- **🎨 Interfaz Moderna**: Diseño limpio y fácil de usar
- **📱 Responsive**: Funciona en computadora, tablet y móvil
- **🔒 Seguro**: Datos protegidos y privacidad garantizada

## 🆘 Solución de problemas

### Error: "Cannot find module"

```bash
npm install
```

### Error: "Port already in use"

```bash
# Cambiar el puerto en .env
PORT=4001
```

### Error: "Database connection failed"

- Verificar que las variables SUPABASE_URL y SUPABASE_SERVICE_ROLE estén correctas

### Error: "AI not responding"

- Verificar que PROVIDER esté configurado correctamente
- Si usas OpenAI, verificar que OPENAI_API_KEY sea válida

## 📞 Soporte

Si tienes problemas:

1. Revisa la sección de solución de problemas arriba
2. Verifica que todas las variables de entorno estén configuradas
3. Asegúrate de tener Node.js versión 18 o superior

## 🚀 Despliegue en producción

Para poner MentorIA en internet (usando Render):

1. Ve a [render.com](https://render.com)
2. Conecta tu repositorio de GitHub
3. Configura las variables de entorno
4. Build Command: `npm install && npm run build`
5. Start Command: `npm run server`

¡Y listo! Tu plataforma estará disponible en internet.

## 📄 Licencia

Este proyecto es educativo y está disponible para uso académico.

---

**¿Necesitas ayuda?** Revisa la documentación o contacta al equipo de desarrollo.
