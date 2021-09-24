import {Request, Response} from 'express'
import authConfig from '../config/auth'
import db from '../database/connection'
import * as Yup from 'yup'
import jwt from 'jsonwebtoken'

export default class UserController{
    async store(request: Request, response: Response){
        const schema = Yup.object().shape({
            userId: Yup.number().required(),
            password: Yup.string().required()
        })
        let errors
        try {            
         await schema.validateSync(request.body, {abortEarly:false})
        }catch(err){
            errors = err.errors
        }
        if(errors){
            return response.status(400).json({error: 'Falha na Validação', errors})
        }
         try{
            const {userId, password} = request.body;

            const currentUser = await db('employees').where('id','=', userId)
    
            if(currentUser.length > 0){
                const user = currentUser[0]
                if(user.password === password){
                    return response.status(200).json({
                        user: currentUser[0], 
                        token: jwt.sign({id: user.id}, authConfig.secret,{
                            expiresIn: authConfig.expiresIn
                        })})
                }else{
                    return response.status(400).json({error: 'Senha Incorreta'})
                }
            }else{
                return response.status(400).json({error: 'Usuário não encontrado'})
            }
         }catch(err){
            console.log(err)
             return response.status(400).json({error: 'Falha ao criar sessão de usuário'})
         }
        
    }
}