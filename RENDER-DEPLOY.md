# Render Deployment Guide

## 🚀 Configuración en Render

### 1. Crear nuevo Web Service

- Conectar repositorio GitHub
- Seleccionar rama `main`

### 2. Configuración del Build

- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run server`
- **Node Version**: 18+

### 3. Variables de Entorno

Configurar en Render Dashboard:

```bash
# Servidor
PORT=4000
NODE_ENV=production

# LLM (Elegir uno)
PROVIDER=bedrock
AWS_REGION=us-east-1
BEDROCK_MODEL_ID=amazon.titan-text-lite-v1

# O OpenAI
# PROVIDER=openai
# OPENAI_API_KEY=sk-your_key

# Supabase
SUPABASE_URL=https://catccvmyffumdnqcymxk.supabase.co
SUPABASE_SERVICE_ROLE=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhdGNjdm15ZmZ1bWRucWN5bXhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwOTcyOTQsImV4cCI6MjA3NjY3MzI5NH0.W0aqtdZizL1Yt1f4aIa0Gb_Fbi9nj2dABAgdso8Ox88

# Frontend
VITE_SUPABASE_URL=https://catccvmyffumdnqcymxk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhdGNjdm15ZmZ1bWRucWN5bXhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwOTcyOTQsImV4cCI6MjA3NjY3MzI5NH0.W0aqtdZizL1Yt1f4aIa0Gb_Fbi9nj2dABAgdso8Ox88
```

### 4. Health Check

- **Health Check Path**: `/api/health`
- **Auto Deploy**: Yes

### 5. Dominio

- Render asignará automáticamente: `https://mentoria-platform.onrender.com`
- Puedes configurar dominio personalizado

## ✅ Verificación Post-Deploy

1. **Health Check**: `https://tu-app.onrender.com/api/health`
2. **Frontend**: `https://tu-app.onrender.com`
3. **API**: `https://tu-app.onrender.com/api/tables`

## 🔧 Troubleshooting

- **Build Error**: Verificar Node.js version (18+)
- **Runtime Error**: Verificar variables de entorno
- **Database Error**: Verificar conexión Supabase
- **LLM Error**: Verificar credenciales AWS/OpenAI
