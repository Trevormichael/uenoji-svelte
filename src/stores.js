import { writable, get } from 'svelte/store';

export const selectedNote = writable(null);
export const searchTerm = writable(null);
export const searchResults = writable([]);
export const toastTrigger = writable(null);