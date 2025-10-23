#!/bin/bash

# MentorIA - Script de Configuración Automática
# Este script configura automáticamente el entorno para MentorIA

echo "🚀 Configurando MentorIA..."

# 1. Copiar variables de entorno
echo "📝 Configurando variables de entorno..."
cp env-configured .env
echo "✅ Variables de entorno configuradas"

# 2. Instalar dependencias
echo "📦 Instalando dependencias..."
npm install
echo "✅ Dependencias instaladas"

# 3. Verificar configuración
echo "🔍 Verificando configuración..."
if [ -f ".env" ]; then
    echo "✅ Archivo .env encontrado"
else
    echo "❌ Error: Archivo .env no encontrado"
    exit 1
fi

if [ -f "package.json" ]; then
    echo "✅ package.json encontrado"
else
    echo "❌ Error: package.json no encontrado"
    exit 1
fi

# 4. Mostrar instrucciones
echo ""
echo "🎯 CONFIGURACIÓN COMPLETADA"
echo "=========================="
echo ""
echo "📋 PRÓXIMOS PASOS:"
echo ""
echo "1. 📊 Configurar Base de Datos Supabase:"
echo "   - Ir a: https://catccvmyffumdnqcymxk.supabase.co"
echo "   - Ir a SQL Editor"
echo "   - Copiar y pegar el contenido de supabase-setup.sql"
echo "   - Ejecutar el script"
echo ""
echo "2. 🤖 Configurar LLM (elegir uno):"
echo "   - AWS Bedrock: Configurar credenciales AWS"
echo "   - OpenAI: Configurar OPENAI_API_KEY en .env"
echo ""
echo "3. 🚀 Ejecutar la aplicación:"
echo "   npm run server    # Terminal 1"
echo "   npm run dev       # Terminal 2"
echo ""
echo "4. 🌐 Abrir en el navegador:"
echo "   http://localhost:3000"
echo ""
echo "✨ ¡MentorIA está listo para usar!"
echo ""
echo "📁 Archivos importantes:"
echo "   - .env (variables de entorno)"
echo "   - supabase-setup.sql (script de base de datos)"
echo "   - server/ (servidor backend)"
echo "   - src/ (frontend React)"
echo ""
echo "🔧 Para más información, consulta:"
echo "   - IMPLEMENTACION-COMPLETA.md"
echo "   - PRUEBAS-BASICAS.md"
echo "   - n8n-workflows.md"
echo ""
echo "🎉 ¡Configuración completada exitosamente!"
