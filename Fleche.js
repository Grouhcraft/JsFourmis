/*******************************************************************************
 * ---------------------------------------------------
 * 
 * @class Fourmi Fait tout ce que fait une fourmi :)
 *        ----------------------------------------------------
 */

(function() {

	/**
	 * Constructeur On la place dans la direction passée en paramètre.
	 * 
	 * @param kanvasObj:
	 *            instance de JSFOURMIS.Kanvas appellante (son "this" quoi)
	 */
	JSFOURMIS.Fleche = function(kanvasObj, direction) {
		this.kanvasObj = kanvasObj;
		this.direction = direction;
		this.x = this.kanvasObj.foyer.x;
		this.y = this.kanvasObj.foyer.y;
	};
	/**
	 * Méthodes publiques
	 */
	JSFOURMIS.Fleche.prototype = {
		kanvasObj : {}, // cf. Constructeur
		x : 0, // Position x de la fourmi
		y : 0, // Position y de la fourmi
		direction : JSFOURMIS.Directions.NORD, // Direction de la fourmi. cf.
												// l'Enum
		// "JSFOURMIS.Direction"

		couleur : {
			r : 0,
			g : 0,
			b : 0,
			a : 0xff
		}, // Couleur de la fleche

		/**
		 * Dessine la flèche. Définit la forme de la flèche, et apelle la
		 * méthode de JSFOURMIS.Kanvas de dessin de forme (dessineForme()) avec
		 * la bonne position, forme, et couleur.
		 * 
		 * @param x
		 * @param y
		 */
		dessine : function() {
			var data = [ 0, 1, 0,
			         0, 1, 0, 
			         1, 1, 1, 
			         1, 1, 1, 
			         1, 1, 1 ];
			var matrice = new JSFOURMIS.Matrice(5, 3, data);
			if (this.direction == JSFOURMIS.Directions.EST) {
				matrice = matrice.rotation(JSFOURMIS.AnglesRotation.DROITE);
			} else {
				if (this.direction == JSFOURMIS.Directions.OUEST) {
					matrice = matrice.rotation(JSFOURMIS.AnglesRotation.GAUCHE);
				} else if (this.direction == JSFOURMIS.Directions.SUD) {
					matrice = matrice.rotation(JSFOURMIS.AnglesRotation.DEMITOUR);
				}
			}

			this.kanvasObj.dessineForme(matrice, this.x, this.y, this.couleur);
		}
	};
})();