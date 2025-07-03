import { Request, Response } from 'express';
import { handleError } from '../utils/handleErrors';
import { formatAdoptResponse } from '../utils/format';
import { findAllAdopts, saveAdopt, findMyPets, getMoney, payments, cancelingPets, findAdoptById } from '../service/adoptService';

export const getAdoptions = async (req: Request, res: Response): Promise<void> => {
    try{
        const adoptions = await findAllAdopts();
        res.status(200).json(adoptions.map(adopts => (formatAdoptResponse(adopts))));
    }catch(err: any){
        const errors = handleError(err);
        res.status(404).json( errors );
    }
}

export const adoption = async (req: Request, res: Response): Promise<void> => {
    try{
        const user_id = req.user.id;
        if(!user_id){
            throw Error('User not found');
        }
        const adopt = req.body;
        const savedAdopt = await saveAdopt(user_id, adopt);
        res.status(201).json(formatAdoptResponse(adopt));
    }catch(err: any) {
        const errors = handleError(err);
        res.status(400).json( errors );
    }
} 

export const getMyPets = async (req: Request, res: Response): Promise<void> => {
    try{
        const user_id = req.user.id;
        if(!user_id){
            throw Error('User not found');
        }
        const pets = await findMyPets(user_id);
        res.status(200).json(formatAdoptResponse(pets))
    }catch(err: any){
        const errors = handleError(err);
        res.status(404).json( errors );
    }
}

export const getRemains = async (req: Request, res: Response): Promise<void> => {
    try{
        const user_id = req.user.id;
        if(!user_id){
            throw Error('User not found');
        }
        const infoPay = await getMoney(user_id);
        res.status(200).json( infoPay );
    }catch(err: any){
        const errors = handleError(err);
        res.status(400).json( errors );
    }
}

export const payment = async (req: Request, res: Response): Promise<void> => {
    try{
        const money = req.body.payMoney;
        const user_id = req.user.id;
        if(!user_id){
            throw Error('User not found');
        }
        const pays = await payments(user_id, money);
        res.status(200).json( pays );
    }catch(err: any){
        const errors = handleError(err);
        res.status(400).json( errors );
    }
} 

export const cancelPets = async (req: Request, res: Response): Promise<void> => {
    try{
        const pets = req.body.pets;
        const user_id = req.user.id;
        const adopt = await cancelingPets(user_id, pets);
        res.status(200).json( adopt );
    }catch(err: any){
        const errors = handleError(err);
        res.status(400).json( errors );
    }
} 

export const getAdoption = async (req: Request, res: Response): Promise<void> => {
    try{
        const adopt_id = req.params.id;
        const adopt = await findAdoptById(adopt_id);
        res.status(200).json(formatAdoptResponse(adopt));
    }catch(err: any){
        const errors = handleError(err);
        res.status(400).json( errors );
    }
}