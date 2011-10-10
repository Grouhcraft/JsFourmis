JSFOURMIS = JSFOURMIS || {};
JSFOURMIS.Parametres = {
	nbCycles: {
		min: 0,
		max: 5000,
		steps: 5000,
		valeur: 500,
		label: 'Nombre de cycles',
		parametrable: true,
		illimitable: true
	}, 
		
	nbFourmis: {
		min: 0,
		max: 500,
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
		parametrable: true		
	},
	
	nourriture_nombreParPoint_min: {
		min: 0,
		max: 100,
		steps: 100,
		valeur: 0,
		label: 'Nb Nourriture <b>min</b> par <i>spot</i>',
		parametrable: true		
	},
	
	nourriture_nombreParPoint_max: {
		min: 0,
		max: 100,
		steps: 100,
		valeur: 20,
		label: 'Nb Nourriture <b>max</b> par <i>spot</i>',
		parametrable: true		
	}
};