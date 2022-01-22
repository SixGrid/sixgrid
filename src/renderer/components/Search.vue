<template>
	<div class="container">
		<div ref="gridview-posts">
			<md-toolbar class="searchbar md-dense">
				<md-field>
					<label>Search Query</label>
					<md-textarea v-model="searchQuery" md-autogrow></md-textarea>
				</md-field>
			</md-toolbar>
		</div>
	</div>
</template>
<style scoped>
.container {
	width: calc(100% - 120px);
	margin: 25px;
}
</style>
<script>
export default {
	name: 'Search',
	data () {
		return {
			searchQuery: null,
			posts: []
		}
	}
}
</script>
