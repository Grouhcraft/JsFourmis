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
	JSFOURMIS.Nourriture = function(kanvasObj, parentObj) {
		parentObj = parentObj || kanvasObj;
		this.kanvasObj = kanvasObj;
		this.parentObj = parentObj;
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
			return true; /* @TODO: sauf si transporté par une fourmi, etc.. */
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