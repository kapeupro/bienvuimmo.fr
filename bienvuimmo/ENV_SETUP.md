# Guide de configuration des variables d'environnement

> 📋 Ce guide explique comment configurer toutes les variables d'environnement nécessaires pour déployer BienVuImmo sur o2switch.

## ⚠️ Important : Sécurité

- Le fichier `.env` ne doit **JAMAIS** être commité dans Git
- Sur le serveur, ce fichier doit avoir les permissions `600` : `chmod 600 .env`
- Ne partagez jamais vos credentials (DATABASE_URL, secrets, API keys)
- Utilisez un gestionnaire de mots de passe pour stocker ces informations

---

## Variables obligatoires pour la production

### 1. Base de données MySQL (o2switch)

```env
DATABASE_URL="mysql://[USER]:[PASSWORD]@[HOST]:3306/[DATABASE]"
```

**📍 Comment obtenir ces informations dans cPanel o2switch :**

1. Connectez-vous à votre **cPanel o2switch**
2. Cherchez la section **"Bases de données MySQL"**
3. Cliquez sur **"Assistants de bases de données MySQL"**
4. Suivez les étapes pour créer :
   - Une base : `bienvuimmo_db`
   - Un utilisateur : `bienvuimmo_user` avec un mot de passe fort
   - Associer l'utilisateur à la base avec **TOUS LES PRIVILÈGES**
5. Notez ces informations :
   - **Host** : `localhost` (ou le host fourni par o2switch)
   - **Database** : Le nom de votre base (ex: `votre_user_bienvuimmo`)
   - **User** : Le nom de l'utilisateur (ex: `votre_user_bienvuimmo`)
   - **Password** : Le mot de passe que vous avez créé

**⚠️ Format de la chaîne de connexion MySQL** :

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/DATABASE"
```

**Exemple concret** :
```env
DATABASE_URL="mysql://bienvuimmo_user:Xk9mP2zL8qR5@localhost:3306/bienvuimmo_db"
```

**⚠️ Attention aux caractères spéciaux** : Si votre mot de passe contient des caractères spéciaux (`@`, `#`, `%`, etc.), vous devez les encoder en URL :
- `@` → `%40`
- `#` → `%23`
- `%` → `%25`
- `/` → `%2F`

Exemple avec caractères spéciaux :
```env
# Mot de passe : P@ssw0rd#123
DATABASE_URL="mysql://user:P%40ssw0rd%23123@localhost:3306/bienvuimmo_db"
```

### 2. URLs du site

Ces variables doivent contenir **votre nom de domaine complet avec HTTPS** :

```env
NEXT_PUBLIC_SITE_URL="https://votre-domaine.fr"
NEXTAUTH_URL="https://votre-domaine.fr"
```

**Exemples** :
```env
# Si votre domaine est bienvuimmo.fr
NEXT_PUBLIC_SITE_URL="https://bienvuimmo.fr"
NEXTAUTH_URL="https://bienvuimmo.fr"

# Si vous utilisez un sous-domaine
NEXT_PUBLIC_SITE_URL="https://app.bienvuimmo.fr"
NEXTAUTH_URL="https://app.bienvuimmo.fr"
```

⚠️ **Important** :
- Utilisez toujours `https://` (pas `http://`)
- Ne mettez pas de slash `/` à la fin
- Le domaine doit être configuré et pointer vers o2switch

### 3. Secret NextAuth (sécurité critique)

NextAuth nécessite un **secret aléatoire fort** pour signer les tokens de session.

**Générer un secret sécurisé** :
```bash
openssl rand -base64 32
```

**Exemple de résultat** :
```
K3mT8pL2vN9qR5xZ7wY4jH6bC1dF0aS8gU3eW9mP2kL5
```

**Ajouter dans `.env`** :
```env
NEXTAUTH_SECRET="K3mT8pL2vN9qR5xZ7wY4jH6bC1dF0aS8gU3eW9mP2kL5"
```

