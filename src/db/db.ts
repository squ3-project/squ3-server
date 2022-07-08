import { rejects } from 'assert';
import 'dotenv/config'
import mongoose from 'mongoose'
import { resolve } from 'path';
import Texture from './Models/Texture'
import Map from './Models/Map'

let lastSeq:number

export async function dbConnect() {
    await mongoose.connect(process.env.MONGOURL)
    await Texture.createCollection()
    await Map.createCollection()
}

mongoose.connection.on('error', err => {
    console.log(err);
});

type TextureType = {
    _id:number,
    seq:number,
    base64:string
}

export function getLastSeq(){
    return lastSeq
}

export async function findLastSeq(){
    const lastAdded = await Texture.findOne().sort('-_id')
    if(lastAdded){
        lastSeq = lastAdded.seq
        return 
    }
    lastSeq = -1
}


export async function addNewTexture(base64:string, name:string){
    const seq = lastSeq + 1
    console.log(seq)
    console.log(name)
    await Texture.create({ base64, seq, name })
    lastSeq++
}




