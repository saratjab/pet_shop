import { IPet } from '../models/petModel';
import { Request, Response } from 'express';
import { findAllPets, savePet, findPetById, findPetByPetTag, filter, filterAgePrice, updatePets, findAllPetsByAdmin, deletePets } from '../service/petService';
import { handleError } from '../utils/handleErrors';

export const registerPet = async (req: Request, res: Response): Promise<void> => { 
    try {
        const newPet: IPet = req.body;
        if (!newPet.petTag || typeof newPet.petTag !== 'string') {
            throw Error('petTag is required and must be a string');
        }
        if (!newPet.name || typeof newPet.name !== 'string') {
            throw Error('Name is required and must be a string');
        }
        if (!newPet.kind || typeof newPet.kind !== 'string') {
            throw Error('Kind is required and must be a string');
        }
        if (typeof newPet.age !== 'number' || newPet.age <= 0) {
            throw Error('Age is required and must be a positive number');
        }
        if (typeof newPet.price !== 'number' || newPet.price <= 0) {
            throw Error('Price is required and must be a positive number');
        }
        if (newPet.description !== undefined && typeof newPet.description !== 'string') {
            throw Error('Description must be a string');
        }
        if (!newPet.gender || typeof newPet.gender !== 'string') {
            throw Error('Gender is required and must be a string');
        }
        if (newPet.isAdopted !== undefined && typeof newPet.isAdopted !== 'boolean') {
            throw Error('isAdopted must be a boolean');
        }
        const savedPet = await savePet(newPet);
        res.status(201).json({
            petTag: savedPet.petTag,
            name: savedPet.name,
            kind: savedPet.kind,
            age: savedPet.age,
            price: savedPet.price,
            description: savedPet.description,
            gender: savedPet.gender,
            isAdopted: savedPet.isAdopted
        }); 
    }
    catch(err: any){
        const errors = handleError(err);
        res.status(400).json( errors );
    }
} 

export const getPets = async (req: Request, res: Response): Promise<void> => {
    try{
        const allPets = await findAllPets();
        res.status(200).json(allPets.map(pet =>({
            petTag: pet.petTag,
            name: pet.name,
            kind: pet.kind,
            age: pet.age,
            price: pet.price,
            description: pet.description,
            gender: pet.gender,
        }) ));
    }
    catch(err: any) {
        const errors = handleError(err);
        res.json(404).json( errors );
    }
} 

export const getPetById = async (req: Request, res: Response): Promise<void> => {
    try{
        const pet = await findPetById(req.params.id);
        res.status(200).json({
            petTag: pet.petTag,
            name: pet.name,
            kind: pet.kind,
            age: pet.age,
            price: pet.price,
            description: pet.description,
            gender: pet.gender,
            isAdopted: pet.isAdopted ? 'Yes': 'No'
        });
    }
    catch(err: any) {
        const errors = handleError(err);
        res.status(404).json( errors );
    }
} 

export const getPetByPetTag = async (req: Request, res: Response): Promise<void> => {
    try{
        const pet = await findPetByPetTag(req.params.petTag);
        res.status(200).json({
            petTag: pet.petTag,
            name: pet.name,
            kind: pet.kind,
            age: pet.age,
            price: pet.price,
            description: pet.description,
            gender: pet.gender,
        });
    }catch(err: any) {
        const errors = handleError(err);
        res.status(404).json( errors );
    }
} 

export const filterPets = async (req: Request, res: Response): Promise<void> => {
    try{
        const { kind, gender } = req.query;
        const age = req.query.age ? parseInt(req.query.age as string) : undefined;
        const price = req.query.price ? parseInt(req.query.price as string) : undefined;
        const isAdopted = req.query.isAdopted === 'true' ? true : req.query.isAdopted === 'false' ? false : undefined;

        const pets = await filter({
            kind : kind as string | undefined,
            gender : gender as string | undefined, 
            age,
            price, 
            isAdopted
        });
        res.status(200).json(pets.map(pet => ({
            petTag: pet.petTag,
            name: pet.name,
            kind: pet.kind,
            age: pet.age,
            price: pet.price,
            description: pet.description,
            gender: pet.gender,
            isAdopted: pet.isAdopted ? 'Yes': 'No'
        })));
    }catch(err: any) {
        const errors = handleError(err);
        res.status(400).json( errors );
    }
} 