⚠️ **Ne réutilisez jamais le même secret entre développement et production !**

### 4. Configuration Email (SMTP o2switch)

Pour envoyer des emails (notifications, réinitialisation de mot de passe, etc.), vous devez configurer SMTP.

**📍 Créer un compte email dans cPanel o2switch :**

1. Dans cPanel, aller dans **"Comptes de messagerie"**
2. Cliquer sur **"Créer"**
3. Créer un compte :
   - Email : `contact@votre-domaine.fr` ou `noreply@votre-domaine.fr`
   - Mot de passe fort
4. Cliquer sur **"Créer un compte"**

**Configuration SMTP pour o2switch** :

```env
SMTP_HOST="mail.votre-domaine.fr"
SMTP_PORT="465"
SMTP_SECURE="true"
SMTP_USER="contact@votre-domaine.fr"
SMTP_PASSWORD="votre_password_email"
SMTP_FROM="BienVuImmo <contact@votre-domaine.fr>"
```

**Exemple complet** :
```env
SMTP_HOST="mail.bienvuimmo.fr"
SMTP_PORT="465"
SMTP_SECURE="true"
SMTP_USER="noreply@bienvuimmo.fr"
SMTP_PASSWORD="SecureP@ss123"
SMTP_FROM="BienVuImmo <noreply@bienvuimmo.fr>"
```

**Ports SMTP o2switch** :
- **465** : SSL/TLS (recommandé) - Utiliser `SMTP_SECURE="true"`
- **587** : STARTTLS - Utiliser `SMTP_SECURE="false"`

**💡 Astuce** : Si vous n'avez pas besoin d'envoyer d'emails immédiatement, vous pouvez mettre des valeurs temporaires et configurer ça plus tard.

### 5. Mode environnement

```env
NODE_ENV="production"
```

Cette variable indique à Next.js et aux dépendances qu'on est en production (optimisations, pas de logs de debug, etc.).

---

## Variables optionnelles

Ces variables ne sont pas nécessaires pour un déploiement initial, mais peuvent être ajoutées plus tard selon vos besoins.

### Stripe (paiements en ligne)

Si vous souhaitez accepter des paiements par carte bancaire :

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

**Où obtenir ces clés :**
1. Créer un compte sur https://stripe.com
2. Aller dans **Developers > API keys**
3. Utiliser les clés **Live** (pas Test) pour la production

### Google Analytics (statistiques de trafic)

Pour suivre les visiteurs et leur comportement :

```env
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
```

**Où obtenir cet ID :**
1. Créer un compte Google Analytics : https://analytics.google.com
2. Créer une propriété pour votre site
3. Copier l'ID de mesure (commence par `G-`)

### Sentry (monitoring des erreurs)

Pour être notifié des erreurs JavaScript en production :

```env
SENTRY_DSN="https://...@sentry.io/..."
NEXT_PUBLIC_SENTRY_DSN="https://...@sentry.io/..."
```

**Où obtenir ce DSN :**
1. Créer un compte sur https://sentry.io (plan gratuit disponible)
2. Créer un projet Next.js
3. Copier le DSN fourni

### Stockage fichiers externes (S3/R2)

Pour stocker les images et fichiers uploadés hors du serveur :

```env
STORAGE_ENDPOINT="https://..."
STORAGE_ACCESS_KEY="..."
STORAGE_SECRET_KEY="..."
STORAGE_BUCKET="bienvuimmo-uploads"
STORAGE_REGION="auto"
```

**Options recommandées** :
- **Cloudflare R2** : Compatible S3, gratuit jusqu'à 10 GB
- **AWS S3** : Service d'Amazon (payant)
- **DigitalOcean Spaces** : Alternative simple et abordable

---

## 📝 Template complet pour o2switch

