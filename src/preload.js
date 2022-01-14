const fs = require("fs");
const path = require("path");
const { contextBridge, ipcRenderer, shell } = require("electron");

console.log("running preload")

const getHomeDir = () => ipcRenderer.sendSync("getHomeDirectory", "");
const getPluginDir = () => `${getHomeDir()}/.uenoji/plugins`;

function getPluginManifest(pluginDir) {
    let manifestPath = `${pluginDir}/manifest.json`
    if (fs.existsSync(manifestPath)) {
        let manifestContents = fs.readFileSync(manifestPath, "utf-8")
        return JSON.parse(manifestContents);
    }
    return null;
}

function getPluginConfig(pluginDir) {
    let configPath = `${pluginDir}/config.json`
    if (fs.existsSync(configPath)) {
        let configContents = fs.readFileSync(configPath, "utf-8")
        return JSON.parse(configContents);
    }
    return null;
}

function getPluginScripts(pluginDir, manifest) {
    let scripts = manifest.scripts;
    let res = [];
    scripts.forEach(s => {
        try {
            let filePath = path.resolve(pluginDir, s);
            let f = fs.readFileSync(filePath, "utf-8")
            res.push(f);
        } catch (error) {
            console.log(`Plugin script ${s} was not found`);
            return;
        }
    })
    return res;
}

contextBridge.exposeInMainWorld(
    "plugins", {
        openDirectory: () => {
            try {
                let path = getPluginDir();
                if (!fs.existsSync(path)) {
                    fs.mkdirSync(path, { recursive: true });
                }
                shell.openPath(path);
            } catch (error) {
                console.log(error);
            }
        },
        list: () => {
            return fs.readdirSync(getPluginDir()).filter(name => !name.startsWith("."));
        },
        getPlugin: (pluginId) => {
            console.log("Loading plugin: " + pluginId);
            let pluginDir = `${getPluginDir()}/${pluginId}`;
            let manifest = getPluginManifest(pluginDir);
            if (manifest == null)
                throw Error("No manifest found for plugin: " + pluginId)
            let config = getPluginConfig(pluginDir);
            let plugin = {
                manifest: manifest,
                scripts: [],
                config: config ? config : manifest.defaultConfiguration
            }
            plugin.scripts = getPluginScripts(pluginDir, manifest);
            return plugin;
        },
        writePluginConfig: (pluginId, newConfig) => {
            let pluginDir = `${getPluginDir()}/${pluginId}`;
            let configPath = `${pluginDir}/config.json`;
            fs.writeFileSync(configPath, JSON.stringify(newConfig));
        },
        deletePlugin: (pluginId) => {
            let pluginDir = `${getPluginDir()}/${pluginId}`;
            fs.rmSync(pluginDir, { recursive: true, force: true });
        }
    }
)