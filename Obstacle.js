/** ---------------------------------------------------
 * 
 * @class Obstacle
 * 
 * ----------------------------------------------------
 */
var JSFOURMIS = JSFOURMIS || {};
(function() {
	JSFOURMIS.Obstacle = function (kanvasObj, options){
		this.kanvasObj = kanvasObj;
		options = options || {};
		this.type = options.type || 1;
		this.x = options.x || 0;
		this.y = options.y || 0;
		this.rayonX = options.rayonX || 0;
		this.rayonY = options.rayonY || 0;
		this.hauteur = this.rayonX*2 + 1;
		this.largeur = this.rayonY*2 + 1;
		this.size = this.hauteur*this.largeur;
		this.numero = this.kanvasObj.entites.obstacles.length;
	};
	
	JSFOURMIS.Obstacle.prototype = {
		kanvasObj: {},
		x: 0,
		y: 0,
		rayonX: 0,
		rayony: 0,
		hauteur: 1,
		largeur:1,
		couleur: { r:50, g:200, b:50, a:0xff },
		numero: 0,
		
		estDessinable: function() {
			return true;
		},
		
		dessine: function () {
			var data = [];
			for (var i=0;i<this.size;i++) {
				data.push(1);
			}
			var matrice = new JSFOURMIS.Matrice(this.hauteur,this.largeur, data);
			this.kanvasObj.dessineForme(matrice, this.x, this.y, this.couleur);
		},
		estDessinable : function() {
			return true;
		},
	};
	
})();
