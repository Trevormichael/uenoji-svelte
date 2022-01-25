import db from "../data/db";
import {get } from 'svelte/store';
import { selectedNote, searchTerm, searchResults } from "../stores";

let loadedPlugins = {};
let actions = {};
let listeners = {};

const stores = {
    note: selectedNote,
    searchTerm: searchTerm,
    searchResults: searchResults
};

function registerAction(eventName, fn) {
    actions[eventName] = fn;
}

function unregisterAction(eventName) {
    actions[eventName] = null;
}

function registerListener(pluginId, eventName, fn) {
    if (!listeners.hasOwnProperty(eventName)) {
        listeners[eventName] = [];
    }
    listeners[eventName][pluginId] = fn;
}

function initializePlugin(pluginId, initializer) {
    initializer({
        register: (eventName, fn) => { registerListener(pluginId, eventName, fn); },
        stores: stores,
        get: get,
        config: () => loadedPlugins[pluginId].config
    });
}

function runPluginScripts(plugin) {
    let pluginId = plugin.manifest.id;
    let scripts = plugin.scripts;
    let registered = 0;
    scripts.forEach(s => {
        try {
            let func = new Function('initialize', s);
            let initialize = fn => { initializePlugin(pluginId, fn); };
            func.call(null, initialize);
            registered++;
        } catch (error) {
            console.log(error);
        }
    });
    console.log(`Registered ${registered} scripts for plugin ${pluginId}`);
}

const getLoadedPlugins = () => {
    return Object.values(loadedPlugins);
}

const reloadPlugins = async() => {
    loadedPlugins = {};
    listeners = {};
    actions = {};
    let pluginDirs = window.plugins.list();
    pluginDirs.forEach(dir => {
        let plugin = window.plugins.getPlugin(dir);
        runPluginScripts(plugin);
        loadedPlugins[plugin.manifest.id] = {
            manifest: plugin.manifest,
            config: plugin.config
        };
    });
}

const deletePlugin = async(plugin) => {
    window.plugins.deletePlugin(plugin.manifest.id);
}

const updateConfig = async(plugin, newConfig) => {
    window.plugins.writePluginConfig(plugin.manifest.id, newConfig);
}

const dispatchEvent = async(eventName, params) => {
    if (listeners.hasOwnProperty(eventName)) {
        let eventListeners = listeners[eventName];
        Object.keys(eventListeners).forEach(async(key) => {
            let fn = eventListeners[key];
            let config = loadedPlugins[key].config;
            fn(stores, get, config, params);
        })
    }
}

export default {
    registerAction,
    unregisterAction,
    dispatchEvent,
    reloadPlugins,
    getLoadedPlugins,
    deletePlugin,
    updateConfig
};