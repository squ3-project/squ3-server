import { createCanvas, loadImage, Image} from 'canvas'
import fs from 'fs'
import path from 'path'
import { getLastSeq } from './db/db'
import Texture from './db/Models/Texture'

// async function loadAtlas(_url:string):Promise<Image> {
//     return new Promise((resolve, reject) => {
//         const image = new Image()
//         image.src = _url 
//         image.onload = () => resolve(image)
//     })
// }


export default class Editor{

    private static width = 3200
    private static height = 3200
    private static textureSize = 32 // 32x32px textures
    private static canvas = createCanvas(Editor.width,Editor.height)
    private static ctx = Editor.canvas.getContext("2d")
    private static pathToAtlas = path.join(__dirname, '../public/atlas.png') 
    private static blockId:[number,number][] = []
    private static blocksPerRow = Editor.width / Editor.textureSize


    private constructor(){}

    public static convertPlacementToId():void{
        for (let i = 0; i < (Editor.blocksPerRow)**2; i++) {
            const j = Math.floor(i/Editor.blocksPerRow)
            Editor.blockId.push([(i-(j*Editor.blocksPerRow))*Editor.textureSize, j*Editor.textureSize])
        }
    }

    private static getPlacement(id:number):[number, number]{
        return Editor.blockId[id]
    }

    public static clearAtlas(){
        Texture.deleteMany({},(err:Error,data:string) => {
            if(err) throw err
        })
        const out = fs.createWriteStream(Editor.pathToAtlas)
        const stream = Editor.canvas.createPNGStream()
        stream.pipe(out)
        out.on('finish', () =>  {
            console.log('Atlas png in clear.')
        })
    }

    
    public static async addTextureToAtlas(image:string | Buffer):Promise<boolean>{

        const textureImg = await loadImage(image)
        if(!(textureImg.width === 32 && textureImg.height === 32)) return false

        const atlasImg = new Image()
        atlasImg.onload = () => Editor.ctx.drawImage(atlasImg, 0, 0)
        atlasImg.src = Editor.pathToAtlas
        const seq = getLastSeq() + 1
        console.log(seq)
        const [x, y] = Editor.getPlacement(seq)
        Editor.ctx.drawImage(textureImg,x, y)
        const out = fs.createWriteStream(Editor.pathToAtlas)
        const stream = Editor.canvas.createPNGStream()
        stream.pipe(out)
        out.on('finish', () =>  {
            console.log('The PNG file was created.')
            Editor.ctx.clearRect(0,0,Editor.width,Editor.height)
        })
        return true
    }



}

