var JSFOURMIS = {}; // namespace

/* ----------------------------------------------------------------------------- */
/**
 * loadScripts()
 * @param		fileNames tableau des fichiers à apeller (sans extension)
 * @callback	fonction de callback, apellé une fois tout les fichiers chargés
 *
 */
var scriptsLoad = 0;
var scriptLoadCallback;
function loadScripts (fileNames, callback) {
	scriptsLoad = fileNames.length;
	if(callback) {
		scriptLoadCallback = callback; 
	}
	for(var i in fileNames) {
		var head= document.getElementsByTagName('head')[0];
		var script= document.createElement('script');
		script.type= 'text/javascript';
		
		script.onreadystatechange= function () {
			if (this.readyState == 'complete') { 
				observeScriptLoad();
			}
		} 
		script.onload = observeScriptLoad;
		 
		script.src= fileNames[i] + '.js';
		head.appendChild(script);
	}
}
function observeScriptLoad() {
	scriptsLoad--;
	if(scriptsLoad <= 0 ) {
		if(scriptLoadCallback) {
			scriptLoadCallback.call();
		}
	} 
} 
/* ----------------------------------------------------------------------------- */
/**
 * Fonctions utilitaires $(), $$(), bind() et $totalOffset()
 */
var $ = function(e){ return document.getElementById(e); };
var $$ = function (e) { return document.getElementsByClassName(e); };

function bind(scope, fn) {
    return function () {
        fn.apply(scope, arguments);
    };
}

function $totalOffset(e) {
	var curleft = 0, curtop = 0;
	if (e.offsetParent) {
		do {
			curleft += e.offsetLeft;
			curtop += e.offsetTop;
		} while (e = e.offsetParent);
		return {left:curleft, top:curtop};
	}
}

/* ----------------------------------------------------------------------------- */
/**
 * Initialisation
 */
var k;
function initKanvas() {
	k = new JSFOURMIS.Kanvas();
	loadUI();
}
loadScripts([
		'slider/slider',
		'Parametres',
		'Constantes',
		'Matrice',
		'Fourmi',
		'Fleche',
		'Nourriture',
		'Pheromone',
		'Obstacle',
		'Kanvas',
		'ui'
], initKanvas);
