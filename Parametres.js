/**
 *  Note: pour les couleurs dispo, pour l'instant: red, green et blue.
 * 
 */
JSFOURMIS = JSFOURMIS || {};
JSFOURMIS.Parametres = {
	nbCycles: {
		min: 0,
		max: 5000,
		steps: 5000,
		valeur: -1,
		label: 'Nombre de cycles',
		parametrable: true,
		illimitable: true
	}, 
		
	nbFourmis: {
		min: 0,
		max: 5000,
		steps: 500,
		valeur: 60,
		label: 'Nombre de fourmis',
		parametrable: true
	},
	
	nourriture_nbInitialDePoints: {
		min: 0,
		max: 100,
		steps: 100,
		valeur: 15,
		label: 'Nb de <i>spots</i> nourriture',
		parametrable: true,		
		couleur: 'green',
	},
	
	nourriture_nombreParPoint_min: {
		min: 0,
		max: 100,
		steps: 100,
		valeur: 0,
		label: 'Nb Nourriture <b>min</b> par <i>spot</i>',
		parametrable: true,
		couleur: 'green'
	},
	
	nourriture_nombreParPoint_max: {
		min: 0,
		max: 100,
		steps: 100,
		valeur: 20,
		label: 'Nb Nourriture <b>max</b> par <i>spot</i>',
		parametrable: true,
		couleur: 'green',		
	},
	
	// Si valeur -1, illimité 
	DUREE_PHEROMONES_NOURRITURE: {
		valeur: 300,
		min: 100,
		max: 1200,
		steps: 23,
		illimitable: true,
		label: 'Durée des pheromones (cycles)',
		parametrable: true
	},
	
	PAS_PHEROMONES_NOURRITURE: {
		valeur: 3,
		min: 1,
		max: 15,
		steps: 15,
		label: 'Distance entre 2 Phéromones',
		parametrable: true
	},
	
	fourmi_vision_rayon: {
		valeur: 4,
		min: 1,
		max: 30,
		steps: 30,
		label: 'Rayon du champ de vision',
		parametrable: true
	},
	
	fourmi_vision_versAvant: {
		min: 0, 
		max: 3,
		steps: 4,
		valeur: 0,
		label: 'Vision vers l\'avant ?',
		parametrable: true
	},
	
	delaiCycle: {
		min: 0, 
		max: 100,
		steps: 101,
		valeur: 20,
		label: 'Délai inter-cycles (ms)',
		parametrable: true		
	}
};