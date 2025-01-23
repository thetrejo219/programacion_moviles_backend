import {Router} from 'express'
import { ComentarioControlador } from '../controllers/ComentarioControlador'
import { autenticado } from '../middleware/auth'

const router = Router()

router.use(autenticado)

router.get('/:publicacionId/comentario',
    ComentarioControlador.obtenerComentariosPublicacion
)

router.post('/:publicacionId/comentario',
    ComentarioControlador.crearComentario
)

export default router