Voici un fichier `.env` complet à créer sur votre serveur o2switch. Remplacez toutes les valeurs entre `[...]` par vos vraies informations.

### Créer le fichier .env sur le serveur

```bash
# Connexion SSH
ssh sc1wtgm7011@bienvuimmo.fr

# Aller dans le dossier de l'application
cd ~/bienvuimmo.fr

# Créer le fichier .env
nano .env
```

### Contenu à copier-coller (et personnaliser)

```env
# ==============================================
# PRODUCTION ENVIRONMENT - BienVuImmo o2switch
# ==============================================

# ========== Variables OBLIGATOIRES ==========

# Base de données MySQL o2switch
# Format: mysql://USER:PASSWORD@HOST:3306/DATABASE
# ⚠️ Remplacer par vos vraies informations cPanel
# Note: o2switch ajoute un préfixe à votre compte (ex: sc1wtgm7011_)
DATABASE_URL="mysql://sc1wtgm7011_bienvuimmo_user:[VOTRE_PASSWORD]@localhost:3306/sc1wtgm7011_bienvuimmo_db"

# URLs du site
# ⚠️ Remplacer par votre vrai domaine (avec https://)
NEXT_PUBLIC_SITE_URL="https://[VOTRE-DOMAINE].fr"
NEXTAUTH_URL="https://[VOTRE-DOMAINE].fr"
NEXT_PUBLIC_API_URL="https://[VOTRE-DOMAINE].fr/api"

# Sécurité NextAuth
# ⚠️ GÉNÉRER avec: openssl rand -base64 32
NEXTAUTH_SECRET="[VOTRE_SECRET_GENERE_64_CARACTERES]"

# Mode production
NODE_ENV="production"

# ========== Email SMTP (o2switch) ==========
# ⚠️ Créer un compte email dans cPanel > Comptes de messagerie
SMTP_HOST="mail.[VOTRE-DOMAINE].fr"
SMTP_PORT="465"
SMTP_SECURE="true"
SMTP_USER="contact@[VOTRE-DOMAINE].fr"
SMTP_PASSWORD="[VOTRE_PASSWORD_EMAIL]"
SMTP_FROM="BienVuImmo <contact@[VOTRE-DOMAINE].fr>"

# ========== Variables OPTIONNELLES ==========
# (Peuvent être ajoutées plus tard)

# Stripe Payments
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""
# STRIPE_SECRET_KEY=""
# STRIPE_WEBHOOK_SECRET=""

# Google Analytics
# NEXT_PUBLIC_GA_ID=""

# Sentry Error Monitoring
# SENTRY_DSN=""
# NEXT_PUBLIC_SENTRY_DSN=""

# External File Storage (S3/R2)
# STORAGE_ENDPOINT=""
# STORAGE_ACCESS_KEY=""
# STORAGE_SECRET_KEY=""
# STORAGE_BUCKET=""
# STORAGE_REGION=""
```

### Sauvegarder et vérifier

```bash
# Sauvegarder le fichier dans nano
# Ctrl + O (Write Out)
# Enter pour confirmer
# Ctrl + X pour quitter

# Vérifier que le fichier existe
ls -la .env

# Sécuriser les permissions (important !)
chmod 600 .env

# Vérifier le contenu (sans afficher les mots de passe)
cat .env | head -n 5
```

---

## 🔐 Sécurité et bonnes pratiques

### ⚠️ Points critiques

1. **Ne JAMAIS commit `.env` dans Git**
   - Le fichier est déjà dans `.gitignore`
   - Vérifier avec : `git status` (ne doit pas apparaître)

2. **Utiliser des mots de passe forts**
   - MySQL : minimum 12 caractères, lettres + chiffres + symboles
   - Email : minimum 12 caractères
   - Générer avec : `openssl rand -base64 16`

3. **Permissions du fichier sur le serveur**
   ```bash
   chmod 600 ~/bienvuimmo/.env
   # Seul votre utilisateur peut lire/écrire
   ```

