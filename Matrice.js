/**
 * Dessine une matrice. Typiquement la matrice d'une entité.
 * /*******************************************************************************
 * ---------------------------------------------------
 * 
 * @class Matrice Classe statique "boite à outil" pour manipuler les formes,
 *        etc.. ----------------------------------------------------
 * 
 * Une matrice est un objet {} doté de 3 propriétés: 
 * w: la largeur de la matrice
 * h: la hauteur de la matrice 
 * data: un tableau *à une dimension* représentant ses coefficients.
 * data doit contenir soit 1: plein, soit 0: vide. 
 * Exemple d'une matrice en forme de croix: <code>
 * var croix = { 
 *		h: 3, w: 3,
 *		data: [	0,1,0,
 *				1,1,1,
 *				0,1,1 ] };
 * </code>
 */
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
			coeff = parseInt(coeff);
			if (coeff < 1)
				return null;
			if (coeff == 1)
				return this;
			agrandi = new JSFOURMIS.Matrice(coeff * this.h, coeff * this.w, []);

			for (n = 0; n < coeff; n++) {
				for (m = 0; m < coeff; m++) {
					for (x = 0; x < this.h; x++) {
						for (y = 0; y < this.w; y++) {

							agrandi.setvalue(x * coeff + n, y * coeff + m, this
									.getvalue(x, y));
						}
					}
				}
			}
			return agrandi;
		}
	}

})();
// Fin du scope locale
