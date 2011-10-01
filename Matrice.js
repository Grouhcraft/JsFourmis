// Portée locale
/*******************************************************************************
 * ---------------------------------------------------
 * 
 * @class Matrix Classe statique "boite à outil" pour manipuler les formes,
 *        etc.. ----------------------------------------------------
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
			agrandi = new JSFOURMIS.Matrice(coeff * this.h, coeff * this.w,
					array());

			for (x = 0; x < this.h; x++) {
				for (y = 0; y < this.w; y++) {
					for (n = 0; n < coeff; n++) {
						agrandi.setvalue(x*coeff+n, y*coeff+n, this.getvalue(x, y));
					}
				}
			}
			return agrandi;
		}
	}

})();
// Fin du scope locale
