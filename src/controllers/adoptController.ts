import { Request, Response } from 'express';
import { findAllAdopts, saveAdopt, findMyPets, getMoney, payments, cancelingPets, findAdoptById } from '../service/adoptService';
import { handleError } from '../utils/handleErrors';

export const adoption = async (req: Request, res: Response): Promise<void> => {
    try{
        const savedAdopt = await saveAdopt(req.user.id, req.body);
        res.status(201).json({
            user_id: savedAdopt.user_id,
            pets: savedAdopt.pets,
            payMoney: savedAdopt.payMoney,
            total: savedAdopt.total,
            status: savedAdopt.status
        })
    }catch(err: any) {
        const errors = handleError(err);
        res.status(400).json( errors );
    }
} //* Done

export const getAdoptions = async (req: Request, res: Response): Promise<void> => {
    try{
        const adoptions = await findAllAdopts();
        res.status(200).json(adoptions.map(adopts => ({
            user_id: adopts.user_id,
            pets: adopts.pets,
            payMoney: adopts.payMoney,
            total: adopts.total,
            status: adopts.status
        })))
    }catch(err: any){
        const errors = handleError(err);
        res.status(404).json( errors );
    }
} //* Done

export const getMyPets = async (req: Request, res: Response): Promise<void> => {
    try{
        const pets = await findMyPets(req.user?.id);
        res.status(200).json({    
            user_id: pets.user_id,
            pets: pets.pets,
            payMoney: pets.payMoney,
            total: pets.total,
            status: pets.status
        })
    }catch(err: any){
        const errors = handleError(err);
        res.status(404).json( errors );
    }
} //* Done

export const getRemains = async (req: Request, res: Response): Promise<void> => {
    try{
        const infoPay = await getMoney(req.user?.id);
        res.status(200).json( infoPay );
    }catch(err: any){
        const errors = handleError(err);
        res.status(400).json( errors );
    }
} //* Done

export const payment = async (req: Request, res: Response): Promise<void> => {
    try{
        const money = req.body.payMoney;
        const pays = await payments(req.user?.id, money);
        res.status(200).json( pays );
    }catch(err: any){
        const errors = handleError(err);
        res.status(400).json( errors );
    }
} //* Done

export const cancelPets = async (req: Request, res: Response): Promise<void> => {
    try{
        const pets = req.body.pets;
        const user_id = req.user?.id;
        const adopt = await cancelingPets(user_id, pets);
        res.status(200).json( adopt );
    }catch(err: any){
        const errors = handleError(err);
        res.status(400).json( errors );
    }
} //* Done

export const getAdoption = async (req: Request, res: Response): Promise<void> => {
    try{
        const adopt = await findAdoptById(req.body.adopt_id);
        res.status(200).json({
            user_id: adopt.user_id,
            pets: adopt.pets,
            payMoney: adopt.payMoney,
            total: adopt.total,
            status: adopt.status
        })
    }catch(err: any){
        const errors = handleError(err);
        res.status(400).json( errors );
    }
}
