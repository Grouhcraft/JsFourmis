/** ---------------------------------------------------
 * 
 * @class Pheromone
 * 
 * ----------------------------------------------------
 */
var JSFOURMIS = JSFOURMIS || {};
(function() {
	JSFOURMIS.Pheromone = function (){ 
	};
	
	JSFOURMIS.Pheromone.prototype = {
		kanvasObj: {},
		x: 0,
		y: 0,
		couleur: { r:127, g:0, b:127, a:0xff },
		numero: 0,
		quantite: 0,
		
		dessine: function () {
			var data = [1,1,
						1,1];
			var matrice = new JSFOURMIS.Matrice(2,2, data);
			this.kanvasObj.dessineForme(matrice, this.x, this.y, this.couleur);
		}
	};
})();
