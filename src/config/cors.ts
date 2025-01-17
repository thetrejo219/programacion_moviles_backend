import {CorsOptions} from 'cors'
export const corsConfig:CorsOptions={
    origin:function(origin,callback){
        if(origin===undefined){
            callback(null,true)
        }
        else{
         callback(new Error('Error de cors'))   
        }
    }
}