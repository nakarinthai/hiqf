#!/usr/bin/env node

const { exec } = require('child_process');

let mkdirStatus = false;
const appName = process.argv.slice(2)[0] || 'myApp'

function init() {

    if (appName) {
        makeDir(callbackMakeDir)
    }
}

function makeDir(callbackMakeDir) {
    const command = `mkdir ${appName} \n cd ${appName} \n npm init --yes \n ls`;
    exec(command, (error, stdout, stderr) => {
        callbackMakeDir({ error, stdout, stderr })
            .then(resp => resp).catch(err => err)
    })
}

async function callbackMakeDir(resp) {
    return new Promise((resolve, reject) => {
        if (resp.error) {
            console.error(resp.error)
            reject(resp.error)
        };
        if (resp.stderr) {
            console.error(resp.stderr.split('mkdir:')[1])
            reject(resp.stderr)
        };
        mkdirStatus = true;
        resolve(resp.stdout)
    })

}


init();