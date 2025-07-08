import Pets, { IPet } from '../models/petModel';
import { HydratedDocument } from 'mongoose';
import { getPetsQuery, updatePetType } from '../types/petTypes';

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

export const savePet = async (pet: IPet): Promise<HydratedDocument<IPet>> => {
    const newPet = new Pets(pet);
    const savedPet = await newPet.save();
    if(!savedPet) throw Error(`Error saving pet`);
    return savedPet;
}

export const updatePets = async (pet: IPet, petP: updatePetType): Promise<HydratedDocument<IPet>> => {
    Object.assign(pet, petP);
    return await savePet(pet);
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

export const filter = async (query: getPetsQuery): Promise<{ pets: HydratedDocument<IPet>[], total: number}> => {
    let newQuery: any = {};
    if(query.kind) newQuery.kind = query.kind;
    if(query.gender) newQuery.gender = query.gender;
    if(query.isAdopted !== undefined) newQuery.isAdopted = query.isAdopted;
    if(query.age) newQuery.age = query.age;
    else if(query.minAge || query.maxAge){
        newQuery.age = {};
        if(query.minAge) newQuery.age.$gte = query.minAge;
        if(query.maxAge) newQuery.age.$lte = query.maxAge;
    }
    if(query.price) newQuery.price = query.price;
    else if(query.minPrice || query.maxPrice){
        newQuery.price = {};
        if(query.minPrice) newQuery.price.$gte = query.minPrice;
        if(query.maxPrice) newQuery.price.$lte = query.maxPrice;
    }

    const skip = (query.page - 1) * query.limit;

    const [pets, total] = await Promise.all([
            Pets.find(newQuery).sort({ [query.sortBy!]: query.order }).skip(skip).limit(query.limit),
            Pets.countDocuments(),
    ]);
    return { pets, total };
}