var JSFOURMIS = JSFOURMIS || {};
(function() {
		
	JSFOURMIS.Directions = {
			NORD : 1,
			SUD : -1,
			EST : 2,
			OUEST : -2,
			AUCUNE : 3
		};
	
	JSFOURMIS.AnglesRotation = {
		DROITE : 1,
		GAUCHE : 2,
		DEMITOUR : 3,
		AUCUN: 4
	};
	
	JSFOURMIS.TypesPheromones = {
			ALLER : 1,
			NOURRITURE : 2
	};
	
	JSFOURMIS.FormesObstacles = {
			CARRE: 1
	};
	
	JSFOURMIS.ILLIMITE = -1;
	
})();