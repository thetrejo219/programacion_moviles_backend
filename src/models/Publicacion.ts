import mongoose,{Schema,Document, PopulatedDoc, Types} from "mongoose";
import { IComentario } from "./Comentario";

export interface IPublicacion extends Document{
    texto:string
    image:string
    comentarios:PopulatedDoc<IComentario & Document>[]
    persona:Types.ObjectId
}

const publicacionSchema:Schema=new Schema({
    texto:{
        type:String
    },
    image:{
        type:String
    },
    comentarios:{
        type:[
            {
                type:Types.ObjectId,
                ref:'Comentarios'
            }
        ]
    },
    persona:{
        type:Types.ObjectId,
        ref:'User'
    }
})
const Publicacion = mongoose.model<IPublicacion>('Publicacion',publicacionSchema)

export default Publicacion