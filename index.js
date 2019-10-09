#!/usr/bin/env node
const fs = require('fs')
const { exec } = require('child_process')
const { help } = require('./helpdoc.js')
const { jsonReader, jsonWriter } = require('./utils.js')
let appName = 'ErrorAppName'
const template = (process.argv.slice(2) || [])[0] || ''
let typeTemplate = 'noType' // client or service
let templateName = 'noTempName' // template1 or template2

function init() {
    if (template === '--help') {
        console.log(help())
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
    if (typeTemplate !== '') {
        appName = (process.argv.slice(2) || [])[1] || 'my-hiq-app'
    }

}


function makeDir(callbackFunc) {
    const repoWithKey = `ssh-agent bash -c 'ssh-add ./id_rsa.pub git clone git@github.com:nakarinthai/electron-svelte.git .'`
    const command = `mkdir ${appName} \n cd ${appName} \n ${repoWithKey} \n ls`
    exec(command, (error, stdout, stderr) => {
        callbackFunc({ error, stdout, stderr })
            .then(resp => {
                jsonReader(`./${appName}/package.json`, (err, resp) => {
                    let respval = resp
                    if (err) {
                        console.log(err)
                        return
                    }
                    console.log(resp) // => "Infinity Loop Drive"
                    respval.name = 'new-name'
                    jsonWriter(`./${appName}/package.json`, JSON.stringify(respval, null, '\t'))

                })
                return resp
            }).catch(err => err)
    })
}

async function callbackMakeDir(resp) {
    return new Promise((resolve, reject) => {
        if (resp.error) {
            console.error(resp.error)
            reject(resp.error)
        }
        if (resp.stderr) {
            console.error(resp.stderr.split('mkdir:')[1])
            reject(resp.stderr)
        }
        resolve(resp.stdout)
    })

}


init()