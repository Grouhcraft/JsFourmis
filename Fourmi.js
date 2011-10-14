/** ---------------------------------------------------
 * 
 * @class Fourmi Fait tout ce que fait une fourmi :)
 * 
 * ----------------------------------------------------
 */
var JSFOURMIS = JSFOURMIS || {};
(function() {
	/**
	 * Constructeur On la place dans la fourmilière, sans direction précise.
	 * 
	 * @param kanvasObj:
	 *            instance de JSFOURMIS.Kanvas appellante (son "this" quoi)
	 */
	JSFOURMIS.Fourmi = function(kanvasObj, options) {
		options = options || {};
		this.kanvasObj = kanvasObj;
		this.direction = JSFOURMIS.Directions.AUCUNE;
		this.x = this.kanvasObj.foyer.x;
		this.y = this.kanvasObj.foyer.y;
		
		this.numero = options.numero || 0;
	};
	/**
	 * Méthodes publiques
	 */
	JSFOURMIS.Fourmi.prototype = {
		kanvasObj: {},		// cf. Constructeur
		numero: 0,			// sorte d'ID de la fourmis, //TODO: Doc ici meme
		x : 0,				// Position x de la fourmi
		y : 0,				// Position y de la fourmi
		aller: true,		// Indique si la fourmi cherche..
		retour : false,		// ..ou si elle revient à la fourmilière (consciemment s'entend)
		direction : null,	// Direction de la fourmi. cf. l'Enum "JSFOURMIS.Direction"
		nourritures : [],	// instances des "Nourriture" transportées
		age : 0,			// Age de la fourmi (en Cycles)
		vivante: true,
		test: false,
		
		/**
		 * Déplacement de la fourmi
		 */
		deplacement: {
			chancesDeFaireDemiTour: 3, 
			chanceDeChangerDeDirection: 8,
			distanceAParcourirParFourmis: 1
		},
		
		/*
		 * Couleur de la fourmi
		 */
		couleur : function(){
			if(this.test) {
				return { r:128, g:0, b:128, a:0xff };
			}
			else {
				if(this.aller) { 
					return { r:0, g:0, b:254, a:0xff };
				} else {
					return { r:254, g:0, b:0, a:0xff };
				}
			}
		},

		/**
		 * Indique si la fourmi doit mourir (parcequ'elle est trop vielle par
		 * exemple)
		 * 
		 * @return: booléen
		 */
		doitMourir : function() {
			// ...if(this.age)...
			return false;
		},

		/**
		 * Fait mourir la fourmi.
		 */
		meurt : function() {
			this.vivante = false;
			this.kanvasObj.entites.fourmis.splice(this.numero,1);
			for (var i=this.numero; i<this.kanvasObj.entites.fourmis.length; i++) {
				this.kanvasObj.entites.fourmis[i].numero--;
			}
		},

		/**
		 * La fourmi est-elle dessinable ? Exemple: on peut vouloir une fourmi
		 * "fantôme", ou encore une fourmi "pré-parametrée" pour plus tard, ou
		 * filtrer l'affichage par type de fourmis, ou que sais-je encore.. Par
		 * défaut, une fourmi est dessinable.
		 * 
		 * @return booléen
		 */
		estDessinable : function() {
			return this.vivante;
		},
		
		/**
		 * Fait avancer la fourmi (pour un cycle).
		 * Déroulement:
		 * 1- Si la fourmi n'a pas de direction, on lui en donne une au pif 
		 * 2- La fourmi à un % (faible) de chance de faire demi-tour
		 * 3- Si la fourmi ne fait pas demi-tour, % de chance d'aller sur le côté
		 * 4- On demande à la fourmi d'avancer.
		 */
		avance : function() {
			if(this.aller) { // Recherche de nourriture
				
				// Déjà dans une direction ?
				if(this.direction == JSFOURMIS.Directions.AUCUNE) {
					this.direction = this.choisiUneDirectionAuHasard();
				} 
				else { // Oui..
					
					// Nourriture ou phéromones ? à proximité ? alors on se place dans sa direction
					var aTrouveUneDirectionInteressante = false;

					var limitesVision = this.limitesVision();
					for (var i=limitesVision.minX; i<limitesVision.maxX; i++) {
						for (var j=limitesVision.minY; j<limitesVision.maxY; j++) {
							// Nourriture ?
							if(this.kanvasObj.ilYADeLaNourriture(i, j)) {
								this.direction = this.directionParRapport(i, j, limitesVision.minX, limitesVision.maxX, limitesVision.minY, limitesVision.maxY);
								aTrouveUneDirectionInteressante = true;
								break;
							}
							// de 2ème importance apres la bouffe: Phéromones ?
							else if (this.kanvasObj.ilYADesPheromones(i, j, JSFOURMIS.TypesPheromones.NOURRITURE)) {
								this.direction = this.directionParRapport(i, j, limitesVision.minX, limitesVision.maxX, limitesVision.minY, limitesVision.maxY);
								aTrouveUneDirectionInteressante = true;
								break;							
							}
						}
					}
					
					// Pas trouvé de bouffe..
					if(!aTrouveUneDirectionInteressante) {	 
						
						// Déplacement aléatoire
						if(this.kanvasObj.random(1,100) < this.deplacement.chancesDeFaireDemiTour) {
							 this.direction = - this.direction;
						} else if(this.kanvasObj.random(1,100) < this.deplacement.chanceDeChangerDeDirection) {
							var nouvelleDirection = this.direction; 
							while(nouvelleDirection == this.direction || nouvelleDirection == - this.direction) {
								nouvelleDirection = this.choisiUneDirectionAuHasard();
							}
							this.direction = nouvelleDirection; 
						}
					}
				}
				
			} else { // Retour à la fourmilière (this.aller == false)
				 
				this.direction = this.directionVersFoyer();
				if (this.age % JSFOURMIS.Parametres.PAS_PHEROMONES_NOURRITURE.valeur === 0) {
					this.posePheromone(
						JSFOURMIS.TypesPheromones.NOURRITURE,
						JSFOURMIS.Parametres.DUREE_PHEROMONES_NOURRITURE.valeur);
				}
			}
			
			var pos = this.prochainePosition(this.deplacement.distanceAParcourirParFourmis);
			var directionsExclues = [];
			var limiteSecurite=50; 
			var compteur=0;
			
			// Lorsque l'on touche le bord ou un obstacle, on change de direction
			while (!this.kanvasObj.estDansLaZone(pos.x, pos.y) || 
					this.rencontreObstacle(pos.x, pos.y) ||
					compteur > limiteSecurite ) {
						
				var dir = this.direction;
				directionsExclues.push(dir);
				this.direction = this.choisiUneDirectionAuHasardSauf(directionsExclues);
				if (this.direction==JSFOURMIS.Directions.AUCUNE) {
					break;
				}
				pos = this.prochainePosition(this.deplacement.distanceAParcourirParFourmis);
				compteur++;
			}
			
			// effectue son pas.
			this.avanceDansSaDirection(this.deplacement.distanceAParcourirParFourmis);
		},
		
		/**
		 * Comme son titre l'indique, choisi
		 * une direction au hasard parmis JSFOURMIS.Directions
		 */
		choisiUneDirectionAuHasard: function() {
			var xOuY = this.kanvasObj.random(1, 100);
			var moinsOuPlus = this.kanvasObj.random(1, 100);
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
		
		choisiUneDirectionAuHasardSauf: function(directionsExclues) {
			if (directionsExclues==null||directionsExclues.length==0) {
				return this.choisiUneDirectionAuHasard();
			}
			if (directionsExclues.length>=4) {
				return JSFOURMIS.Directions.AUCUNE;
			}
			var directionsRestantes = [
						JSFOURMIS.Directions.NORD,
						JSFOURMIS.Directions.SUD,
						JSFOURMIS.Directions.EST,
						JSFOURMIS.Directions.OUEST
					];
			for (var j = directionsExclues.length-1; j>=0; j--) {
					for (var i=directionsRestantes.length-1; i>=0; i--) {
						if (directionsRestantes[i]==directionsExclues[j]) {
							directionsRestantes.splice(i,1);
						}
					}
			}
			if(directionsRestantes.length==1) {
				return directionsRestantes[0];
			}
			var randomSample = this.kanvasObj.random(1,50*directionsRestantes.length);
			if (randomSample<=50) {
				return directionsRestantes[0];
			}
			else {
				if (randomSample<=100) {
					return directionsRestantes[1];
				}
				else {
					return directionsRestantes[2];
				}
			}
		},
		
		/**
		 *  Avance de <distance> dans la direction enregistrée
		 */
		avanceDansSaDirection: function (distance) {
			distance = distance || 1;
			var x = this.x;
			var y = this.y;
			switch(this.direction) {
				case JSFOURMIS.Directions.NORD:		y-=distance; break;
				case JSFOURMIS.Directions.SUD:		y+=distance; break; 
				case JSFOURMIS.Directions.EST:		x-=distance; break;
				case JSFOURMIS.Directions.OUEST:	x+=distance; break;
				case JSFOURMIS.Directions.AUCUNE:
					//throw("Aucune direction n'est encore fixée..");
					break;
			};
			this.x = x;
			this.y = y;
		},
		
		rencontreObstacle: function(x, y)  {
			var hauteur;
			var largeur;
			for (var i = this.kanvasObj.entites.obstacles.length -1; i >= 0; i--) {
				if (this.direction === JSFOURMIS.Directions.EST || 
					this.direction === JSFOURMIS.Directions.OUEST) {
					hauteur = 5;
					largeur = 7;
				}
				else {
					hauteur = 7;
					largeur = 5;
				}
				if (this.kanvasObj.entites.obstacles[i].bloqueEmplacement(x,y,hauteur,largeur)) {
					return true;
				}
			}
			return false;
		},
		
		deposeLaNourriture: function () {
			this.retour = false;
			this.aller = true;
			
			///TODO: deposer la bouffe
			// En attendant.. = ==
			for(var i=0; i<this.nourritures.length; i++) {
				delete this.nourritures;
				this.nourritures = [];
			}
			/// == == == == == ==
		},
		
		ramasseLaNourriture: function() {
			if(!this.kanvasObj.ilYADeLaNourriture(this.x, this.y)) {
				throw('Fourmi #' + this.numero + ' dit: Je ne peux pas ramasser de nourriture ici, y\'en à pas..');
			}
			this.aller = false;
			this.retour = true;
			
			var nourritureTransportee = new JSFOURMIS.Nourriture(this.kanvasObj, this, 1);
			this.nourritures.push(nourritureTransportee);
			for(var i=0; i<this.kanvasObj.entites.nourritures.length; i++ ) {
				if(this.kanvasObj.entites.nourritures[i].x === this.x && this.kanvasObj.entites.nourritures[i].y === this.y) {
					this.kanvasObj.entites.nourritures[i].preleve(1);
					break;
				}
			}
		},
		
		directionVersFoyer: function() {
			var fx = this.kanvasObj.foyer.x;
			var fy = this.kanvasObj.foyer.y;
			var ecart_x = this.x - fx;
			var ecart_y = this.y - fy;
			var direction;
			
			if(Math.abs(ecart_x) > Math.abs(ecart_y)) {
				if(this.x < fx ) {
					direction = JSFOURMIS.Directions.OUEST;
				} else {
					direction = JSFOURMIS.Directions.EST;
				}
			} else {
				if(this.y < fy ) {
					direction = JSFOURMIS.Directions.SUD;
				} else {
					direction = JSFOURMIS.Directions.NORD;
				}
			}
			return direction;
		},
		
		/**
		 * Retourne les coordonnées de la prochaine position
		 * @return {x,y} 
		 */
		prochainePosition : function (distance)
		{
			switch (this.direction) {
				case JSFOURMIS.Directions.NORD:		return {x : this.x, y : this.y-distance};
				case JSFOURMIS.Directions.SUD:		return {x : this.x, y : this.y+distance};  
				case JSFOURMIS.Directions.EST:		return {x: this.x-distance, y : this.y};
				case JSFOURMIS.Directions.OUEST:	return {x: this.x+distance, y : this.y};
				default:							return {x: this.x, y : this.y};
			}
		},
		
		/**
		 * Dessine la fourmi. Définit la forme de la fourmi, et apelle la
		 * méthode de JSFOURMIS.Kanvas de dessin de forme (dessineForme()) avec
		 * la bonne position, forme, et couleur.
		 * 
		 * @param x
		 * @param y
		 */
		dessine : function() {
			var data = [];
			// 2 coups sur 4, on change la position
			// des p'tites pattes de fourmis
			if(this.age % 4 > 1) {
				data = [0,1,1,1,0,
						0,1,1,1,0,
						0,0,1,0,1,
						1,1,1,1,0,
						0,0,1,0,0,
						0,1,1,1,1,
						1,0,1,0,0];
			} else {
				data = [0,1,1,1,0,
						0,1,1,1,0,
						1,0,1,0,0,
						0,1,1,1,1,
						0,0,1,0,0,
						1,1,1,1,0,
						0,0,1,0,1];				
			}
			var matrice = new JSFOURMIS.Matrice(7,5,data);
			var angle = null; 
			
			// On tourne la fourmi selon sa direction
			switch(this.direction) {
				case JSFOURMIS.Directions.NORD:
				case JSFOURMIS.Directions.AUCUNE:		
				break;
				case JSFOURMIS.Directions.SUD:	angle = JSFOURMIS.AnglesRotation.DEMITOUR ; break; 
				case JSFOURMIS.Directions.OUEST:angle = JSFOURMIS.AnglesRotation.GAUCHE ; break;
				case JSFOURMIS.Directions.EST:	angle = JSFOURMIS.AnglesRotation.DROITE ; break;
			}
			if(angle !== null) {
				matrice.rotation(angle);
			}
			this.kanvasObj.dessineForme(matrice, this.x, this.y, this.couleur());
			// Test : dessin du champ de vision
			//this.dessineChampVision();
		},
		
		/**
		 * Retourne les limites min et max en x et en y du champ de vision
		 * note: la fourmi DOIT avoir une direction (!= aucune), sinon elle est aveugle
		 * @return <code>{minX, maxX, minY, maxY}</code>
		 */
		limitesVision : function(){
			var versAvant = JSFOURMIS.Parametres.fourmi_vision_versAvant.valeur;
			var distance = JSFOURMIS.Parametres.fourmi_vision_rayon.valeur;
			var minX, minY, maxX, maxY;
			switch(this.direction) {
				case JSFOURMIS.Directions.NORD :
					minX = this.x-distance;
					maxX = this.x+distance+1;
					minY = this.y-distance-versAvant;
					maxY = this.y-versAvant;
					break;
				case JSFOURMIS.Directions.SUD :
					minX = this.x-distance;
					maxX = this.x+distance+1;
					minY = this.y+versAvant;
					maxY = this.y+versAvant+distance;
					break;
				case JSFOURMIS.Directions.EST : // attention, l'est c'est l'ouest et inversement
					minX = this.x-versAvant-distance;
					maxX = this.x-versAvant;
					minY = this.y-distance;
					maxY = this.y+distance+1;
					break;
				case JSFOURMIS.Directions.OUEST:
					minX = this.x+versAvant;
					maxX = this.x+versAvant+distance;
					minY = this.y-distance;
					maxY = this.y+distance+1;
					break;
				default :
					minX = this.x;
					maxX = this.x;
					minY = this.y;
					maxY = this.y;
			}
			return {minX: minX, maxX: maxX, minY: minY, maxY: maxY};
		},
		
		/**
		 * Détermine dans quelle direction la fourmi doit s'orienter pour aller vers le point de coordonnées (i,j)
		 * situé dans le rectangle [minX, maxX, minY, maxY] qui constitue son champ de vision
		 */
		directionParRapport : function (i, j, minX, maxX, minY, maxY) {
			switch(this.direction) {
			case JSFOURMIS.Directions.NORD :
				if(maxY-j<=this.x-i) {
					return JSFOURMIS.Directions.EST;
				}
				else {
					if(maxY-j>i-this.x) {
						return JSFOURMIS.Directions.NORD;
					}
					else {
						return JSFOURMIS.Directions.OUEST;
					}
				}
				break;
			case JSFOURMIS.Directions.SUD :
				if(j-minY<this.x-i) {
					return JSFOURMIS.Directions.EST;
				}
				else {
					if(j-minY>=i-this.x) {
						return JSFOURMIS.Directions.SUD;
					}
					else {
						return JSFOURMIS.Directions.OUEST;
					}
				}
				break;
			case JSFOURMIS.Directions.EST :
				if(maxX-i<=this.y-j) {
					return JSFOURMIS.Directions.NORD;
				}
				else {
					if(maxX-i>j-this.y) {
						return JSFOURMIS.Directions.EST;
					}
					else {
						return JSFOURMIS.Directions.SUD;
					}
				}
				break;
			case JSFOURMIS.Directions.OUEST:
				if(i-minX<this.y-j) {
					return JSFOURMIS.Directions.NORD;
				}
				else {
					if(i-minX>=j-this.y) {
						return JSFOURMIS.Directions.OUEST;
					}
					else {
						return JSFOURMIS.Directions.SUD;
					}
				}
				break;
			default : 
				return this.direction;
			}
			return this.direction;
		},
		
		/**
		 * Permet de tester la/les fonction(s) qui calcule(nt) le champ de vision
		 */
		dessineChampVision : function () {
			var limitesVision = this.limitesVision();
			for (var i=limitesVision.minX; i<limitesVision.maxX; i++) {
				for (var j=limitesVision.minY; j<limitesVision.maxY; j++) {
					if (this.directionParRapport(i, j, limitesVision.minX, limitesVision.maxX, limitesVision.minY, limitesVision.maxY) == JSFOURMIS.Directions.NORD) {
						this.kanvasObj.setPixel(i, j, { r:128, g:255, b:0, a:0xff });
					}
					else {
						if (this.directionParRapport(i, j, limitesVision.minX, limitesVision.maxX, limitesVision.minY, limitesVision.maxY) == JSFOURMIS.Directions.SUD) {
							this.kanvasObj.setPixel(i, j, { r:255, g:128, b:0, a:0xff });
						}
						else
						{
							if(this.directionParRapport(i, j, limitesVision.minX, limitesVision.maxX, limitesVision.minY, limitesVision.maxY) == JSFOURMIS.Directions.EST) {
								this.kanvasObj.setPixel(i, j, { r:200, g:200, b:200, a:0xff });
							}
							else {
								this.kanvasObj.setPixel(i, j, { r:200, g:200, b:0, a:0xff });
							}
						}
					}
				}
			}
		},
		
		/**
		 * Pose une phéromone à l'emplacement actuel de la fourmi
		 */
		posePheromone:function (type, duree) {
			var options = {type: type, duree: duree, x: this.x, y : this.y};
			this.kanvasObj.entites.pheromones.push(new JSFOURMIS.Pheromone(this.kanvasObj, options));
		}
	};
})();