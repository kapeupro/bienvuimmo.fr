#!/bin/bash

# Script de vérification pré-déploiement
# Usage: ./check-deployment.sh

echo "🔍 Vérification de la configuration pour le déploiement"
echo "========================================================"
echo ""

ERRORS=0
WARNINGS=0

# Vérifier que nous sommes dans le bon dossier
if [ ! -f "package.json" ]; then
    echo "❌ Erreur : package.json introuvable. Êtes-vous dans le bon dossier ?"
    exit 1
fi

echo "📁 Vérification des fichiers nécessaires..."
echo ""

# Fichiers obligatoires
FILES=(
    "package.json"
    "next.config.js"
    "tsconfig.json"
    "tailwind.config.js"
    "server.js"
    ".htaccess"
    "prisma/schema.mysql.prisma"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file manquant"
        ((ERRORS++))
    fi
done

echo ""
echo "🔐 Vérification de la configuration..."
echo ""

# Vérifier .env.production
if [ -f ".env.production" ]; then
    echo "✅ .env.production trouvé"
    
    # Vérifier les variables essentielles
    if grep -q "DATABASE_URL=" .env.production; then
        if grep -q "mysql://" .env.production; then
            echo "✅ DATABASE_URL configuré pour MySQL"
        else
            echo "⚠️  DATABASE_URL ne semble pas utiliser MySQL"
            ((WARNINGS++))
        fi
    else
        echo "❌ DATABASE_URL non configuré"
        ((ERRORS++))
    fi
    
    if grep -q "NEXTAUTH_SECRET=" .env.production; then
        SECRET=$(grep "NEXTAUTH_SECRET=" .env.production | cut -d'=' -f2 | tr -d '"')
        if [ ${#SECRET} -gt 20 ]; then
            echo "✅ NEXTAUTH_SECRET configuré"
        else
            echo "❌ NEXTAUTH_SECRET trop court ou invalide"
            ((ERRORS++))
        fi
    else
        echo "❌ NEXTAUTH_SECRET non configuré"
        ((ERRORS++))
    fi
    
    if grep -q "NEXT_PUBLIC_SITE_URL=" .env.production; then
        echo "✅ NEXT_PUBLIC_SITE_URL configuré"
    else
        echo "⚠️  NEXT_PUBLIC_SITE_URL non configuré"
        ((WARNINGS++))
    fi
else
    echo "❌ .env.production introuvable"
    echo "   Copiez .env.production.example et configurez-le"
    ((ERRORS++))
fi

echo ""
echo "📦 Vérification des dépendances..."
echo ""

# Vérifier node_modules
if [ -d "node_modules" ]; then
    echo "✅ node_modules présent"
else
    echo "⚠️  node_modules manquant - exécutez 'npm install'"
    ((WARNINGS++))
fi

# Vérifier Prisma
if [ -f "node_modules/.bin/prisma" ]; then
    echo "✅ Prisma installé"
else
    echo "❌ Prisma non installé"
    ((ERRORS++))
fi

echo ""
echo "🏗️  Tentative de build..."
echo ""

# Test de build
if npm run build > /dev/null 2>&1; then
    echo "✅ Build réussi"
    
    # Vérifier que .next existe
    if [ -d ".next" ]; then
        echo "✅ Dossier .next créé"
        SIZE=$(du -sh .next | cut -f1)
        echo "   Taille: $SIZE"
    else
        echo "❌ Dossier .next non créé"
        ((ERRORS++))
    fi
else
    echo "❌ Build échoué - vérifiez les erreurs avec 'npm run build'"
    ((ERRORS++))
fi

echo ""
echo "🔧 Vérification de la configuration Prisma..."
echo ""

# Vérifier le schéma Prisma
if [ -f "prisma/schema.prisma" ]; then
    if grep -q "provider.*mysql" prisma/schema.prisma; then
        echo "✅ Prisma configuré pour MySQL"
    else
        echo "⚠️  Prisma n'est pas configuré pour MySQL"
        echo "   Exécutez: cp prisma/schema.mysql.prisma prisma/schema.prisma"
        ((WARNINGS++))
    fi
else
    echo "⚠️  prisma/schema.prisma manquant"
    ((WARNINGS++))
fi

echo ""
echo "📝 Récapitulatif"
echo "================"
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo "✅ Tout est prêt pour le déploiement ! 🚀"
    echo ""
    echo "Prochaines étapes :"
    echo "1. Modifiez deploy.sh avec vos informations SSH"
    echo "2. Exécutez: ./deploy.sh"
    echo "3. Suivez la checklist dans DEPLOYMENT_CHECKLIST.md"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo "⚠️  $WARNINGS avertissement(s) - Le déploiement peut fonctionner"
    echo ""
    echo "Recommandations :"
    echo "- Corrigez les avertissements avant le déploiement"
    echo "- Consultez DEPLOYMENT.md pour plus de détails"
    exit 0
else
    echo "❌ $ERRORS erreur(s) et $WARNINGS avertissement(s)"
    echo ""
    echo "Veuillez corriger les erreurs avant le déploiement :"
    echo "- Consultez ENV_SETUP.md pour la configuration"
    echo "- Vérifiez que tous les fichiers sont présents"
    echo "- Testez le build localement"
    exit 1
fi
