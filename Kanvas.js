/*******************************************************************************
 * ---------------------------------------------------
 * 
 * @class Kanvas Classe principale du bouzin, fait un peu tout.
 * ----------------------------------------------------
 */
var JSFOURMIS = JSFOURMIS || {};
(function() {
		/**
		 * Constructeur
		 */
		JSFOURMIS.Kanvas = function() {
			this.entites.fourmis = this.fourmis;
			this.entites.nourritures = this.nourritures;
			this.entites.pheromones = this.pheromones;
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
			 *			  l'alpha ("a") est facultatif. défaut: opaque.
			 */
			setPixel : function(x, y, couleur) {
				var index = (x + y * this.imageData.width) * 4;
				couleur.a = couleur.a || 0xff;
				this.imageData.data[index + 0] = couleur.r;
				this.imageData.data[index + 1] = couleur.g;
				this.imageData.data[index + 2] = couleur.b;
				this.imageData.data[index + 3] = couleur.a;
			},

			/**
			 * Vérifie si la matrice est valide pour une entité. Une matrice valide
			 * doit avoir une largeur et une hauteur impaires, comme ça, on peut la
			 * centrer sur la position donnéee. Valide aussi la matrice.
			 */
			estUneFormeValide : function(matrice) {
				return (
					matrice.h % 2 + matrice.w % 2 !== 0 && 
					matrice.estValide());
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
			 * TODO: Optimiser ! 
			 */
			dessineForme : function(matrice, x, y, couleur) {
				if (!this.estUneFormeValide(matrice)) {
					throw "La forme fournie n'est pas une forme valide.";
				}
				var centre_h_forme = (matrice.h -1) / 2; 
				var centre_w_forme = (matrice.w -1) / 2;
				var pix_x = 0;
				var pix_y = 0;
				for ( var fy = 0; fy < matrice.h; fy++) {
					for ( var fx = 0; fx < matrice.w; fx++) {
						if (matrice.data[fy * matrice.w + fx] === 1) {
							// x
							if (fx < centre_w_forme) {
								pix_x = x - centre_w_forme + fx;
							} else if (fx > centre_w_forme) {
								pix_x = x + fx - centre_w_forme;
							} else {
								pix_x = x;
							}
							// y
							if (fy < centre_h_forme) {
								pix_y = y - centre_h_forme + fy;
							} else if (fy > centre_h_forme) {
								pix_y = y + fy - centre_h_forme;
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
				var maxTentatives = 100;
				for ( var i = 0; i < this.nourriture.nbInitialDePoints; i++) {
					var tentatives = 0;
					while (tentatives < maxTentatives) {
						var x = this.random(1, this.width);
						var y = this.random(1, this.height);
						if (this.laPlaceEstElleLibre(x, y)) {
							this.creerUnPointDeNourriture(x, y);
							break;
						} else { 
							tentatives++;
						}
					}
				}
			},

			creerUnPointDeNourriture : function(x, y) {
				var nbDeNourriture = this.random(this.nourriture.nombreParPoint.min, this.nourriture.nombreParPoint.max);

				//Création du point centrale aux coordonnées données
				var pointCentral = new JSFOURMIS.Nourriture(this); 
				pointCentral.x = x; 
				pointCentral.y = y;
				pointCentral.quantitee = this.random(this.nourriture.quantitee.min, this.nourriture.quantitee.max);
				this.nourritures.push(pointCentral);
				
				//Création des points autour
				var maxEssais = 100;
				for(var i=nbDeNourriture -1; i >=0 ; i--) {
					var px = x;
					var py = y;
					var decalage_y, decalage_x;
					var plusOuMoins;
					var nbEssais = 0;
					while(!this.laPlaceEstElleLibre(px, py) && nbEssais < 1 && nbEssais < maxEssais) {
						nbEssais++;
						decalage_y = this.random(1, nbDeNourriture);
						decalage_x = this.random(1, nbDeNourriture);
						plusOuMoins = this.random(1,100) > 50;
						if(plusOuMoins) px = x + decalage_x;
						else			px = x - decalage_x;
						plusOuMoins = this.random(1,100) > 50;
						if(plusOuMoins) py = y + decalage_y;
						else			py = y - decalage_y;
					}
					var pointAnnexe = new JSFOURMIS.Nourriture(this); 
					pointAnnexe.x = px; 
					pointAnnexe.y = py;
					pointAnnexe.quantitee = this.random(this.nourriture.quantitee.min, this.nourriture.quantitee.max);
					this.nourritures.push(pointAnnexe);	
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
				for ( var uneEntite in this.entites) {
					for ( var i = this.entites[uneEntite].length -1; i >= 0; i--) {
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
				return ((Math.random() * (higher - lower)) + lower)|0;
			},
			
			/**
			 * Déplacement des fourmis
			 */
			deplacement: {
				chancesDeFaireDemiTour: 3, 
				chanceDeChangerDeDirection: 8,
				distanceAParcourrirParFourmis: 1
			},		

			/**
			 * Fait avancer une fourmi (pour un cycle).
			 * Déroulement:
			 * 1- Si la fourmis n'a pas de direction, on lui en donne une au pif 
			 * 2- La fourmi à un % (faible) de chance de faire demi-tour
			 * 3- Si la fourmi ne fait pas demi-tour, % de chance d'aller sur le côté
			 * 4- On demande à la fourmis d'avancer.
			 */
			avance : function(fourmi) {
				if(fourmi.aller) { // Recherche de nourriture
					
					// Déjà dans une direction ?
					if(fourmi.direction == JSFOURMIS.Directions.AUCUNE) {
						fourmi.direction = this.choisiUneDirectionAuHasard();
					} 
					else { // Oui..
						
						// Nourriture à proximité ? alors on se place dans sa direction
						var aTrouveUneDirectionInteressante = false;
						var vision = fourmi.champVision();
						for(var sens in vision) {
							if(this.ilYADeLaNourriture(vision[sens].x, vision[sens].y)) {
								fourmi.direction = vision[sens].direction;
								aTrouveUneDirectionInteressante = true;
								break;
							} 	
						}
						// Pas trouvé de bouffe..
						if(!aTrouveUneDirectionInteressante) {
							// Déplacement aléatoire
							if(this.random(1,100) < this.deplacement.chancesDeFaireDemiTour) {
								 fourmi.direction = -fourmi.direction;
							} else if(this.random(1,100) < this.deplacement.chanceDeChangerDeDirection) {
								var nouvelleDirection = fourmi.direction; 
								while(nouvelleDirection == fourmi.direction || nouvelleDirection == -fourmi.direction) {
									nouvelleDirection = this.choisiUneDirectionAuHasard();
								}
								fourmi.direction = nouvelleDirection; 
							}
						}
					}
				}
				else { // Retour à la fourmilière (fourmi.aller == false)
					fourmi.direction = fourmi.directionVersFoyer();
					if (fourmi.age%10 == 0) {
						fourmi.posePheromone(JSFOURMIS.TypesPheromones.NOURRITURE,30);
					}
				}
				
				// effectue son pas.
				fourmi.avanceDansSaDirection(this.deplacement.distanceAParcourrirParFourmis);
			},
			
			/**
			 * Comme son titre l'indique, choisi
			 * une direction au hazard parmis JSFOURMIS.Directions
			 */
			choisiUneDirectionAuHasard: function() {
				var xOuY = this.random(1, 100);
				var moinsOuPlus = this.random(1, 100);
				if (xOuY <= 50) {
					if (moinsOuPlus <= 50) {
						return JSFOURMIS.Directions.EST;
					} else {
						return JSFOURMIS.Directions.OUEST;
					}
				} else {
					if (moinsOuPlus <= 50) {
						return JSFOURMIS.Directions.SUD;
					} else {
						return JSFOURMIS.Directions.NORD;
					}
				}
			},
			
			dessineLaFourmiliere: function () {
				var data = [1,1,1,1,1,1,1,1,1];
				var matrice =  new JSFOURMIS.Matrice(3,3,data).agrandir(3);
				this.dessineForme(matrice, this.foyer.x, this.foyer.y, {r:160, g:160, b:160});
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
			 * @param padding: marge de "sécurité"
			 */
			estDansLaZone : function(x, y, padding) {
				var yEst = true;
				padding = padding || 6;
				if (x <= padding || x >= this.width - padding) {
					yEst = false;
				} if (y <= padding || y >= this.height - padding) {
					yEst = false;	
				}
				return yEst;
			},

			ilYADeLaNourriture : function(x, y) {
				for (var i = this.entites.nourritures.length - 1; i >= 0; i--){
					if(this.entites.nourritures[i].estDessinable()) {
						if(	this.entites.nourritures[i].x === x &&
							this.entites.nourritures[i].y === y) {
								return true;
							}			
					}
				}
				return false;
			},

			/**
			 * Efface tout le contenu du canvas
			 */
			effaceTout : function() {
				this.imageData = this.ctx.createImageData(this.width, this.height);
			},

			/**
			 * Dessine chaque entitée dessinable. Cette méthode est donc appellé
			 * logiquement quand leurs positions sont déjà mises à jour
			 */
			dessineTout : function() {
				this.dessineLaFourmiliere();
				for ( var uneEntite in this.entites) {
					for ( var i = this.entites[uneEntite].length -1; i >= 0; i--) {
						if (this.entites[uneEntite][i].estDessinable()) {
							this.entites[uneEntite][i].dessine();
						}
					}
				}
				if(this.curseur.estSurLeCanvas) {
					this.dessineForme(
						this.curseur.matrice, 
						this.curseur.position.x, 
						this.curseur.position.y, 
						this.curseur.couleur);
				}
				this.ctx.putImageData(this.imageData, 0, 0); // at coords 0,0
			},

			/**
			 * Liste les différentes entités et le tableau les stockant pour
			 * chacune d'entre elles
			 */
			
			entites : {
				fourmis : this.fourmis,
				nourritures: this.nourritures,
			    pheromones: this.pheromones,
			},

			/**
			 * Boucle principale
			 */
			main : function() {
				if (this.nbCycles != -1) {
					JSFOURMIS.Kanvas.compteurCycles++;
				}
				this.effaceTout();

				for ( var i = this.fourmis.length -1; i >=0; i--) {
					if(this.ilYADeLaNourriture(this.fourmis[i].x, this.fourmis[i].y)) {
						this.fourmis[i].ramasseLaNourriture();
					} 
					// arrivé à la fourmilière  
					else if (this.fourmis[i].x === this.foyer.x && this.fourmis[i].y === this.foyer.y) {
						this.fourmis[i].deposeLaNourriture();
					}
					this.avance(this.fourmis[i]);
				}

				for (i = this.entites.fourmis.length -1; i >=0; i--) {
					this.entites.fourmis[i].age++;
					if (this.entites.fourmis[i].doitMourir()) {
						this.entites.fourmis[i].meurt();
					}
				}
				
				if (this.entites.pheromones!=null) {
				for (i = this.entites.pheromones.length -1; i >=0; i--) {
					this.entites.pheromones[i].duree--;
					if (this.entites.pheromones[i].duree<=0) {
						this.entites.pheromones[i].disparait();
					}
				}
			}
				
				this.dessineTout();
				
				if (this.running) {
					if (JSFOURMIS.Kanvas.compteurCycles <= this.nbCycles ||
						this.nbCycles == -1) {
						window.setTimeout(function(thisObj) { thisObj.main(); }, this.delaiCycle, this);
					} else {
						var diff = (new Date).getTime() - this.navigateur.startTime;
						alert('time elapsed:' + diff);
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

			/**
			 * Nourriture
			 */
			nourriture: {
				nbInitialDePoints: 15,
				nombreParPoint: {
					min: 0,
					max: 20
				}, 
				quantitee: {
					min: 1,
					max: 10
				} 
			},
			/**
			 * Drapeau indiquant l'état actuel de la boucle principale
			 */
			running : false,
			
			/**
			 * Gestion de la souris
			 */
			mouse: {
				onMove: function(ev) {
					this.curseur.position = {
						x: ev.clientX - this.navigateur.totalCancasOffset.left,
						y: ev.clientY - this.navigateur.totalCancasOffset.top
					};					
				},
				
				onOver: function(ev) {
					this.curseur.estSurLeCanvas = true;
				},
				
				onOut: function(ev) {
					this.curseur.estSurLeCanvas = false;
				},
				
				onClick: function(ev){
					var x = ev.clientX - this.navigateur.totalCancasOffset.left;
					var y = ev.clientY - this.navigateur.totalCancasOffset.top;
					var rayon = 8;
					for (i = 0; i < this.entites.fourmis.length; i++) {
						if(	this.entites.fourmis[i].x <= x + rayon  && this.entites.fourmis[i].x >= x - rayon && 
							this.entites.fourmis[i].y <= y + rayon  && this.entites.fourmis[i].y >= y - rayon) {
							this.entites.fourmis[i].meurt();
						}
					}
				},
			}, 
			
			/**
			 * Curseur
			 */
			curseur: {
				matrice: {},
				estSurLeCanvas: false,
				position: { x: 0, y: 0 },
				couleur: {r:0, g:0, b:254}
			},
			
			/**
			 * Paramètres "systeme", "navigateur"
			 */
			navigateur: {
				totalCancasOffset: {left:0, top:0 },
				startTime: 0
			},
			
			/**
			 * Initialisation Déclenché au clic du bouton start
			 */
			start : function() {
				// Récup du canvas et de sa taille
				this.canvas = document.getElementById("canvas");
				this.ctx = this.canvas.getContext("2d");
				this.height = parseInt(this.canvas.getAttribute('height'), 10);
				this.width = parseInt(this.canvas.getAttribute('width'), 10);

				// on place la fourmilière au centre
				this.foyer.y = this.height / 2;
				this.foyer.x = this.width / 2;

				// cré une "imageData", zone de travail par pixel
				this.imageData = this.ctx.createImageData(this.width, this.height); // /!\

				var nbfourmis = parseInt($('nbFourmis').value);
				this.nbCycles = parseInt($('nbCycles').value);

				// Curseur & autre broutilles "systeme"
				this.curseur.matrice = new JSFOURMIS.Matrice(7,7,[
									0,0,1,1,1,0,0,
									0,1,0,0,0,1,0,
									1,0,0,1,0,0,1,
									1,0,1,1,1,0,1,
									1,0,0,1,0,0,1,
									0,1,0,0,0,1,0,
									0,0,1,1,1,0,0]).agrandir(3);

				this.navigateur.totalCancasOffset = $totalOffset(this.canvas); 
				this.canvas.addEventListener('mousemove', bind(this, this.mouse.onMove), false);
				this.canvas.addEventListener('mouseover', bind(this, this.mouse.onOver), false);
				this.canvas.addEventListener('mouseout', bind(this, this.mouse.onOut), false);
				this.canvas.addEventListener('click', bind(this, this.mouse.onClick), false);

				// A chaque nouveau départ, on ré-init le compteur
				JSFOURMIS.Kanvas.compteurCycles = 0;

				// dispersion du mangé
				this.disperseDeLaNourriture();

				// création des fourmis
				for ( var i = 0; i < nbfourmis; i++) {
					this.fourmis.push(new JSFOURMIS.Fourmi(this, {numero: this.fourmis.length}));
				}
				this.running = true;
				this.navigateur.startTime = (new Date).getTime();
				this.main();
			},

			/**
			 * Tableau des JSFOURMIS.Fourmi (des fourmis quoi)
			 */
			fourmis : [],
			
			pheromones : [],
			
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
