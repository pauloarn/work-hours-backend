import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken'
import {promisify} from 'util'
import authConfig from '../config/auth'

export default async (request: Request, response:Response, next:NextFunction) =>{
    const authHeader= request.headers.authorization
    if(!authHeader){
        return response.status(401).json({error: 'Token não fornecido'})
    }

    const [,token] = authHeader.split(' ')

    try{
        const decoded = jwt.verify(token, authConfig.secret)
        //@ts-ignore
        request.userId = decoded.id;
        return next()
    }catch(e){
        return response.status(400).json({error: 'Token Invalido'})
    }
}