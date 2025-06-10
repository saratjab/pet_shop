import Pets, { IPet, UPet } from '../models/petModel';
import { HydratedDocument, Query } from 'mongoose';

export const findAllPets = async (): Promise<HydratedDocument<IPet>[]> => {
    const pets = await Pets.find({ isAdopted: false });
    if(pets.length === 0) throw Error('no pets found');
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

export const filter = async (option: {kind?: string, age?: number, price?: number, gender?: string, isAdopted?: boolean}): Promise<HydratedDocument<IPet>[]> =>{
    let query: any = {};
    if(option.kind) query.kind = option.kind;
    if(option.price !== undefined) query.price = option.price;
    if(option.age !== undefined) query.age = option.age;
    if(option.gender) query.gender = option.gender;
    if(option.isAdopted !== undefined) query.isAdopted = option.isAdopted;

    const pets = await Pets.find(query);
    if(pets.length === 0) throw Error('pet not found');
    return pets;
}

export const savePet = async (user: IPet): Promise<HydratedDocument<IPet>> => {
    const newPet = new Pets(user);
    const savedPet = await newPet.save();
    if(!savedPet) throw Error(`Error saving user`);
    return savedPet;
}

export const updatePets = async (pet: IPet ,petP : UPet): Promise<HydratedDocument<IPet>> => {
    if(petP.name)pet.name = petP.name;
    if(petP.kind)pet.kind = petP.kind;
    if(petP.age)pet.age = petP.age;
    if(petP.price)pet.price = petP.price;
    if(petP.description)pet.description = petP.description;
    if(petP.gender)pet.gender = petP.gender;
    if(petP.isAdopted)pet.isAdopted = petP.isAdopted;
    
    return await savePet(pet);
}

export const filterAgePrice = async({from, to, by}: {
from: number | null, 
to: number | null,
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
    if(pets.length === 0) throw Error('no pets found');
    return pets;
}

export const findAllPetsByAdmin = async (): Promise<HydratedDocument<IPet>[]> => {
    const pets = await Pets.find({});
    if(pets.length === 0) throw Error('no pets found');
    return pets;
}

export const deletePets = async (id?: string, petTag?: string): Promise<void> => {
    if(id){
        await Pets.findByIdAndDelete(id);
    }
    if(petTag){
        const petD = await findPetByPetTag(petTag);
        await Pets.findByIdAndDelete(petD.id);
    }
}