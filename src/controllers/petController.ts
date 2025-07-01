import { IPet } from '../models/petModel';
import { Request, Response } from 'express';
import { findAllPets, savePet, findPetById, findPetByPetTag, filter, filterAgePrice, updatePets, findAllPetsByAdmin, deletePets } from '../service/petService';
import { handleError } from '../utils/handleErrors';
import { formatPetResponse } from '../utils/format';


export const registerPet = async (req: Request, res: Response): Promise<void> => { 
    try {
        const newPet: IPet = req.body;
        const savedPet = await savePet(newPet);
        res.status(201).json(formatPetResponse(savedPet)); 
    }
    catch(err: any){
        const errors = handleError(err);
        res.status(400).json( errors );
    }
} 

export const getPets = async (req: Request, res: Response): Promise<void> => {
    try{
        const allPets = await findAllPets();
        res.status(200).json(allPets.map(pet =>(formatPetResponse(pet))));
    }
    catch(err: any) {
        const errors = handleError(err);
        res.json(404).json( errors );
    }
}

export const getPetById = async (req: Request, res: Response): Promise<void> => {
    try{
        const id = req.params.id;
        let pet = await findPetById(id);
        res.status(200).json(formatPetResponse(pet));
    }catch(err: any){
        const errors = handleError(err);
        res.status(404).json( errors );
    }
}

export const getPetByPetTag = async (req: Request, res: Response): Promise<void> => {
    try{
        const petTag = req.params.petTag;
        let pet = await findPetByPetTag(petTag);
        res.status(200).json(formatPetResponse(pet));
    }catch(err: any){
        const errors = handleError(err);
        res.status(404).json( errors );
    }
}

export const filterPets = async (req: Request, res: Response): Promise<void> => {
    try{
        const query = req.query as {
            kind?: string,
            gender?: 'M' | 'F',
            age?: number,
            price?: number,
            isAdopted?: boolean
        };

        const pets = await filter(query);
        res.status(200).json(pets.map(pet => (formatPetResponse(pet))));
    }catch(err: any) {
        const errors = handleError(err);
        res.status(400).json( errors );
    }
} 

export const fromTo = (by: 'age' | 'price') => 
async (req: Request, res: Response): Promise<void> => {
    try{
        const { from, to } = req.query as {
            from?: number, 
            to?: number
        }
        const pets = await filterAgePrice({ from, to, by });
        res.status(200).json(pets.map(pet =>(formatPetResponse(pet))));   
    }catch(err: any){
        const errors = handleError(err);
        res.status(400).json( errors );
    }
} 

export const updatePetById = async (req: Request, res: Response): Promise<void> => {
    try{
        const updatedData = req.body;
        const id = req.params.id;
        const pet = await findPetById(id);
        const updatedPet = await updatePets(pet, updatedData);
        res.status(200).json(formatPetResponse(updatedPet));
    }catch(err: any){
        const errors = handleError(err);
        res.status(400).json( errors );
    }
}

export const updatePetByPetTag = async (req: Request, res: Response): Promise<void> => {
    try{
        const updatedData = req.body;
        const petTag = req.params.petTag;
        const pet = await findPetByPetTag(petTag);
        const updatedPet = await updatePets(pet, updatedData);
        res.status(200).json(formatPetResponse(updatedPet));
    }catch(err: any){
        const errors = handleError(err);
        res.status(400).json( errors );
    }
}

export const getPetsByAdmin = async (req: Request, res: Response): Promise<void> => {
    try{
        const pets = await findAllPetsByAdmin();
        res.status(200).json(pets.map(pet => (formatPetResponse(pet))))
    }catch(err: any){
        const errors = handleError(err);
        res.status(404).json( errors );
    }
} 

export const deletePetById = async (req: Request, res: Response): Promise<void> => {
    try{
        const id = req.body.id;
        await deletePets(id);
        res.status(204).json({message: 'you deleted pets'})
    }catch(err: any){
        const errors = handleError(err);
        res.status(400).json( errors ); 
    }
}

export const deletePetByPetTag = async (req: Request, res: Response): Promise<void> => {
    try{
        const petTag = req.body.petTag;
        await deletePets(undefined, petTag);
        res.status(204).json({message: 'you deleted pets'})
    }catch(err: any){
        const errors = handleError(err);
        res.status(400).json( errors ); 
    }
}