/**
 * Dessine une matrice. Typiquement la matrice d'une entité.
 * ----------------------------------------------------------
 * @class Matrice Classe statique "boite à outil" pour manipuler les formes,
 * 
 * Une matrice est un objet {} doté de 3 propriétés: 
 * w: la largeur de la matrice
 * h: la hauteur de la matrice 
 * data: un tableau *à une dimension* représentant ses coefficients.
 * data doit contenir soit 1: plein, soit 0: vide. 
 * Exemple d'une forme de croix: 
 * <code>
 * var croix = { 
 *		h: 3, w: 3,
 *		data: [	0,1,0,
 *				1,1,1,
 *				0,1,1 ] };
 * </code>
 */
var JSFOURMIS = JSFOURMIS || {};
(function() {

	JSFOURMIS.Matrice = function(h, w, data) {
		this.h = h;
		this.w = w;
		this.data = data;
	};

	/**
	 * Méthodes publiques
	 */
	JSFOURMIS.Matrice.prototype = {
		h : 0,
		w : 0,
		data : [],

		getvalue : function(x, y) {
			return this.data[x * this.w + y];
		},

		setvalue : function(x, y, val) {
			this.data[x * this.w + y] = val;
		},

		size : function() {
			return this.h * this.w;
		},

		agrandir : function(coeff) {
			coeff = parseInt(coeff, 10);
			if (coeff < 1) { return null; }
			if (coeff == 1) { return this; }
			var agrandi = new JSFOURMIS.Matrice(coeff * this.h, coeff * this.w, []);

			for (var n = 0; n < coeff; n++) {
				for (var m = 0; m < coeff; m++) {
					for (var x = 0; x < this.h; x++) {
						for (var y = 0; y < this.w; y++) {

							agrandi.setvalue(x * coeff + n, y * coeff + m, this
									.getvalue(x, y));
						}
					}
				}
			}
			return agrandi;
		},
		
		rotation : function(angle) {
			var tourne, x, y;
		
			if (angle==JSFOURMIS.AnglesRotation.DROITE) {
				tourne = new JSFOURMIS.Matrice(this.w, this.h, []);
				for (x = 0; x < this.h; x++) {
					for (y = 0; y < this.w; y++) {
						tourne.setvalue(y, x, this.getvalue(x, y));
					}
				}
				return tourne;
			}
			if (angle==JSFOURMIS.AnglesRotation.DEMITOUR) {
				tourne = new JSFOURMIS.Matrice(this.h, this.w, []);
				for (x = 0; x < this.h; x++) {
					for (y = 0; y < this.w; y++) {
						tourne.setvalue(this.h-x-1, this.w-y-1, this.getvalue(x, y));
					}
				}
				return tourne;
			}
			if (angle==JSFOURMIS.AnglesRotation.GAUCHE) {
				tourne = new JSFOURMIS.Matrice(this.w, this.h, []);
				for (x = 0; x < this.h; x++) {
					for (y = 0; y < this.w; y++) {
						tourne.setvalue(this.w-y-1, this.h-x-1, this.getvalue(x, y));
					}
				}
				return tourne;
			}
			return null;
		}
	};
})();
// Fin du scope locale
