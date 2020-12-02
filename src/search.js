class component {
	constructor(){
		this.$ = esix.modules.jquery;
	}
	
	defaultPage() {
		return `
<div class="container">
	<nav class="smallSearch">
		<div class="row">
			<div class="nav-wrapper">
				<form id="tagSearch">
					<div class="input-field">
						<input id="search" type="search">
						<label class="label-icon" for="search"><i class="material-icons">search</i></label>
						<i class="material-icons">close</i>
					</div>
				</form>
			</div>
		</div>
	</nav>
</div>
		`;
	}

	listen() {
		this.$("form#tagSearch").submit((me)=>{
			me.preventDefault();
			var givenSearch = me.target.elements.search.value
		})
	}
}


module.exports = component;