import {Request,Response} from 'express'
import Comentario from '../models/Comentario'
import Publicacion from '../models/Publicacion'

export class ComentarioControlador{
    static crearComentario=async(req:Request,res:Response)=>{
        const comentario=new Comentario(req.body)
        comentario.persona=req.user.id
        comentario.publicacion=req.post.id
        try {
            await Publicacion.findByIdAndUpdate(req.post.id,{
                $push:{comentarios:comentario.id}
            })
            await comentario.save()
            res.send('Comentario guardado correctamente')
        } catch (error) {
            res.status(500).json({error:'Hubo un error en el servidor'})
        }
    }
    static obtenerComentariosPublicacion=async(req:Request,res:Response)=>{
        try {
            const publicacion = await Publicacion.findById(req.post.id).populate('comentarios')
            const {comentarios} = publicacion
            if(comentarios.length===0){
                const error = new Error('No hay comentarios en la publicacion')
                res.status(404).json({error:error.message})
            }
            res.json(publicacion)
        } catch (error) {
            res.status(500).json({error:'Hubo un error en el servidor'})
        }
    }
    static actualizarComentario=async(req:Request,res:Response)=>{

    }
}