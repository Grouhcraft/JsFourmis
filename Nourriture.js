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
	JSFOURMIS.Nourriture = function(kanvasObj, parentObj, quantitee) {
		parentObj = parentObj || kanvasObj;
		
		this.kanvasObj = kanvasObj;
		this.parentObj = parentObj;
		this.quantitee = quantitee || 1;
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
		quantitee : 0,
		estDessinable : function() {
			// Déssiné que si gisant sur le kanvas
			if(! this.parentObj instanceof JSFOURMIS.Kanvas) {
				return false;
			} else {
				return true;
			}
		},
		
		preleve: function (quantitee) {
			if(quantitee > this.quantitee) {
				throw ("Impossible de prélever plus de nourriture que ce que y'en a voyons !");
			}
			else if (quantitee < this.quantitee) {
				this.quantitee--;
			}
			else {
				this.meurt();
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
})();