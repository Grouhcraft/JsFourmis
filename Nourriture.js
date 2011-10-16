/*******************************************************************************
 * ---------------------------------------------------
 * 
 * @class Nourriture (pour donner à manger aux fourmis)
 *        ----------------------------------------------------
 */
var JSFOURMIS = JSFOURMIS || {};
(function(){
	/**
	 * Constructeur
	 * 
	 * @param kanvasObj:
	 *            instance de JSFOURMIS.Kanvas appellante (son "this" quoi)
	 * @param parentObj:
	 *            instance de l'objet dans lequel se trouve la nourriture.
	 */
	JSFOURMIS.Nourriture = function(kanvasObj, parentObj, quantite, x, y) {
		parentObj = parentObj || kanvasObj;
		
		this.kanvasObj = kanvasObj;
		this.parentObj = parentObj;
		this.quantite = quantite || 1;
		this.x = x || 0;
		this.y = y || 0;
		
		// déssiné que si non-transporté, etc..
		this.prop_estDessinable = this.parentObj instanceof JSFOURMIS.Kanvas;
		
		if (this.parentObj instanceof JSFOURMIS.Kanvas) {
			this.kanvasObj.localiseNourriture[this.x + this.y * this.kanvasObj.width] += this.quantite;
			JSFOURMIS.Nourriture.total += this.quantite;
		}
	};
	
	/**
	 * Méthodes publiques
	 */
	JSFOURMIS.Nourriture.prototype = {
		kanvasObj : {},
		parentObj : {},
		couleur : function() {/* @TODO: dépend de la quantité */
		},
		x : 0,
		y : 0,
		quantite : 0,
		
		// déssiné que si non-transporté, etc..
		prop_estDessinable: true,	
		estDessinable : function() {
			this.prop_estDessinable = this.parentObj instanceof JSFOURMIS.Kanvas;
			return this.prop_estDessinable;
		},
		
		preleve: function (quantite) {
			if(quantite > this.quantite) {
				throw ("Impossible de prélever plus de nourriture que ce que y'en a voyons !");
			}
			else {
				this.kanvasObj.localiseNourriture[this.x + this.y * this.kanvasObj.width] -= quantite;
				JSFOURMIS.Nourriture.total -= quantite;
				if (quantite < this.quantite) {
					this.quantite -= quantite;
				}
				else {
					this.meurt();
				}
			}
		},
		
		meurt : function() {
			for(var i=0; i<this.kanvasObj.entites.nourritures.length; i++) {
				if(this.kanvasObj.entites.nourritures[i].x === this.x &&
					this.kanvasObj.entites.nourritures[i].y === this.y ) {
						this.kanvasObj.entites.nourritures.splice(i,1);		
						break;				
					}
			}
		},

		dessine : function() {/* @TODO */
			var data = [0,1,1,1,0,
						1,0,0,0,1,
						1,0,1,0,1,
						1,0,0,0,1,
						0,1,1,1,0];
			var matrice = new JSFOURMIS.Matrice(5,5,data);
			this.kanvasObj.dessineForme(matrice, this.x, this.y, { r:0, g:127, b:0, a:0xff }); // FIXME: couleur provisoire
		}
	};
	
	JSFOURMIS.Nourriture.total = 0;
})();