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
			this.entites.obstacles = this.obstacles;
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
			localiseNourriture : [],
			localisePheromonesNourriture : [],

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
				this.imageData.data[index + 0] = couleur.r;
				this.imageData.data[index + 1] = couleur.g;
				this.imageData.data[index + 2] = couleur.b;
				this.imageData.data[index + 3] = couleur.a || 0xff;
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

				//Création du point central aux coordonnées données
				var quantite = this.random(this.nourriture.quantite.min, this.nourriture.quantite.max);
				var pointCentral = new JSFOURMIS.Nourriture(this, this, quantite, x, y);
				this.nourritures.push(pointCentral);
				
				//Création des points autour
				var maxEssais = 50;
				for(var i=nbDeNourriture -1; i >=0 ; i--) {
					var px = x;
					var py = y;
					var decalage_y, decalage_x;
					var plusOuMoins;
					var nbEssais = 0;
					while(!this.laPlaceEstElleLibre(px, py) && nbEssais < maxEssais) {
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
					if (this.laPlaceEstElleLibre(px, py)) {
						var quantite = this.random(this.nourriture.quantite.min, this.nourriture.quantite.max);
						var pointAnnexe = new JSFOURMIS.Nourriture(this, this, quantite, px, py); 
						this.nourritures.push(pointAnnexe);
					}
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
				/*for (var i = this.entites.nourritures.length - 1; i >= 0; i--){
					if( this.entites.nourritures[i].prop_estDessinable === true &&
						this.entites.nourritures[i].x === x &&
						this.entites.nourritures[i].y === y) {
								return true;
					}
				}
				return false;*/
				return this.localiseNourriture[x + y * this.width] > 0;
			},
			
			getPheromoneAt: function (x, y, typePheromone) {
				for (var i = this.entites.pheromones.length - 1; i >= 0; i--){
					if( this.entites.pheromones[i].type === typePheromone &&
						this.entites.pheromones[i].x === x &&
						this.entites.pheromones[i].y === y) {
							return this.entites.pheromones[i];
					}
				}
			},
			
			/**
			 * Renvoi la quantité de phéromones à l'emplacement donné
			 */
			ilYADesPheromones: function (x, y, typePheromone) {
				if (typePheromone === JSFOURMIS.TypesPheromones.NOURRITURE) {
					return this.localisePheromonesNourriture[x + y * this.width];
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
				pheromones: this.pheromones,
				nourritures: this.nourritures,
				fourmis : this.fourmis
			},

			/**
			 * Boucle principale
			 */
			main : function() { 
				JSFOURMIS.Kanvas.compteurCycles++;
				this.effaceTout();

				$info('nourriture_restante', this.entites.nourritures.length);
				$info('nourriture_totale_restante', JSFOURMIS.Nourriture.total);

				for ( var i = this.fourmis.length -1; i >=0; i--) {
					if(this.ilYADeLaNourriture(this.fourmis[i].x, this.fourmis[i].y)) {
						this.fourmis[i].ramasseLaNourriture();
					} 
					// arrivé à la fourmilière  
					else if (this.fourmis[i].x === this.foyer.x && this.fourmis[i].y === this.foyer.y) {
						this.fourmis[i].deposeLaNourriture();
					}
					this.fourmis[i].avance();
				}

				for (i = this.entites.fourmis.length -1; i >=0; i--) {
					this.entites.fourmis[i].age++;
					if (this.entites.fourmis[i].doitMourir()) {
						this.entites.fourmis[i].meurt();
					}
				}
				
				if (this.entites.pheromones!=null &&
					JSFOURMIS.Parametres.DUREE_PHEROMONES_NOURRITURE.valeur !== JSFOURMIS.ILLIMITE ) {
					for (i = this.entites.pheromones.length -1; i >=0; i--) {
						this.entites.pheromones[i].duree--;
						if (this.entites.pheromones[i].duree === 0) {
							this.entites.pheromones[i].preleve();
						}
					}
				}
				this.dessineTout();
				
				$info('nourriture_par_cycles', (JSFOURMIS.Kanvas.BouffeRameneeTotal / JSFOURMIS.Kanvas.compteurCycles)|0);  
				 
				
				if (this.running) {
					// Cycles infinis = vitesse normale
					if (this.nbCycles == JSFOURMIS.ILLIMITE) {
						window.setTimeout(function(thisObj) { thisObj.main(); }, this.delaiCycle, this);
						
					// Cycles définis = aussi rapide que possible.  
					} else if (JSFOURMIS.Kanvas.compteurCycles <= this.nbCycles ) {
						window.setTimeout(function(thisObj) { thisObj.main(); }, 0, this);
						
					// Terminée.
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
				quantite: {
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
						x: ev.clientX - this.navigateur.totalCanvasOffset.left,
						y: ev.clientY - this.navigateur.totalCanvasOffset.top
					};					
				},
				
				onOver: function(ev) {
					this.curseur.estSurLeCanvas = true;
				},
				
				onOut: function(ev) {
					this.curseur.estSurLeCanvas = false;
				},
				
				onClick: function(ev){
					var x = ev.clientX - this.navigateur.totalCanvasOffset.left;
					var y = ev.clientY - this.navigateur.totalCanvasOffset.top;
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
				totalCanvasOffset: {left:0, top:0 },
				startTime: 0
			},
			
			premiereFois: true,
			
			/**
			 * Initialisation Déclenché au clic du bouton start
			 */
			start : function() {
				if(!this.premiereFois) this.reset();
				 
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

				var nbfourmis = JSFOURMIS.Parametres.nbFourmis.valeur;
				this.nbCycles = JSFOURMIS.Parametres.nbCycles.valeur;
				this.nourriture.nbInitialDePoints = JSFOURMIS.Parametres.nourriture_nbInitialDePoints.valeur;
				this.nourriture.nombreParPoint.min = JSFOURMIS.Parametres.nourriture_nombreParPoint_min.valeur;
				this.nourriture.nombreParPoint.max = JSFOURMIS.Parametres.nourriture_nombreParPoint_max.valeur;
				this.delaiCycle = JSFOURMIS.Parametres.delaiCycle.valeur;
				
				// Curseur & autre broutilles "systeme"
				this.curseur.matrice = new JSFOURMIS.Matrice(7,7,[
									0,0,1,1,1,0,0,
									0,1,0,0,0,1,0,
									1,0,0,1,0,0,1,
									1,0,1,1,1,0,1,
									1,0,0,1,0,0,1,
									0,1,0,0,0,1,0,
									0,0,1,1,1,0,0]).agrandir(3);

				this.navigateur.totalCanvasOffset = $totalOffset(this.canvas);
				if(this.premiereFois) { 
					this.canvas.addEventListener('mousemove', bind(this, this.mouse.onMove), false);
					this.canvas.addEventListener('mouseover', bind(this, this.mouse.onOver), false);
					this.canvas.addEventListener('mouseout', bind(this, this.mouse.onOut), false);
					this.canvas.addEventListener('click', bind(this, this.mouse.onClick), false);
				}

				// A chaque nouveau départ, on ré-init le compteur
				JSFOURMIS.Kanvas.compteurCycles = 0;

				//var options = {x:50, y:70, hauteur:21, largeur:31};
				//this.entites.obstacles[0]=new JSFOURMIS.Obstacle(this,options);
				
				// Initialisation des localisateurs de bouffe et de phéromones
				for (var y=0; y<this.height; y++) {
					for (var x=0; x<this.width; x++) {
						this.localiseNourriture[x + y * this.width] = 0;
						this.localisePheromonesNourriture[x + y * this.width] = 0;
					}
				}
				
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
			
			/**
			 * Tableau des JSFOURMIS.Nourriture
			 */
			nourritures: [],
			
			/**
			 * Tableau des JSFOURMIS.Pheromone
			 */
			pheromones : [],
			
			/**
			 * Tableau des JSFOURMIS.Obstacle
			 */
			obstacles: [],

			/**
			 * Stoppe l'écoulement des cycles
			 */
			stop : function() {
				this.running = false;
				this.premiereFois = false;
			},
			
			reset: function () {
				JSFOURMIS.Kanvas.compteurCycles = 0;
				this.effaceTout();
				for(var nom_entite in this.entites) {
					this.entites[nom_entite].length = 0;
				}
				// Réinitialisation des localisateurs de bouffe et de phéromones
				for (var y=0; y<this.height; y++) {
					for (var x=0; x<this.width; x++) {
						this.localiseNourriture[x + y * this.width] = 0;
						this.localisePheromonesNourriture[x + y * this.width] = 0;
					}
				}
			}
		};
		
		JSFOURMIS.Kanvas.BouffeRameneeCeCycle = 0;
		JSFOURMIS.Kanvas.BouffeRameneeTotal = 0;
})();
