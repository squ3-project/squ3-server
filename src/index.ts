import express from 'express'
import path from 'path'
import Editor from './Editor';
import { dbConnect, addNewTexture, findLastSeq } from './db/db';
import uploadFromRepo from './uploadFromRepo';
import Map from './db/Models/Map'
import cors from 'cors'
import Texture from './db/Models/Texture';

const port = process.env.PORT
const app = express()

// init

async function init(){
    await dbConnect()
    await findLastSeq()
    Editor.convertPlacementToId()
    // Editor.clearAtlas()
    // uploadFromRepo()
}

init()

app.use(cors({
    origin: "*"
}))
app.use(express.json());

app.post("/addtexture", async (req, res) => {
    const added = await Editor.addTextureToAtlas(req.body.file)
    if(added){
        await addNewTexture(req.body.file, req.body.name)
        res.json({done: true})
        res.status(200)
        return
    }

    res.json({done: false})
    res.status(400)
    
})

app.get("/texture", async (req, res) => {
    const name = req.query.name
    try{
        const data = await Texture.find({name}, 'seq name').exec()
        res.send(data)
        res.status(200)
    }catch(err){
        res.send({err: "Wrong id!"})
        res.status(404)
    }
})


app.get("/map", async(req, res) => {
    const id = req.query.id as string
    try{
        const data = await Map.findOne({_id:id}).exec()
        res.send(data)
        res.status(200)
    }catch(err){
        res.send({err: "Wrong id!"})
        res.status(404)
    }
})

app.post("/addmap", async(req, res) => {
    const {backgroundBlockId, mapString, collisionString, interactions} = req.body.map as MapAfter
    Map.create({backgroundBlockId, mapString, collisionString, interactions}, (err, map) => {
        res.json({id: map._id})
        res.status(200)
    })
})

app.get("/getatlas", (req,res) => {
    res.sendFile(path.join(__dirname, '../public/atlas.png'))
})

app.get("/game", (req,res) => {
    res.sendFile(path.join(__dirname, '../public/game/index.html'))
})

app.use('/', express.static(path.join(__dirname, '../public')))

app.listen( port, () => {
    console.log( `Server started at http://localhost:${ port }` );
} );



