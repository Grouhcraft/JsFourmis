/*******************************************************************************
 * ---------------------------------------------------
 * 
 * @class Nourriture (pour donner � manger aux fourmis)
 *        ----------------------------------------------------
 */

(function(){
{
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
 * M�thodes publiques
 */
JSFOURMIS.Nourriture.prototype = {
	kanvasObj : {},
	parentObj : {},
	couleur : function() {/* @TODO: d�pend de la quantit� */
	},
	x : 0,
	y : 0,
	quantitee : 0,
	estDessinable : function() {
		return true; /* @TODO: sauf si transport� par une fourmi, etc.. */
	},
	dessine : function() {/* @TODO */
	}
};
})();