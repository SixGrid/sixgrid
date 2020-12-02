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
						<label class="label-icon" for="add"><i class="material-icons">plus</i></label>
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
		const api = new esix.modules.api({username: localStorage.auth_username,key: localStorage.auth_key,});
		this.$("form#tagSearch").submit(async (me)=>{
			me.preventDefault();
			var tags = me.target.elements.search.value.split(' ').join("+");
			console.debug(`[search.js] Tags given`,tags);

			var returnedPosts = await esix.modules.api.getPostsByTag(tags)
		})
	}
}


module.exports = component;