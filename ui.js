var $info = function (nomInfo, valeur) {
	$('info_' + nomInfo).value = valeur;
};

var valeurConcrete = function (min, max, pourcentage) {
		return  pourcentage * (max - min)|0;
};
var valeurSlider = function (min, max, valeur) {
	if(valeur === -1){ return 1.0; }
	var vv = valeur - min;
	var vm = max - min;
	return vv / vm;
};

var loadUI = function() {
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
			td[0].style.width = '200px';
			
			if(JSFOURMIS.Parametres[param].type == 'slider') 
			{ 
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
				
				if(JSFOURMIS.Parametres[param].couleur) {
					tr.setAttribute('class','c_' + JSFOURMIS.Parametres[param].couleur);
				}
			
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
					value: valeurSlider(
						JSFOURMIS.Parametres[param].min,
						JSFOURMIS.Parametres[param].max, 
						JSFOURMIS.Parametres[param].valeur),
					params: {
						'inputId' : inputId,
						'param_name': param  
					}
				});
				inputValeur.value = JSFOURMIS.Parametres[param].valeur === -1 ?
					'illimité' :
					JSFOURMIS.Parametres[param].valeur;
					
			}//if(slider)
			
			else if(JSFOURMIS.Parametres[param].type == 'checkbox'){
				td[1].setAttribute('colspan', '2');
				var cb = doc.createElement('input');
				var div = doc.createElement('div');
				cb.setAttribute('type', 'checkbox');
				td[1].appendChild(cb);
				td[1].appendChild(div);
				cb.setAttribute('checked', JSFOURMIS.Parametres[param].valeur === true ? 'checked' : '' );
				cb.setAttribute('class', 'checkboxParameter');
				div.setAttribute('class', 'checkboxParameter');
				var cbId = 'checkboxParameter_' + param;
				cb.setAttribute('id', cbId);
				div.textContent = 'X';
				cb.onclick = (function(cbId){
					return function(){
						JSFOURMIS.Parametres[param].valeur = $(cbId).checked ? true : false;
					};
				})(cbId);
				tr.appendChild(td[0]);
				tr.appendChild(td[1]);
				paramTable.appendChild(tr);
			}//if(checkbox)
			
			else if(JSFOURMIS.Parametres[param].type == 'text') {
				td[1].setAttribute('colspan', '2');
				var inp = doc.createElement('input');
				var updBtn = doc.createElement('button');
				inp.setAttribute('type', 'text');
				inp.setAttribute('class', 'inputParameter');
				inp.value = JSFOURMIS.Parametres[param].valeur;
				inp.id = 'inputParameter_' + param;
				updBtn.textContent = 'modifier';
				updBtn.setAttribute('class', 'inputParameterButton');
				updBtn.onclick = (function(inputId){
					return function () {
						JSFOURMIS.Parametres[param].valeur = $(inputId).value;
					};
				})(inp.id);
				
				td[1].appendChild(inp);
				td[1].appendChild(updBtn);
				
				tr.appendChild(td[0]);
				tr.appendChild(td[1]);
				paramTable.appendChild(tr);
			}//if(text)
			
		}
	}	
};