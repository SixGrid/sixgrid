<template>
	<div class="container">
		<div ref="gridview-posts">
			<md-toolbar class="searchbar md-dense">
				<div class="md-toolbar-row">
					<md-field md-inline>
						<label>Search Query</label>
						<md-textarea v-model="searchQuery" md-autogrow></md-textarea>
					</md-field>
					<md-button class="md-icon-button" ref="buttonSearchSettings">
						<md-icon>tune</md-icon>
					</md-button>
				</div>
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
