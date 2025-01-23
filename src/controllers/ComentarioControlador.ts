import {Request,Response} from 'express'
import Comentario from '../models/Comentario'
import Publicacion from '../models/Publicacion'

export class ComentarioControlador{
    static crearComentario=async(req:Request,res:Response)=>{
        const comentario=new Comentario(req.body)
        const{publicacionId}= req.params
        const publicacion = await Publicacion.findById(publicacionId)
        if(!publicacion){
            const error = new Error('La publicacion no existe')
            res.status(404).json({error:error.message})
        }
        comentario.persona=req.user.id
        comentario.publicacion=publicacion.id
        await Publicacion.findByIdAndUpdate(publicacionId,{
            $push:{comentarios:comentario.id}
        })
        await comentario.save()
        try {
            res.send('Comentario guardado correctamente')
        } catch (error) {
            res.status(500).json({error:'Hubo un error en el servidor'})
        }
    }
    static obtenerComentariosPublicacion=(req:Request,res:Response)=>{
        
    }
}