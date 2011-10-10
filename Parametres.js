JSFOURMIS = JSFOURMIS || {};
JSFOURMIS.Parametres = {
	nbCycles: {
		min: 0,
		max: 5000,
		steps: 5000,
		valeur: 5,
		label: 'Nombre de cycles',
		parametrable: true,
		illimitable: true
	}, 
		
	nbFourmis: {
		min: 0,
		max: 500,
		steps: 500,
		valeur: 20,
		label: 'Nombre de fourmis',
		parametrable: true
	},
	
	nourriture_nbInitialDePoints: {
		min: 0,
		max: 100,
		steps: 100,
		valeur: 15,
		label: 'Nb de <i>zones</i> nourriture',
		parametrable: true		
	},
	
	test_a_virer: {
		valeur: 15,
		parametrable: false		
	}
};