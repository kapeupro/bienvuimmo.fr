#!/bin/bash

# Script de déploiement automatisé pour o2switch
# Usage: ./deploy.sh

set -e

echo "🚀 Déploiement BienVuImmo sur o2switch"
echo "========================================"

# Variables (à personnaliser)
SSH_USER="votre_user"
SSH_HOST="votre-domaine.fr"
REMOTE_PATH="/home/votre_user/public_html"
LOCAL_PATH="."

echo ""
echo "📦 1. Build de l'application..."
npm install
npm run build

echo ""
echo "🔄 2. Génération du client Prisma..."
cp prisma/schema.mysql.prisma prisma/schema.prisma
npx prisma generate

echo ""
echo "📤 3. Transfert des fichiers vers o2switch..."
rsync -avz --delete \
  --exclude 'node_modules' \
  --exclude '.git' \
  --exclude '.env' \
  --exclude '.env.local' \
  --exclude 'tmp' \
  --exclude '*.log' \
  .next/ $SSH_USER@$SSH_HOST:$REMOTE_PATH/.next/

rsync -avz \
  prisma/ \
  public/ \
  src/ \
  .env.production \
  server.js \
  .htaccess \
  next.config.js \
  package.json \
  package-lock.json \
  tsconfig.json \
  tailwind.config.js \
  postcss.config.js \
  $SSH_USER@$SSH_HOST:$REMOTE_PATH/

echo ""
echo "🔧 4. Installation sur le serveur..."
ssh $SSH_USER@$SSH_HOST << 'ENDSSH'
cd $REMOTE_PATH

# Renommer .env.production en .env
mv .env.production .env

# Installer les dépendances
npm install --production

# Exécuter les migrations Prisma
npx prisma migrate deploy

# Générer le client Prisma
npx prisma generate

# Redémarrer l'application
mkdir -p tmp
touch tmp/restart.txt

echo "✅ Déploiement terminé sur le serveur"
ENDSSH

echo ""
echo "✅ Déploiement terminé avec succès!"
echo "🌐 Votre site est accessible sur : https://$SSH_HOST"
echo ""
echo "📝 Vérifications recommandées :"
echo "   - Tester l'accès au site"
echo "   - Vérifier les logs : ssh $SSH_USER@$SSH_HOST 'tail -f logs/app.log'"
echo "   - Tester la connexion à la base de données"