4. **Stocker une copie sécurisée**
   - Utiliser un gestionnaire de mots de passe (LastPass, 1Password, Bitwarden)
   - Ne jamais envoyer les credentials par email non chiffré
   - Partager via des outils sécurisés (1Password, Vault)

5. **Vérifier l'inaccessibilité publique**
   ```bash
   curl https://votre-domaine.fr/.env
   # Doit retourner 403 Forbidden ou 404 Not Found
   ```

### Changement de credentials

Si vous devez changer un mot de passe :

```bash
# Sur le serveur
cd ~/bienvuimmo.fr
nano .env
# Modifier la valeur
# Sauvegarder (Ctrl+O, Enter, Ctrl+X)

# Redémarrer l'application
touch tmp/restart.txt

# Vérifier que ça fonctionne
curl -I https://votre-domaine.fr
```

---

## ✅ Checklist de vérification

Avant de finaliser le déploiement :

- [ ] `DATABASE_URL` configurée avec vos vraies infos MySQL
- [ ] `NEXTAUTH_SECRET` généré avec `openssl rand -base64 32`
- [ ] `NEXTAUTH_URL` et `NEXT_PUBLIC_SITE_URL` avec votre vrai domaine HTTPS
- [ ] `NODE_ENV` = `production`
- [ ] Variables SMTP configurées (ou laissées vides si pas besoin immédiatement)
- [ ] Fichier `.env` créé sur le serveur (pas localement)
- [ ] Permissions `chmod 600 .env` appliquées
- [ ] Copie de sauvegarde stockée dans un gestionnaire de mots de passe
- [ ] Test de connexion DB : `npx prisma db pull`
- [ ] Fichier `.env` inaccessible via URL : `curl https://domaine/.env` → 403/404

---

## 🆘 Dépannage

### Erreur "Invalid DATABASE_URL"

**Cause** : Format incorrect de l'URL MySQL

**Solution** :
```bash
# Vérifier le format
DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/DATABASE"

# Exemple correct avec préfixe o2switch
DATABASE_URL="mysql://sc1wtgm7011_bienvuimmo_user:SecurePass123@localhost:3306/sc1wtgm7011_bienvuimmo_db"

# Si caractères spéciaux dans le mot de passe, encoder en URL
# @ → %40, # → %23, % → %25
```

### Erreur "Can't reach database server"

**Cause** : Credentials MySQL incorrects ou base non créée

**Solution** :
```bash
# Tester la connexion MySQL directement
mysql -u sc1wtgm7011_bienvuimmo_user -p -h localhost sc1wtgm7011_bienvuimmo_db
# Si erreur : vérifier user/password dans cPanel

# Vérifier que la base existe
mysql -u sc1wtgm7011_bienvuimmo_user -p -e "SHOW DATABASES;"
```

### Erreur "NEXTAUTH_SECRET not defined"

**Cause** : Variable manquante ou mal nommée

**Solution** :
```bash
# Générer un nouveau secret
openssl rand -base64 32

# Ajouter dans .env (sans espaces)
NEXTAUTH_SECRET="K3mT8pL2vN9qR5xZ7wY4jH6bC1dF0aS8gU3eW9mP2kL5"

# Redémarrer
touch tmp/restart.txt
```

---

## 📞 Support

- **Documentation complète** : Voir `DEPLOYMENT.md`
- **Checklist** : Voir `DEPLOYMENT_CHECKLIST.md`
- **Support o2switch** : support@o2switch.fr
- **FAQ o2switch** : https://faq.o2switch.fr/

---

**Dernière mise à jour** : 2025-01-09  
**Version** : 1.0 - Configuration o2switch optimisée

Consultez :
- Documentation o2switch : https://faq.o2switch.fr/
- Guide de déploiement : `DEPLOYMENT.md`
- Checklist : `DEPLOYMENT_CHECKLIST.md`
