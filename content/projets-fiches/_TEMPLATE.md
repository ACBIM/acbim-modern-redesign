# Fiche projet (template a dupliquer)

But:
- Te permettre de remplir une fiche projet simplement (VSCode / Notepad++).
- Me donner une base claire pour integrer proprement dans `content/projects.json`.

Regles simples (important):
- Garde les titres de sections tels quels (je m en sers comme repere).
- Tu peux laisser des champs vides si tu n as pas l info.
- Ecris court et concret (pas besoin d un texte parfait).
- Evite le markdown dans les phrases (pas de `**gras**`) : le texte est affiche tel quel.
- Si possible, enregistre en `UTF-8` (pour eviter les caracteres casses).

Nom de fichier conseille:
- `slug-du-projet.md`

Exemple:
- `musee-bargoin-clermont-ferrand.md`

---

# Projet

Slug: [A_COMPLETER]
# Le slug sert a l URL. Court, sans accents, sans espaces.
# Exemple: musee-bargoin-clermont-ferrand

Titre: [A_COMPLETER]
# Le nom visible du projet (titre principal de la page)

Categorie: [A_COMPLETER]
# Version complete / descriptive (utile pour le contexte et le SEO)
# Exemple: 3D / visite virtuelle / pisciniste / vente / commerce

Categorie courte (optionnel): [A_COMPLETER]
# Version courte pour l affichage (badge sur les tuiles, filtres plus propres)
# Exemple: Visite virtuelle / commerce
# Si tu ne remplis pas, on utilisera "Categorie"

Client: [A_COMPLETER]
# Nom du client / maitre d ouvrage / structure

Date: [A_COMPLETER]
# Annee ou periode visible (ex: 2025, 2023, 2020-2022)

Date publication (optionnel, YYYY-MM-DD): [A_COMPLETER]
# Sert au tri / recence sur le site
# Exemple: 2026-02-24

Image hero: [A_COMPLETER]
# Image principale de la tuile et de la page projet
# Tu peux mettre:
# - un chemin simple (ex: plans-2d/vic1.webp)
# - ou un chemin complet du site (ex: /images/optimized/plans-2d/vic1.webp)
# - ou une URL web si besoin

## Extrait (1-2 phrases)
[A_COMPLETER]
# Ce texte est visible sur les tuiles de projets et sous le titre de la page projet.
# Court, clair, oriente utilite.

## A propos du projet (4-5 lignes max)
[A_COMPLETER]
# Texte court seulement (4-5 lignes max)
# Idee simple:
# - contexte
# - ce qu ACBIM a fait
# - a quoi ca sert

## Le projet en 20 secondes
Besoin: [A_COMPLETER]
Reponse: [A_COMPLETER]
Resultat: [A_COMPLETER]
# 3 phrases tres courtes.
# Besoin = probleme du client
# Reponse = ce qu on a produit
# Resultat = gain concret / usage

## Details rapides (optionnel)
- [Label]: [Valeur]
- [Label]: [Valeur]
# Affiche des mini cartes "details techniques" dans la tuile de droite.
# Exemples de labels utiles:
# - Typologie
# - Surface
# - Emprise
# - Hauteur
# - Niveaux
# - Periode
# - Reference

## Tags (separes par virgule)
[A_COMPLETER], [A_COMPLETER]
# Mots-cles de filtre / classement.
# Mets des mots simples et utiles au visiteur.
# Bons exemples: Patrimoine, Scan 3D, Drone, Plans 2D, BIM, Visite virtuelle
# Evite d en mettre 25 si ce n est pas utile.

## Services appliques (slugs, separes par virgule)
[A_COMPLETER], [A_COMPLETER]
# Ce sont les slugs des services du site (pages /services/...)
# Exemples:
# - releve-scanner-3d-numerisation
# - maquette-numerique-3d-bim
# - dessin-2d-plans-coupes-elevations
# - releve-et-capture-par-drone
# - visite-virtuelle-360-3d

## Livrables de mission (une ligne = une puce)
- [A_COMPLETER]
- [A_COMPLETER]
# Ce qu on remet au client (fichiers / documents / maquette / exports / medias)
# Pense "ce qu on a livre", pas "comment on a travaille"

## Contraintes de mission (une ligne = une puce)
- [A_COMPLETER]
- [A_COMPLETER]
# Ce qui rendait la mission sensible / difficile
# Exemples: site occupe, delais courts, patrimoine, hauteurs, confidentialite

## Pourquoi c etait utile (une ligne = une puce)
- [A_COMPLETER]
- [A_COMPLETER]
# Benefices pour le client / MOA / MOE
# Exemples: Decider, Concevoir, Exploiter, Financer, Communiquer, Coordonner

## Galerie (une image par bloc)
# Tu peux melanger images et videos.
# Une image = bloc "Image"
# Une video YouTube = bloc "Video"
# Pour les plans / elevations / orthophotos, ajoute "Fit: contain" pour eviter le rognage.

Image: [CHEMIN_OU_URL_IMAGE]
Alt: [Description de ce qu on voit]
Legende: [Legende courte utile, qui explique aussi a quoi cela sert]
# Optionnel:
# Fit: contain

Image: [CHEMIN_OU_URL_IMAGE]
Alt: [Description de ce qu on voit]
Legende: [Legende courte utile]

Video: [URL_YOUTUBE]
Alt: [Description de la video]
Legende: [Legende video]
# Exemple: https://youtu.be/xxxxxxxxxxx

## Notes libres (optionnel)
- Infos internes, points a verifier, sources, noms de partenaires, contraintes de publication, etc.
- Tu peux aussi me dire ici: "ne pas modifier le texte"

---

# Mini pense-bete (utile)

- `Categorie` = version complete (descriptive)
- `Categorie courte` = version courte (affichage)
- `Tags` = mots-cles de filtre
- `Image hero` = image principale de la tuile + page projet
- `Galerie` = images / videos avec legendes

Si tu hesites:
- remplis d abord `Titre`, `Categorie`, `Extrait`, `A propos`, `20 secondes`, `Galerie`
- le reste peut venir apres

