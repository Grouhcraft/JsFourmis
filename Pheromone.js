/** ---------------------------------------------------
 * 
 * @class Pheromone
 * 
 * ----------------------------------------------------
 */
var JSFOURMIS = JSFOURMIS || {};
(function() {
	JSFOURMIS.Pheromone = function (kanvasObj, options){
		this.kanvasObj = kanvasObj;
		options = options || {};
		this.quantite = options.quantite || 1;
	};
	
	JSFOURMIS.Pheromone.prototype = {
		kanvasObj: {},
		x: 0,
		y: 0,
		couleur: { r:127, g:0, b:127, a:0xff },
		numero: 0,
		quantite: 0,
		
		estDessinable: function() {
			return true;
		},
		
		dessine: function () {
			var data = [0,1,0,
						1,0,1,
						0,1,0];
			var matrice = new JSFOURMIS.Matrice(3,3, data);
			this.kanvasObj.dessineForme(matrice, this.x, this.y, this.couleur);
		}
	};
	
})();
