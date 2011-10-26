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
		this.hauteur = options.hauteur|| 1;
		this.largeur = options.largeur || 1;
		this.numero = this.kanvasObj.entites.obstacles.length;
		this.size = this.hauteur*this.largeur;
	};
	
	JSFOURMIS.Obstacle.prototype = {
		kanvasObj: {},
		x: 0,
		y: 0,
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
			var matrice = new JSFOURMIS.Matrice(this.hauteur, this.largeur, data);
			this.kanvasObj.dessineForme(matrice, this.x, this.y, this.couleur);
		},
		estDessinable : function() {
			return true;
		},
		
		bloqueEmplacement: function(x, y, hauteur, largeur) {	
			var minDistCentresY = (hauteur + this.hauteur) / 2;
			var minDistCentresX = (largeur + this.largeur) / 2;
			var distx = Math.abs(this.x-x);
			var disty = Math.abs(this.y-y);
			if ((distx<=minDistCentresX) && (disty<=minDistCentresY)) {
				return true;
			}
			return false;
		}
	};
	
})();
