import { writable, get } from 'svelte/store';

export const note = writable(null);
export const searchTerm = writable(null);
export const searchResults = writable([]);