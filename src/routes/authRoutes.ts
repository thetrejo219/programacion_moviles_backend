import {Router} from 'express'
import {body} from 'express-validator'
import { AuthController } from '../controllers/AuthController'
import { handleInputErrors } from '../middleware/validation'

const router = Router()

router.post('/create-account',
    body('name')
    .notEmpty().withMessage('El nombre no puede ir vacio'),
    body('password')
    .isLength({min:8}).withMessage('El password es muy corto, minimo 8 caracteres'),
    body('password_confirmation').custom((value,{req})=>{
        if(value !== req.body.password){
            throw new Error('Los passwords no son iguales')
        }
        return true
    }),
    body('email')
    .notEmpty().withMessage('El email no puede ir vacio')
    .isEmail().withMessage('e-mail no valido'),
    handleInputErrors,
    AuthController.createAccount
)

router.post('/login',
    AuthController.iniciarSesion
)


export default router