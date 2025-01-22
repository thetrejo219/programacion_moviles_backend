import mongoose,{Schema,Document} from "mongoose";

export interface IComentario extends Document{
    persona:string
    comentario:string
}

const comentarioSchema:Schema=new Schema({
    persona:{
        type:String
    },
    comentario:{
        type:String
    }
})

const Comentario=mongoose.model<IComentario>('Comentarios',comentarioSchema)