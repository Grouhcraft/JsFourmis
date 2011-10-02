/*******************************************************************************
 * ---------------------------------------------------
 * 
 * @class Fourmi Fait tout ce que fait une fourmi :)
 * 
 * ----------------------------------------------------
 */
var JSFOURMIS = JSFOURMIS || {};
(function() {
	/**
	 * Constructeur On la place dans la fourmilière, sans direction précise.
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
	 * Méthodes publiques
	 */
	JSFOURMIS.Fourmi.prototype = {
		kanvasObj: {},		// cf. Constructeur
		x : 0,				// Position x de la fourmi
		y : 0,				// Position y de la fourmi
		aller: true,		// Indique si la fourmi cherche..
		retour : false,		// ..ou si elle revient à la fourmilière (consciament s'entend)
		direction : null,	// Direction de la fourmi. cf. l'Enum "JSFOURMIS.Direction"
		nourritures : [],	// instances des "Nourriture" transportées
		age : 0,			// Age de la fourmi (en Cycles)
		couleur : { r:0, g:0, b:0, a:0xff },	// Couleur de la fourmi

		/**
		 * Indique si la fourmi doit mourir (parcequ'elle est trop vielle par
		 * exemple)
		 * 
		 * @return: booléan
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
		 * "fantôme", ou encore une fourmi "pré-paramétrée" pour plus tard, ou
		 * filtrer l'affichage par type de fourmis, ou que sais-je encore.. Par
		 * défaut, une fourmis est dessinable.
		 * 
		 * @return booléen
		 */
		estDessinable : function() {
			return true;
		},
		
		avanceDansSaDirection: function (distance) {
			distance = distance || 1;
			switch(this.direction) {
				case JSFOURMIS.Directions.NORD:		this.y-=distance; break;
				case JSFOURMIS.Directions.SUD:		this.y+=distance; break; 
				case JSFOURMIS.Directions.EST:		this.x-=distance; break;
				case JSFOURMIS.Directions.OUEST:	this.x+=distance; break;
				case JSFOURMIS.Directions.AUCUNE:
					throw("Aucune direction n'est encore fixée..");
					break;
			};
		},

		/**
		 * Dessine la fourmi. Définit la forme de la fourmi, et apelle la
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
				         0, 1, 0,
				         1, 1, 1 ];
			var matrice = new JSFOURMIS.Matrice(5,3,data);
			var angle = null; 
			switch(this.direction) {
				case JSFOURMIS.Directions.NORD:
				case JSFOURMIS.Directions.AUCUNE:		
				break;
				case JSFOURMIS.Directions.SUD:		angle = JSFOURMIS.AnglesRotation.DEMITOUR ; break; 
				case JSFOURMIS.Directions.EST:		angle = JSFOURMIS.AnglesRotation.GAUCHE ; break;
				case JSFOURMIS.Directions.OUEST:	angle = JSFOURMIS.AnglesRotation.DROITE ; break;
			}
			if(angle !== null) {
				matrice = matrice.rotation(angle);
			}
			this.kanvasObj.dessineForme(matrice, this.x, this.y, this.couleur);
		}
	};
})();