import colors from 'colors'
import server from './server'

const port = process.env.PORT || 5000


server.listen(port,()=>{
    console.log(colors.magenta.bold(`Servidor funcionando correctamente en el puerto:`),port)
})