export const fromTo = async (req: Request, res: Response): Promise<void> => {
    try{
        const from = req.query.from ? parseInt(req.query.from as string) : null;
        const to = req.query.to ? parseInt(req.query.to as string) : null;

        if ((from !== null && (isNaN(from) || from <= 0)) || (to !== null && (isNaN(to) || to <= 0))) {
            throw Error(`Qurey parameters 'from' and 'to' must be a valid numbers`)
        }
        let by = '';
        if(req.originalUrl.includes('/age')){
            by = 'age';
        }else if(req.originalUrl.includes('/price')){
            by = 'price';
        }
        else{
            throw Error(`Invalid filter type. URL must include 'age' or 'pice'`)
        }

        const pets = await filterAgePrice({ from, to, by });
        res.status(200).json(pets.map(pet =>({
            petTag: pet.petTag,
            name: pet.name,
            kind: pet.kind,
            age: pet.age,
            price: pet.price,
            description: pet.description,
            gender: pet.gender,
            isAdopted: pet.isAdopted ? 'Yes': 'No'
        })));

        
    }catch(err: any){
        const errors = handleError(err);
        res.status(400).json( errors );
    }
} 

export const updatePet = async (req: Request, res: Response): Promise<void> => {
    try{
        const pet = req.body;
        if (pet.petTag && typeof pet.petTag !== 'string') {
            throw Error('petTag must be a string');
        }
        if (pet.name && typeof pet.name !== 'string') {
            throw Error('Name is must be a string');
        }
        if (pet.kind && typeof pet.kind !== 'string') {
            throw Error('Kind is must be a string');
        }
        if (pet.age !== undefined && (typeof pet.age !== 'number' || pet.age <= 0)) {
            throw Error('age must be a positive number');
        }
        if (pet.price !== undefined && (typeof pet.price !== 'number' || pet.price <= 0)) {
            throw Error('price must be a positive number');
        }
        if (pet.description !== undefined && typeof pet.description !== 'string') {
            throw Error('Description must be a string');
        }
        if (pet.gender && typeof pet.gender !== 'string') {
            throw Error('Gender and must be a string');
        }
        if (pet.isAdopted !== undefined && typeof pet.isAdopted !== 'boolean') {
            throw Error('isAdopted must be a boolean');
        }
        let updatedPet: IPet;
        if(req.originalUrl.includes('id')){
            updatedPet = await updatePets(await findPetById(req.params.id), pet);
        }
        else{
            updatedPet = await updatePets(await findPetById(req.params.petTag), pet);
        }
        res.status(200).json({
            petTag: updatedPet.petTag,
            name: updatedPet.name,
            kind: updatedPet.kind,
            age: updatedPet.age,
            price: updatedPet.price,
            description: updatedPet.description,
            gender: updatedPet.gender,
            isAdopted: updatedPet.isAdopted ? 'Yes': 'No'
        })

    }catch(err: any){
        const errors = handleError(err);
        res.status(400).json( errors );
    }
} 

export const getPetsByAdmin = async (req: Request, res: Response): Promise<void> => {
    try{
        const pets = await findAllPetsByAdmin();
        res.status(200).json(pets.map(pet => ({
            petTag: pet.petTag,
            name: pet.name,
            kind: pet.kind,
            age: pet.age,
            price: pet.price,
            description: pet.description,
            gender: pet.gender,
            isAdopted: pet.isAdopted ? 'Yes': 'No'
        })))
    }catch(err: any){
        const errors = handleError(err);
        res.status(404).json( errors );
    }
} 

export const deletePet = async (req: Request, res: Response): Promise<void> => {
    try{
        if(req.originalUrl.includes('id')){
            await deletePets(req.body.id);
        }else{
            await deletePets(undefined, req.body.petTag);
        }
        res.status(204).json({message: 'you deleted a pet'})
    }catch(err: any){
        const errors = handleError(err);
        res.status(400).json( errors ); 
    }
}