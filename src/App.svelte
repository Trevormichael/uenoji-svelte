<script>
	import { onMount } from 'svelte';
	import Nav from "./component/Nav.svelte";
	import Anki from "./component/Anki.svelte";
	import Dictionaries from "./component/Dictionaries.svelte";
	import Configuration from "./component/Configuration.svelte";
    import "@fortawesome/fontawesome-free/css/all.min.css";
	import pluginsystem from './plugin/pluginsystem';

	const navOptions = [
		{ name: "Anki", component: Anki },
		{ name: "Dictionaries", component: Dictionaries },
		{ name: "Configuration", component: Configuration },
	];

	var selected = navOptions[0];

	onMount(() => {
		pluginsystem.reloadPlugins();
	});
</script>

<main class="d-flex flex-column">
	<header class="container-fluid p-3 nav flex-shrink-1">
		<Nav
			options={navOptions}
			{selected}
			on:select={event => selected = event.detail}
		/>
	</header>
	<div class="d-flex flex-column">
		<svelte:component this={selected.component} />
	</div>
</main>

<style>
	header {
		background-color: #282c39;
	}

	div {
		overflow: hidden;
	}

	main {
		width: 100%;
		height: 100%;
	}

	:global(body) {
		background-color: #2f3343;
		color: white;
		width: 100%;
		height: 100%;
	}

	:global(:root) {
		--card-color: #222328;
	}
</style>
