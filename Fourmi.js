/*******************************************************************************
 * ---------------------------------------------------
 * 
 * @class Fourmi Fait tout ce que fait une fourmi :)
 *        ----------------------------------------------------
 */

(function() {

	/**
	 * Constructeur On la place dans la fourmili�re, sans direction pr�cise.
	 * 
	 * @param kanvasObj:
	 *            instance de JSFOURMIS.Kanvas appellante (son "this" quoi)
	 */
	JSFOURMIS.Fourmi = function(kanvasObj) {
		this.kanvasObj = kanvasObj;
		this.direction = JSFOURMIS.Directions.AUCUNE;
		this.x = this.kanvasObj.foyer.x;
		this.y = this.kanvasObj.foyer.y;
	};
	/**
	 * M�thodes publiques
	 */
	JSFOURMIS.Fourmi.prototype = {
		kanvasObj : {}, // cf. Constructeur
		x : 0, // Position x de la fourmi
		y : 0, // Position y de la fourmi
		aller : true, // Indique si la fourmi cherche..
		retour : false, // ..ou si elle revient � la fourmili�re (consciament
		// s'entend)
		direction : null, // Direction de la fourmi. cf. l'Enum
		// "JSFOURMIS.Direction"
		nourritures : [], // instances des "Nourriture" transport�es
		age : 0, // Age de la fourmi (en Cycles)
		couleur : {
			r : 0,
			g : 0,
			b : 0,
			a : 0xff
		}, // Couleur de la fourmi

		/**
		 * Indique si la fourmi doit mourir (parcequ'elle est trop vielle par
		 * exemple)
		 * 
		 * @return: bool�an
		 */
		doitMourir : function() {
			// ...if(this.age)...
			return false;
		},

		/**
		 * Fait mourir la fourmi.
		 * 
		 * @TODO
		 */
		meurt : function() {
		},

		/**
		 * La fourmi est-elle dessinable ? Exemple: on peu vouloir une fourmi
		 * "fant�me", ou encore une fourmi "pr�-param�tr�e" pour plus tard, ou
		 * filtrer l'affichage par type de fourmis, ou que sais-je encore.. Par
		 * d�faut, une fourmis est dessinable.
		 * 
		 * @return bool�en
		 */
		estDessinable : function() {
			return true;
		},

		/**
		 * Dessine la fourmi. D�finit la forme de la fourmi, et apelle la
		 * m�thode de JSFOURMIS.Kanvas de dessin de forme (dessineForme()) avec
		 * la bonne position, forme, et couleur.
		 * 
		 * @param x
		 * @param y
		 */
		dessine : function() {
			data = [ 1, 1, 1,
			         0, 1, 0,
			         1, 1, 1,
			         0, 1, 0,
			         1, 1, 1 ];
			matrice = new JSFOURMIS.Matrice (5,3,data);
			matrice = matrice.rotation(JSFOURMIS.AnglesRotation.DROITE);
			this.kanvasObj.dessineForme(matrice, this.x, this.y, this.couleur);
		}
	};
})();