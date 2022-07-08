import { loadImage } from 'canvas'
import fs from 'fs'
import path from 'path'
import { addNewTexture } from './db/db'
import Editor from './Editor'

const repoDir = path.join(__dirname, '../repo')

export default async function uploadFromRepo() {
    const fileNames = await fs.readdirSync(repoDir)

    for (let i = 0; i < fileNames.length; i++) {
        if(fileNames[i].charAt(0) !== '.'){
            const base64 = await fileToBase64(repoDir + '/' + fileNames[i])
            await Editor.addTextureToAtlas(repoDir + '/' + fileNames[i])
            await addNewTexture(base64, fileNames[i].split('.')[0])
            await delay()
        }
    }
}

const delay = async (ms = 1000) =>
  new Promise(resolve => setTimeout(resolve, ms))

async function fileToBase64(path:string){
    const img = await fs.readFileSync(path, "base64url")
    const prefix = "data:image/png;base64,"
    return prefix + img
}
