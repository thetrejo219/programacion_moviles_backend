import { Request,Response } from "express"
import Publicacion from "../models/Publicacion"
import { Types } from "mongoose"
import User from "../models/User"

export class PublicacionController{
    static crearPublicacion=async(req:Request,res:Response)=>{
        const post = new Publicacion(req.body)
        if(!req.user){
            res.status(401).json({error:'Usuario no encontrado'})
            return
        }
        post.persona=req.user.id
        try {
            await Promise.allSettled([
                User.findByIdAndUpdate(req.user._id,{
                    $push:{logros:post.id}
                }),
                post.save()
            ])
            res.send('Publicacion creada correctamente')
        } catch (error) {
            res.status(500).json({error:'Hubo un error en el servidor'})
        }
    }
    static obtenerPublicaciones=async(req:Request,res:Response)=>{
        try {
            const publicaciones = await Publicacion.find({

            })
            res.json(publicaciones)
        } catch (error) {
            res.status(500).json({error:'Hubo un error en el servidor'})
        }
    }
}