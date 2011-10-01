/*******************************************************************************
 * ---------------------------------------------------
 * 
 * @class Kanvas Classe principale du bouzin, fait un peu tout.
 * ----------------------------------------------------
 */
(function() {
		/**
		 * Constructeur
		 */
		JSFOURMIS.Kanvas = function() {
			this.entites.fourmis = this.fourmis;
			this.entites.nourritures = this.nourritures;
		};
		/**
		 * Méthodes publiques
		 */
		JSFOURMIS.Kanvas.prototype = {
			canvas : null, // <@ Canvas
			ctx : null, // <@ Contexte du canvas

			/**
			 * Zone de dessin par pixel du canvas. On ne travaille que la dessus
			 * normalement.
			 */
			imageData : {},

			/**
			 * Dessine un pixel sur la zone de dessin.
			 * 
			 * @param x
			 * @param y
			 * @param couleur:
			 *            objet {} ayant 4 propriétés r,g,b et a (transparence)
			 */
			setPixel : function(x, y, couleur) {
				var index = (x + y * this.imageData.width) * 4;
				this.imageData.data[index + 0] = couleur.r;
				this.imageData.data[index + 1] = couleur.g;
				this.imageData.data[index + 2] = couleur.b;
				this.imageData.data[index + 3] = couleur.a;
			},

			/**
			 * Vérifie si la matrice est valide pour une entité. Une matrice valide
			 * doit avoir une largeur et une hauteur impaires, comme ça, on peut la
			 * centrer sur la position donnéee.
			 * 
			 * @TODO vérifier la concordance h*w = taille du tableau
			 */
			estUneMatriceValide : function(matrice) {
				var reste_h = matrice.h % 2;
				var reste_w = matrice.w % 2;
				return reste_w + reste_h !== 0;
			},

			/**
			 * Dessine une matrice. Typiquement la matrice d'une entité. Une matrice
			 * est un objet {} doté de 3 propriétés: 
			 * w: la largeur de la matrice
			 * h: la hauteur de la forme 
			 * data: un tableau *à une dimension* représentant la forme. 
			 * data doit contenir soit 1: plein, soit 0:
			 * vide. Exemple d'une forme de croix: <code>
			 * var croix = { 
			 *		h: 3, w: 3,
			 *		data: [	0,1,0,
			 *				1,1,1,
			 *				0,1,1 ] };
			 * </code>
			 */
			dessineForme : function(matrice, x, y, couleur) {
				if (!this.estUneMatriceValide(matrice)) {
					throw "La forme fournie n'est pas une forme valide.";
				}
				var centre_h_forme = matrice.h % 2;
				var centre_w_forme = matrice.w % 2;
				var pix_x = 0;
				var pix_y = 0;
				for ( var fy = 0; fy < matrice.h; fy++) {
					for ( var fx = 0; fx < matrice.w; fx++) {
						var index = fy * matrice.w + fx;
						if (matrice.data[index] == 1) {
							// x
							if (x < centre_w_forme) {
								pix_x = x - fx;
							} else if (x > centre_h_forme) {
								pix_x = x + fx;
							} else {
								pix_x = x;
							}
							// y
							if (y < centre_h_forme) {
								pix_y = y - fy;
							} else if (y > centre_h_forme) {
								pix_y = y + fy;
							} else {
								pix_y = y;
							}
							this.setPixel(pix_x, pix_y, couleur);
						}
					}
				}
			},

			effaceNouriture : function(x, y) {
			},

			/**
			 * Hauteur du canvas DOIT être Impaire (c'est mieux, on a un centre)
			 * Renseignée en principe dans le constructeur ou le start()
			 */
			height : 0,
			/**
			 * Largeur du canvas DOIT être Impaire (c'est mieux, on à un centre)
			 * Renseignée en principe dans le constructeur ou le start()
			 */
			width : 0,

			disperseDeLaNourriture : function() {
				var maxTantatives = 100;
				for ( var i = 0; i < this.nbInitialDePointDeNourriture; i++) {
					var tantatives = 0;
					while (tantatives < maxTantatives) {
						var x = this.random(1, this.width);
						var y = this.random(1, this.height);
						if (this.laPlaceEstElleLibre(x, y)) {
							this.creerUnPointDeNourriture(x, y);
							break;
						} else { 
							tantatives++;
						}
					}
				}
			},

			creerUnPointDeNourriture : function(x, y) {
				// nbMinNourritureParPointDeNourriture: 1,
				// nbMaxNourritureParPointDeNourriture: 10,
				// quantiteeMinParNourriture: 1,
				// quantiteeMaxParNourriture: 10,
				// new JSFOURMIS.Nourriture(this,
				// KNOO:J'en suis la
				var nbDeNourriture = this.random(this.nbMinNourritureParPointDeNourriture, this.nbMaxNourritureParPointDeNourriture);
				//Création du point centrale aux coordonnées données
				var pointCentral = new JSFOURMIS.Nourriture(this); 
				pointCentral.x = x; 
				pointCentral.y = y;
				pointCentral.quantitee = this.random(this.quantiteeMinParNourriture, this.quantiteeMaxParNourriture);
				this.nourritures.push(pointCentral);
				for(var i=0; i < nbDeNourriture -1; i++) {
					//var nourriture = new JSFOURMIS.Nourriture();
					//KNOO TODO: Ben.. faire ça :)
				}
			},

			/**
			 * Indique la présence ou non d'une entité à la position donnée
			 * 
			 * @param x
			 * @param y
			 * @return bool: vrai s'il n'y à rien, faux sinon.
			 */
			laPlaceEstElleLibre : function(x, y) {
				// FIXME: Problème !
				// Comment savoir si la place est libre
				// sans avoir à itérer toutes les entitées
				// déssinables..
				// faudrait garder dans un tableau de la taille de l'image
				// un genre de référence des objets à cette position
				// un truc comme ça.. sinon, ca peut être relou pour rien
				// je pense. Nope ?
				//
				// En attendant..
				for ( var uneEntite in this.entites) {
					for ( var i = 0; i < this.entites[uneEntite].length; i++) {
						if (this.entites[uneEntite][i].x == x &&
							this.entites[uneEntite][i].y == y) {
							return false;
						}
					}
				}
				return true;
			},

			/**
			 * Random borné (têtu celui-là..)
			 */
			random : function(lower, higher) {
				return Math.floor((Math.random() * (higher - lower)) + lower);
			},

			/**
			 * Fait avancer une fourmi (pour un cycle).
			 */
			avance : function(fourmi) {
				// TODO: faire la *vrai* fonction..
				// la c'est une direction aléatoire..
				var distanceAParcourrir = 1;
				var xOuY = this.random(1, 100);
				var moinsOuPlus = this.random(1, 100);
				if (xOuY <= 50) {
					if (moinsOuPlus <= 50) {
						fourmi.x += distanceAParcourrir;
					} else {
						fourmi.x -= distanceAParcourrir;
					}
				} else {
					if (moinsOuPlus <= 50) {
						fourmi.y += distanceAParcourrir;
					} else {
						fourmi.y -= distanceAParcourrir;
					}
				}
			},

			/**
			 * Emplacement de la fourmilière. En principe choisi dans le
			 * constructeur ou le start()
			 */
			foyer : {
				x : 0,
				y : 0
			},

			/**
			 * Indique si la position donnée est incluse dans la zone de dessin
			 * ou dépasse
			 */
			estDansLaZone : function(x, y) {
				var yEst = true;
				if (x < 0 || x >= this.width) {
					yEst = false;
				} if (y < 0 || y >= this.height) {
					yEst = false;	
				}
				return yEst;
			},

			ilYADeLaNourriture : function(x, y) {
			},

			/**
			 * Efface tout le contenu du canvas
			 */
			effaceTout : function() {
				this.imageData = this.ctx.createImageData(this.width,
						this.height);
			},

			/**
			 * Dessine chaque entitée dessinable. Cette méthode est donc appellé
			 * logiquement quand leurs positions sont déjà mises à jour
			 */
			dessineTout : function() {
				for ( var uneEntite in this.entites) {
					for ( var i = 0; i < this.entites[uneEntite].length; i++) {
						if (this.entites[uneEntite][i].estDessinable()) {
							this.entites[uneEntite][i].dessine();
						}
					}
				}
				this.ctx.putImageData(this.imageData, 0, 0); // at coords 0,0
			},

			/**
			 * Liste les différentes entités et le tableau les stockant pour
			 * chaqune d'entre elles
			 */
			
			entites : {
				fourmis : this.fourmis,
				nourritures: this.nourritures
			    // pheromones: this.pheromones
			},

			/**
			 * Boucle principale
			 */
			main : function() {
				if (this.nbCycles != -1) {
					JSFOURMIS.Kanvas.compteurCycles++;
				}
				this.effaceTout();

				for ( var i = 0; i < this.fourmis.length; i++) {
					var nouvellePos = this.avance(this.fourmis[i]);
				}

				for (i = 0; i < this.fourmis.length; i++) {
					this.fourmis[i].age++;
					if (this.fourmis[i].doitMourir()) {
						this.fourmis[i].meur();
					}
				}
				this.dessineTout();
				if (this.running) {
					if (JSFOURMIS.Kanvas.compteurCycles <= this.nbCycles ||
						this.nbCycles == -1) {
						window.setTimeout(function(thisObj) { thisObj.main(); }, this.delaiCycle, this);
					}
				}
			},

			/**
			 * Délai entre 2 cycles, en ms
			 */
			delaiCycle : 20,

			/**
			 * Nombre de cycles à éxecuter
			 */
			nbCycles : 0,

			// nourriture stuff
			nbInitialDePointDeNourriture : 50,
			nbMinNourritureParPointDeNourriture : 1,
			nbMaxNourritureParPointDeNourriture : 10,
			quantiteeMinParNourriture : 1,
			quantiteeMaxParNourriture : 10,

			/**
			 * Drapeau indiquant l'état actuel de la boucle principale
			 */
			running : false,

			/**
			 * Initialisation Déclenché au clic du bouton start
			 */
			start : function() {
				// Récup du canvas et de sa taille
				this.canvas = document.getElementById("canvas");
				this.ctx = this.canvas.getContext("2d");
				this.height = parseInt(this.canvas.getAttribute('height'));
				this.width = parseInt(this.canvas.getAttribute('width'));

				// on place la fourmilière au centre
				this.foyer.y = this.height / 2;
				this.foyer.x = this.width / 2;

				// créé une "imageData", zone de travail par pixel
				this.imageData = this.ctx.createImageData(this.width, this.height); // /!\

				var nbfourmis = parseInt($('nbFourmis').value);
				this.nbCycles = parseInt($('nbCycles').value);

				// A chaque nouveau départ, on ré-init le compteur
				JSFOURMIS.Kanvas.compteurCycles = 0;

				// dispersion du mangé
				this.disperseDeLaNourriture();

				// création des fourmis
				for ( var i = 0; i < nbfourmis; i++) {
					this.fourmis.push(new JSFOURMIS.Fourmi(this));
				}
				this.running = true;
				this.main();
			},

			/**
			 * Tableau des JSFOURMIS.Fourmi (des fourmis quoi)
			 */
			fourmis : [],
			
			/**
			 * Tableau des JSFOURMIS.Nourritures
			 */
			nourritures: [],

			/**
			 * Stoppe l'écoulement des cycles
			 */
			stop : function() {
				JSFOURMIS.Kanvas.compteurCycles = this.nbCycles + 1;
				this.running = false;
			}
		};
})();
