import {Request, Response} from 'express'
import db from '../database/connection'
import * as Yup from 'yup'
import convertHoursToMinutes from '../utils/convertHoursToMinutes'

export default class UserController{
    async create (request: Request, response: Response)  {

        const schema = Yup.object().shape({
            name: Yup.string().required(),
            password: Yup.string().required().min(6),
            hoursToWork: Yup.string().required(),
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
        const {name, password, hoursToWork} = request.body
        try{
            const newUser = await db('employees').insert({
                name,
                password,
                hoursToWork: convertHoursToMinutes(hoursToWork)
            })       
            const userCreated = await db('employees').where('id', '=', newUser)
            return response.status(201).json({
                status: 'success',
                data: userCreated[0]
            })
        }catch(e){
            return response.status(400).json({
                error: 'Falha ao adicionar Usuário',
                data:e
            })
        }
    }

    async index (request: Request, response: Response){
        //@ts-ignore
        const userId = request.userId
        if(userId){
            try{ 
                const user = await db('employees').where('id', '=', Number(userId))
                if(user.length>0){
                    return response.status(200).json({
                        user: {
                            userId: user[0].id,
                            name: user[0].name,
                            hoursToWork: user[0].hoursToWork
                        }
                    })
                }else{
                    return response.status(400).json({error: 'Usuário não encontrado'})
                }
            }catch(err){
                console.log(err.message)
                return response.status(400).json({
                    error: 'Falha ao procurar usuário',
                })
            }
        }else{
            return response.status(400).json({error: 'Usuário não encontrado'})
        }
    }
}