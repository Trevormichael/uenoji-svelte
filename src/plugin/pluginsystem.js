import db from "../data/db";
import JSZip from '../lib/jszip.min.js';
import { get } from 'svelte/store';
import { note, searchTerm } from "../stores";

const stores = {
    note: note,
    searchTerm: searchTerm
};

let actions = {};
let listeners = {};

function registerAction(eventName, fn) {
    actions[eventName] = fn;
}

function unregisterAction(eventName) {
    actions[eventName] = null;
}

function registerListener(pluginName, eventName, fn) {
    if (!listeners.hasOwnProperty(eventName)) {
        listeners[eventName] = [];
    }
    listeners[eventName][pluginName] = fn;
}

function runPluginScripts(plugin) {
    let scripts = plugin.scripts;
    let registered = 0;
    scripts.forEach(s => {
        try {
            let func = new Function('register', s);
            let register = (eventName, fn) => { registerListener(plugin.name, eventName, fn); };
            func.call(null, register);
            registered++;
        } catch (error) {
            console.log(error);
        }
    });
    console.log(`Registered ${registered} scripts for plugin ${plugin.name}`);
}

const listPlugins = async() => {
    return db.plugins.toArray();
};

const registerPlugins = async() => {
    listeners = {};
    let plugins = await db.plugins.toArray();
    plugins.forEach(runPluginScripts);
}

const addPluginPackage = async(pluginFile) => {
    let zip = new JSZip();
    let unzipped = await zip.loadAsync(pluginFile);
    let manifest = JSON.parse(await unzipped.files['manifest.json'].async("string"));
    let entry = {
        name: manifest.name,
        config: manifest.defaultConfiguration,
        manifest: manifest
    };
    let scripts = [];
    await Promise.all(Object.keys(unzipped.files).map(async(fileName) => {
        if (fileName.endsWith(".js")) {
            let file = unzipped.files[fileName];
            let content = await file.async("string");
            scripts.push(content);
        }
    }));
    entry.scripts = scripts;
    console.log(entry);
    await db.plugins.put(entry);
    registerPlugins();
}

const deletePlugin = async(id) => {
    await db.plugins.delete(id)
}

const updateConfig = async(id, newConfig) => {
    await db.plugins.update(id, { config: newConfig })
    await registerPlugins();
}

const dispatchEvent = async(eventName, params) => {
    if (listeners.hasOwnProperty(eventName)) {
        let eventListeners = listeners[eventName];
        Object.keys(eventListeners).forEach(async(key) => {
            let fn = eventListeners[key];
            let config = (await db.plugins.get({ name: key })).config;
            fn(stores, get, config, params);
        })
    }
}

export default {
    registerAction,
    unregisterAction,
    dispatchEvent,
    addPluginPackage,
    registerPlugins,
    listPlugins,
    deletePlugin,
    updateConfig
};