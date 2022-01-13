import db from "../data/db";
import JSZip from '../lib/jszip.min.js';

let listeners = {};

function register(eventName, fn) {
    if (!listeners.hasOwnProperty(eventName)) {
        listeners[eventName] = [];
    }
    listeners[eventName].push(fn);
}

const listPlugins = async() => {
    return db.plugins.toArray();
};

const registerPlugins = async() => {
    listeners = {};
    let plugins = await db.plugins.toArray();
    plugins.forEach(plugin => {
        let scripts = plugin.scripts;
        scripts.forEach(s => {
            let func = new Function('register', s);
            func.call(null, register);
        });
        console.log(`Registered ${scripts.length} scripts for plugin ${plugin.name}`);
    });
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

const deletePugin = async(id) => {
    await db.plugins.delete(id)
}

const dispatchEvent = (eventName, params) => {
    let fns = listeners[eventName];
    fns.forEach(fn => fn(params));
}

export default {
    dispatchEvent,
    addPluginPackage,
    registerPlugins,
    listPlugins
};