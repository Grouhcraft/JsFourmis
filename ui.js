var valeurConcrete = function (min, max, pourcentage) {
		return  pourcentage * (max - min)|0;
};
var onBodyLoad = function() {
	var paramTable = $('parametres');
	var doc = document;
	for(var param in JSFOURMIS.Parametres) 
	{
		if(JSFOURMIS.Parametres[param].parametrable) 
		{
			var tr = document.createElement('TR');
			var td = [null, null, null];
			td[0] = doc.createElement('TD');
			td[1] = doc.createElement('TD');
			td[2] = doc.createElement('TD');
			td[0].innerHTML = JSFOURMIS.Parametres[param].label;
			td[0].style.width = '175px';
			var inputId = 'valeur_' + param;
			var divSlider	= doc.createElement('DIV');
			var divHandler	= doc.createElement('DIV');
			divSlider.setAttribute('id', param);
			divSlider.setAttribute('class', 'slider');
			divHandler.setAttribute('class', 'handle');
			divSlider.appendChild(divHandler);
			td[1].appendChild(divSlider);
			
			td[2].setAttribute('class', 'valeur');
			var inputValeur = doc.createElement('INPUT');
			inputValeur.setAttribute('type', 'text');
			inputValeur.setAttribute('id', inputId);
			inputValeur.setAttribute('value', '');
			inputValeur.setAttribute('class', 'slidersInputs');
			td[2].appendChild(inputValeur);
			
			tr.appendChild(td[0]);
			tr.appendChild(td[1]);
			tr.appendChild(td[2]);
			
			paramTable.appendChild(tr);
				 
			new Slider(param, {
				callback: function(value, opts) {
					if(JSFOURMIS.Parametres[opts.param_name].illimitable && value === 1) {
						$(opts.inputId).value = 'illimité';
						JSFOURMIS.Parametres[opts.param_name].valeur = -1;	
					} else {
						$(opts.inputId).value = valeurConcrete(
								JSFOURMIS.Parametres[opts.param_name].min, 
								JSFOURMIS.Parametres[opts.param_name].max, 
								value);
						JSFOURMIS.Parametres[opts.param_name].valeur = valeurConcrete(
							JSFOURMIS.Parametres[opts.param_name].min, 
							JSFOURMIS.Parametres[opts.param_name].max, 
							value);
					}
				},
				steps: JSFOURMIS.Parametres[param].steps,
				value: JSFOURMIS.Parametres[param].valeur,
				params: {
					'inputId' : inputId,
					'param_name': param  
				}
			});
			inputValeur.value = JSFOURMIS.Parametres[param].valeur;
		}
	}	
};