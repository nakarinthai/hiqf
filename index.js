#!/usr/bin/env node

const { exec } = require('child_process');
let appName = 'ErrorAppName'
const template = (process.argv.slice(2) || [])[0] || ''
let typeTemplate = 'noType'; // client or service
let templateName = 'noTempName' // template1 or template2

function init() {
    console.log(process.argv)

    if (template === '--help') {
        console.log('Usage: npx hiqf [type/template] \n  ' +
            '  -- [type] is mean client or service \n  ' +
            '  -- [template] is mean pattern template on the repository')
        return
    }

    if (template) {
        checkAppName(template)
        if (appName) {
            makeDir(callbackMakeDir)
        }
    } else {
        console.log('Please insert client or service \n ' +
            '[ npx hiqf service/template1 myAppName ] \n ' +
            '[ npx hiqf client/template1 myAppName ]')
    }

}

function checkAppName(tempName) {
    typeTemplate = tempName.split('/')[0] || ''
    templateName = tempName.split('/')[1] || ''
    console.log('templateName ', templateName)
    if (typeTemplate !== '') {
        appName = (process.argv.slice(2) || [])[1] || 'my-hiq-app'
    }

}

function makeDir(callbackFunc) {
    const command = `mkdir ${appName} \n cd ${appName} \n npm init --yes \n ls`;
    exec(command, (error, stdout, stderr) => {
        callbackFunc({ error, stdout, stderr })
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