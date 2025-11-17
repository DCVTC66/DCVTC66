# DCVTC66 — Site VTC (statique)

Site statique simple pour DCVTC66 — Chauffeur VTC à Perpignan.

## Contenu
- `index.html` : page principale (accueil, services, tarifs, réservation, contact)
- `styles.css` : styles
- `script.js` : petit script pour l'année et feedback formulaire

## Personnalisation rapide
- Remplace le numéro de téléphone et l'email dans `index.html`.
- Remplace l'URL du formulaire (`action`) par ton endpoint Formspree ou Netlify Forms.
- Pour héberger sur GitHub Pages : place les fichiers à la racine du repo et active Pages (branche `main`, dossier `/`).

## Déployer sur GitHub Pages
1. Crée un repo `site-vtc` ou `dcvtc66` sur GitHub et pousse ces fichiers.
2. Dans **Settings > Pages**, choisis la branche `main` et le dossier `/ (root)`.
3. Attends quelques minutes ; ton site sera disponible à : `https://<ton-utilisateur>.github.io/<repo>/`.

## Lier ton domaine OVH (résumé)
1. Dans GitHub repo Settings > Pages, ajoute ton domaine personnalisé (ex : `dcvtc66.fr`).
2. Sur OVH, crée un enregistrement A pointant vers les IPs GitHub Pages (ou un enregistrement ANAME/ALIAS selon OVH).
3. Active HTTPS dans GitHub Pages.

> Si tu veux, je peux te fournir les étapes DNS exactes et les valeurs à entrer pour OVH.

