const $ = window.esix.modules.jquery;

$("form#tagSearch").submit((me)=>{
	me.preventDefault();
	console.debug(`[listener.js] Given Tags '${me.target.elements.search.value}'`)
	console.debug("[listener.js] Tag Search Form Submitted",me)
})