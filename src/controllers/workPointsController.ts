import {Request, Response} from 'express'
import sumWorkedHours from '../utils/sumWorkedHours'
import db from '../database/connection'
import * as Yup from 'yup'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'

dayjs.extend(customParseFormat)
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)
export default class WorkPointsController{
    async create(request: Request, response: Response){      
        const schema = Yup.object().shape({
            userId: Yup.number().required(),
            date: Yup.date().required(),
            entry: Yup.string().required(),
            lunchLeave: Yup.string().required(),
            lunchEntry: Yup.string().required(),
            leave: Yup.string().required()
        })

        let errors
        try {            
         await schema.validateSync(request.body, {abortEarly:false})
        }catch(err){
            errors = err.errors
        }
        if(errors){
            return response.status(400).json({error: 'Falha na Validação dos Dados', errors})
        }

        const {userId,date, entry, lunchLeave, lunchEntry, leave} = request.body

        const hasUser  = await db('employees').where('id','=',userId)

        console.log(dayjs())

        if(hasUser.length === 0){
            return response.status(401).json({
                error: 'Usuário Inexistente'
            })

        }

        const consultDate = await db('work_points').where({
            employee_id: userId,
            date: dayjs(date).format('YYYY-MM-DD HH:mm:ss'),
        })
        

        if(consultDate.length>0){
            return response.status(400).json({
                error: 'Horarios deste dia já foram inseridos'
            })
        }


        try{
            const newWorkPoint = await db('work_points').insert({
                employee_id: userId,
                date: dayjs(date).format('DD-MM-YYYY'),
                entry,
                lunchLeave,
                lunchEntry,
                leave,
                workedHours: sumWorkedHours(entry, lunchLeave, lunchEntry, leave)
            })
            const workPointCreated = await db('work_points').where('id','=', newWorkPoint)
            return response.status(201).json({
                status:'success',
                data: workPointCreated[0]
            })

        }catch(err){
            return response.status(400).json({
                error: 'Falha ao adicionar Dia de Trablaho',
                data:err
            })
        }
    }

    async index (request: Request, response: Response){

        const {startDate, finalDate} = request.query
        //@ts-ignore
        const userId = request.userId

        const employee = await db('employees').where('id','=',Number(userId))

        let fDate

        if(startDate && !finalDate){
            fDate = dayjs()
        }else{
            fDate = finalDate
        }

        if(employee.length > 0){          
            let employeeWorkDays = await db('work_points').where('employee_id','=',Number(userId))
            if(employeeWorkDays.length > 0){
                if(startDate){                    
                    //@ts-ignore
                    const startAux = dayjs(startDate, 'DD/MM/YYYY')
                    //@ts-ignore
                    const endAux = dayjs(fDate, 'DD/MM/YYYY')
                    const filtered = employeeWorkDays.filter((item:any)=>{
                        const auxItem = dayjs(item.date, 'DD/MM/YYYY')
                        if(dayjs(endAux).isSameOrAfter(auxItem)&& dayjs(startAux).isSameOrBefore(auxItem)){
                            return true
                        }else{
                            return false
                        }
                    })    
                    employeeWorkDays = filtered
                }
                return response.status(200).json({
                    user:{
                        ...employee[0],
                        workedDays: employeeWorkDays
                    },
                })
            }else{
                return response.status(200).json({
                    user:{
                        ...employee[0],
                        error: 'Usuário ainda não possui registro de horas trabalhadas'
                    }
                })
            }
        }else{
            return response.status(400).json({
                error: 'Usuário não cadastrado'
            })
        } 
    }
}