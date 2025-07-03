import Pets, { IPet, UPet } from '../models/petModel';
import { HydratedDocument } from 'mongoose';

export const findAllPets = async (): Promise<HydratedDocument<IPet>[]> => {
    const pets = await Pets.find({ isAdopted: false });
    return pets;
}

export const findPetById = async (id: string): Promise<HydratedDocument<IPet>> => {
    const pet = await Pets.findById(id);
    if(!pet) throw Error('pet not found');
    return pet;
}

export const findPetByPetTag = async (petTag: string): Promise<HydratedDocument<IPet>> => {
    const pet = await Pets.findOne({ petTag: petTag, isAdopted: false });
    if(!pet) throw Error('pet not found');
    return pet;
}

export const filter = async (query: {kind?: string, age?: number, price?: number, gender?: string, isAdopted?: boolean}): Promise<HydratedDocument<IPet>[]> =>{
    const pets = await Pets.find(query);
    return pets;
}

export const savePet = async (pet: IPet): Promise<HydratedDocument<IPet>> => {
    const newPet = new Pets(pet);
    const savedPet = await newPet.save();
    if(!savedPet) throw Error(`Error saving pet`);
    return savedPet;
}

export const updatePets = async (pet: IPet ,petP : UPet): Promise<HydratedDocument<IPet>> => {
    Object.assign(pet, petP);
    return await savePet(pet);
}

export const filterAgePrice = async({from, to, by}: {
from: number | undefined, 
to: number | undefined,
by: string}) : Promise<HydratedDocument<IPet>[]> => {
    let query: any = {};
    if(from && to){ 
        query[by] = {$gte: from, $lte: to};
    }
    else if(from){
        query[by] = {$gte: from};
    }
    else if(to){
        query[by] = {$lte: to};
    }
    const pets = await Pets.find(query);
    return pets;
}

export const findAllPetsByAdmin = async (): Promise<HydratedDocument<IPet>[]> => {
    const pets = await Pets.find({});
    return pets;
}

export const deletePets = async (id?: string[], petTag?: string[]): Promise<void> => {
    if(id){
        await Pets.deleteMany({
            _id: { $in: id }
        });
    }
    if(petTag){
        await Pets.deleteMany({
            petTag: { $in: petTag }
        });
    }
}