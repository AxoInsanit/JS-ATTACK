/**
 * Created by Crystian on 11/20/2014.
 */
var evalWorker, result = document.getElementById('result');

var editor = ace.edit("editor");
editor.setTheme("ace/theme/twilight");
editor.getSession().setMode("ace/mode/javascript");
editor.getSession().setTabSize(4);
editor.getSession().setUseSoftTabs(true);
editor.setShowPrintMargin(false);
editor.setFontSize("3vmin");

editor.commands.addCommand({
	name: 'run',
	bindKey: {win: 'Ctrl-Enter',  mac: 'Command-Enter'},
	exec: function(editor) {
		runCode();
	},
	readOnly: true // false if this command should not apply in readOnly mode
});




function runCode() {
	//editor.setReadOnly(true);
	//$('#test button').attr('disabled','disabled');


	var code = editor.getSession().getValue() + "\n";

		try {
			//implentar thread de control
			evalWorker.postMessage(code);
		} catch(e) {
			console.log('algo paso :S');
		}

}



function log(m){
	console.log(m);
	result.innerHTML += m +'<br>';
	result.scrollTop = result.scrollHeight;
}

function validate(i) {

	console.log('validate',i);

	var a = '<span style="color:'+ (('a'===i) ? 'green': 'red') +'">'+('a'===i)+'</span>';
	log('se esperaba una "a" y llego una "'+i+'" = '+ a);

}

function setupWorker() {
	var newWorker = new Worker("eval.js");
	newWorker.onmessage = function (m) {
		if(m.data.type == 'result') {
			validate(m.data.content);
		}
		if(m.data.type == 'error') {
			handleError(m.data.content);
		}
		if(m.data.type == 'log') {
			log(m.data.content);
		}
	};
	newWorker.onerror = function (m) {
		handleError(m.message +'\n');
	};
	return newWorker;
}
function handleError(i) {
	console.log('handle error');
}

$('document').ready(function () {

	if(!!window.Worker) {

		evalWorker = setupWorker();

	} else {

		console.log('fail');

	}

	$(document).keypress(function(event) {
		if (event.which == 13 && (event.ctrlKey||event.metaKey)) {
			event.preventDefault();
			runCode();
			return false;
		}
		return true;
	});

});