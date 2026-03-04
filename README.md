# Créér un jeu de mémoire

## MEMORY

--------------

![image](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![image](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![image](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)

--------------

## Présentation du projet

Projet personnel ( Mars 2026 ) :<br />
Jeu de Memory développé en HTML, CSS et JavaScript, proposant une expérience fluide, animée et responsive.<br />
Le projet inclut trois niveaux de difficulté, un système audio, des animations visuelles, un compteur de coups et un écran de victoire.
L’objectif était de créer un jeu simple mais techniquement propre, structuré et agréable à jouer, tout en explorant :
* la manipulation avancée du DOM
* la gestion d’état d’un jeu interactif
* les animations CSS
* la Web Audio API
* la navigation multi‑écrans

## Fonctionnalités principales

#### Trois niveaux de difficulté.
Chaque niveau génère une grille différente :
* Facile — 4×3 (12 cartes)
* Moyen — 4×4 (16 cartes)
* Difficile — 4×6 (24 cartes)<br />

La grille est générée dynamiquement en fonction du niveau choisi.<br />

#### Logique du jeu
* Mélange aléatoire via l’algorithme Fisher‑Yates
* Gestion des cartes retournées et des paires trouvées
* Verrouillage temporaire du plateau pour éviter les clics multiples
* Animation shake en cas d’erreur
* Détection automatique de la fin de partie<br />

#### Effets sonores (Web Audio API)<br />
Le jeu utilise des oscillateurs pour générer des sons :
* flip de carte
* paire trouvée (petite mélodie)
* victoire (suite ascendante)<br />

Un bouton permet d’activer/désactiver le son (🔊 / 🔇), avec mise à jour de l’attribut aria-label.<br />

#### Écran de victoire
* Animation d’apparition
* Affichage du nombre total de coups
* Boutons pour rejouer ou changer de niveau<br />

#### Interface responsive
* Grille flexible selon le nombre de colonnes
* Boutons adaptés au tactile
* Animations fluides (flip, bounce-in, shake)

## Structure du code
Organisation en 3 fichiers

#### index.html 
qui contient les trois écrans du jeu :
* menu (choix du niveau)
* game (plateau de cartes)
* win (écran de victoire)<br />

Chaque écran est affiché/masqué via la classe hidden.<br />

#### style.css
* animations (flip, shake, bounce-in)
* styles des cartes et du plateau
* responsive design
* palette cohérente et lisible<br />

#### script.js 
pour la logique du jeu :
* génération du deck selon la difficulté
* mélange des cartes
* gestion des clics et de l’état (isFlipped, isMatched)
* verrouillage du plateau (locked)
* compteur de coups
* gestion du son via Web Audio API
* transitions entre les écrans<br />

#### Points techniques notables :
* utilisation de dataset.id pour relier DOM et logique
* re‑render complet de la grille après chaque action
* animations CSS déclenchées via classes (card-wrong, flipped, card-matched)
* gestion propre des événements et du reset

## Bonnes pratiques intégrées
* aucune donnée utilisateur injectée via innerHTML (sauf contenu contrôlé)
* utilisation de textContent pour les labels dynamiques
* encapsulation des états dans des variables locales
* aucune dépendance externe
* code structuré et lisible

-------------

## Voir le site et jouer
https://bernard-vera.github.io/Memory/

