<script>
	import Nav from "./component/Nav.svelte";
	import Anki from "./component/Anki.svelte";
	import Dictionaries from "./component/Dictionaries.svelte";
	import Configuration from "./component/Configuration.svelte";

	const navOptions = [
		{ name: "Anki", component: Anki },
		{ name: "Dictionaries", component: Dictionaries },
		{ name: "Configuraiton", component: Configuration },
	];

	var selected = navOptions[0];

</script>

<main>
	<header class="container-fluid p-3 nav">
		<Nav
			options={navOptions}
			{selected}
			on:select={(event) => (selected = event.detail)}
		/>
	</header>
	<div class="p-3">
		<svelte:component this={selected.component} />
	</div>
</main>

<style>
	header {
		background-color: #282c39;
	}

	:global(body) {
		background-color: #2f3343;
		color: white;
	}
</style>
