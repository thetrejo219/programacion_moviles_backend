import mongoose,{Schema,Document,Types} from "mongoose";

export interface IComentario extends Document{
    persona:Types.ObjectId
    publicacion:Types.ObjectId
    comentario:string
    fotografiaComentario:string
}

const comentarioSchema:Schema=new Schema({
    persona:{
        type:Types.ObjectId,
        ref:'User'
    },
    publicacion:{
        type:Types.ObjectId,
        ref:'Publicacion'
    },
    comentario:{
        type:String
    },
    fotografiaComentario:{
        type:String
    }
})

const Comentario=mongoose.model<IComentario>('Comentarios',comentarioSchema)

export default Comentario