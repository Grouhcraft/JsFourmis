/** ---------------------------------------------------
 * 
 * @class Pheromone
 * 
 * ----------------------------------------------------
 */
var JSFOURMIS = JSFOURMIS || {};
(function() {
	JSFOURMIS.Pheromone = function (kanvasObj, options){
		this.kanvasObj = kanvasObj;
		options = options || {};
		this.quantite = options.quantite || 1;
		this.type = options.type || JSFOURMIS.TypesPheromones.ALLER;
		this.x = options.x || 0;
		this.y = options.y || 0;
		this.duree = options.duree || -1;
		this.numero = this.kanvasObj.entites.pheromones.length;
		if (this.type == JSFOURMIS.TypesPheromones.ALLER) {
			this.couleur = { r:220, g:100, b:220, a:0xff };
		}
		this.matrice = new JSFOURMIS.Matrice(1,1,[1]);
		if (this.type==JSFOURMIS.TypesPheromones.NOURRITURE) {
			this.kanvasObj.localisePheromonesNourriture[this.x + this.y * this.kanvasObj.width]++;
		}
	};
	
	JSFOURMIS.Pheromone.prototype = {
		kanvasObj: {},
		x: 0,
		y: 0,
		couleur: { r:200, g:200, b:0, a:100 }, // jaune
		numero: 0,
		quantite: 0,
		duree: 0,
		
		estDessinable: function() {
			return true;
		},
		
		matrice: {},
		dessine: function () {
			this.kanvasObj.dessineForme(this.matrice, this.x, this.y, this.couleur);
		},
		
		/**
		 * Fait disparaître la phéromone.
		 */
		disparait : function() {
			if (this.type==JSFOURMIS.TypesPheromones.NOURRITURE) {
				this.kanvasObj.localisePheromonesNourriture[this.x + this.y * this.kanvasObj.width]--;
			}
			this.kanvasObj.entites.pheromones.splice(this.numero,1);
			for (var i=this.numero; i<this.kanvasObj.entites.pheromones.length; i++) {
				this.kanvasObj.entites.pheromones[i].numero--;
			}
		},
	};
	
})();
