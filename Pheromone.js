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
		
		/**
		 * Couleur de + en + fonçé avec la quantité de pheromones
		 */
		couleur: function(){
			var intensite = 220;
			for(var i=this.quantite; i >=0 && intensite >= 0; i--) {
				intensite -= 20;
			}
			return { r:intensite, g:intensite, b:intensite, a:0xff };
		},
		 
		numero: 0,
		quantite: 0,
		duree: 0,
		
		estDessinable: function() {
			return true;
		},
		
		matrice: {},
		dessine: function () {
			this.kanvasObj.dessineForme(this.matrice, this.x, this.y, this.couleur());
		},
		
		/**
		 * Renforce la pheromone (typiquement, une fourmi passe sur une pheromone pré-existante)
		 */
		renforce: function() {
			this.quantite++;
			//this.duree = JSFOURMIS.Parametres.DUREE_PHEROMONES_NOURRITURE.valeur;
			if (this.type === JSFOURMIS.TypesPheromones.NOURRITURE) {
				this.kanvasObj.localisePheromonesNourriture[this.x + this.y * this.kanvasObj.width]++;
			}
		},
		
		preleve: function() {
			if (this.type === JSFOURMIS.TypesPheromones.NOURRITURE) {
				this.kanvasObj.localisePheromonesNourriture[this.x + this.y * this.kanvasObj.width]--;
				this.quantite--;
				this.duree = JSFOURMIS.Parametres.DUREE_PHEROMONES_NOURRITURE.valeur;
			}
			if(this.quantite === 0) {
				this.disparait();
			}
		},
		
		/**
		 * Fait disparaître la phéromone.
		 */
		disparait : function() {
			if (this.type === JSFOURMIS.TypesPheromones.NOURRITURE) {
				this.kanvasObj.localisePheromonesNourriture[this.x + this.y * this.kanvasObj.width] -= this.quantite;
			}
			this.kanvasObj.entites.pheromones.splice(this.numero,1);
			for (var i=this.numero; i<this.kanvasObj.entites.pheromones.length; i++) {
				this.kanvasObj.entites.pheromones[i].numero--;
			}
		},
	};
	
})();
