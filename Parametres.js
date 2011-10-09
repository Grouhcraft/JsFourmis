JSFOURMIS = JSFOURMIS || {};
JSFOURMIS.Parametres = {
	nbCycles: {
		min: -1,
		max: 5000,
		steps: 50,
		valeur: 5,
		label: 'Nombre de cycles',
		parametrable: true
	}, 
		
	nbFourmis: {
		min: 1,
		max: 500,
		steps: 250,
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