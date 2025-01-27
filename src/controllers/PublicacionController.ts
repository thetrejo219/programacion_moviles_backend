import { Request,Response } from "express"
import Publicacion from "../models/Publicacion"
import fs from 'fs';
import User from "../models/User"
import cloudinary from "../config/cloudinary"

export class PublicacionController{
    static crearPublicacion=async(req:Request,res:Response)=>{
        
        try {
            const post = new Publicacion(req.body)
            const tempFilePath = req.file.path;
            const result = await cloudinary.uploader.upload(tempFilePath);
            post.persona=req.user.id
            fs.unlink(tempFilePath, (err) => {
                if (err) {
                    console.error('Error al eliminar el archivo temporal:', err);
                }
            });
            post.image = result.secure_url;
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
    static actualizarPublicacion=async(req:Request,res:Response)=>{
        try {
            req.post.texto = req.body.texto
            req.post.image = req.body.texto
            await req.post.save()
            res.send('Publicacion actualizada correctamente')
        } catch (error) {
            res.status(500).json({error:'Hubo un error en el servidor'})
        }
    }
    static obtenerPublicacionByID=async(req:Request,res:Response)=>{
        try {
            const id = req.post
            res.json(id)
        } catch (error) {
            res.status(500).json({error:'Hubo un error en el servidor'})
        }
    }
}