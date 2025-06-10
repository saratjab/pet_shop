import Adopt, { IAdopt } from '../models/adoptModel';
import Pets, { IPet } from '../models/petModel';
import { HydratedDocument } from 'mongoose';
import { findUserById } from '../service/userService';
import { findPetById } from '../service/petService';
import { ObjectId } from 'mongodb';

export const isPetValid = async (pets: string[]): Promise<HydratedDocument<IPet>[]> => {
    // const petsData = await Promise.all(
    //     pets.map(async pet => await findPetById( pet ))
    // )
    const petsData = await Pets.find({
        _id: { $in: pets }
    });
    if(petsData.some( p => !p || p.isAdopted )){
        throw Error('One or more pets not found or already adopted');
    }
    return petsData;
}

export const isCustomerOld = async (user_id: string): Promise<boolean> => {
    const user = await Adopt.findOne({ user_id });
    if(user) return true;
    return false;
}

export const makePetsTrueAndGetTotal = async (pets: IPet[]): Promise<number> => {
    let total = 0;
    // await Promise.all(pets.map(async pet => {
    //     pet.isAdopted = true;
    //     total += pet.price;
    //     pet.save();
    // }))
    await Pets.updateMany(
        { _id: { $in: pets.map(pet => pet.id)}},
        { $set: { isAdopted: false}}
    );
    return total;
}

export const saveAdopt = async (user_id: string, adopt: {
    pets: string[],
    payMoney?: number,
}): Promise<HydratedDocument<IAdopt>> => {
    const user = await findUserById( user_id );
    const pets = await isPetValid( adopt.pets );
    const total = await makePetsTrueAndGetTotal( pets );
    const isOld = await isCustomerOld( user.id );

    let adoptDoc: HydratedDocument<IAdopt>;
    if(isOld){
        const userDB = await Adopt.findOne({ user_id: user.id });
        if(!userDB) throw Error ('user not found');
        adoptDoc = userDB;
        adoptDoc.pets.push(...adopt.pets);
        adoptDoc.total! += total;
        adoptDoc.payMoney! += adopt.payMoney ?? 0;
    }
    else{
        adoptDoc = new Adopt({
            user_id: user_id,
            pets: adopt.pets,
            payMoney: adopt.payMoney ?? 0,
            total: total
        })
    }
    if(adoptDoc.payMoney! < adoptDoc.total!){
        adoptDoc.status = 'pending';
    }
    else if(adoptDoc.payMoney === adoptDoc.total!){
        adoptDoc.status = 'completed';
    }
    else{
        let remaining = adoptDoc.payMoney! - adoptDoc.total!;
        adoptDoc.payMoney = adoptDoc.total!;
        throw Error(`remining ${remaining}$`);
    }

    return await adoptDoc.save();
}

export const findAllAdopts = async (): Promise<HydratedDocument<IAdopt>[]> => {
    const adopts = await Adopt.find({});
    if(!adopts || adopts.length === 0) throw Error('No Adopts found');
    return adopts;
}

export const findAdoptById = async (id: string): Promise<HydratedDocument<IAdopt> > => {
    const adopt = await Adopt.findById(id);
    if(!adopt) throw new Error('Adopt not found');
    return adopt;
}

export const findMyPets = async (user_id: string): Promise<HydratedDocument<IAdopt>> =>{
    const adopt = await Adopt.findOne({ user_id });
    if(!adopt) throw Error('no adoption');
    return adopt;
}

export const getMoney = async (user_id: string): Promise<{total: number, payMoney: number, remian: number}> =>{
    const adopt = await Adopt.findOne({ user_id });
    if(!adopt) throw Error('no adoption');
    return {
        total: adopt.total!,
        payMoney: adopt.payMoney!,
        remian: adopt.total! - adopt.payMoney!
    };
}

export const payments = async (user_id: string, money: number): Promise<{total: number, payMoney: number, remian: number}> =>{
    const adopt = await Adopt.findOne({ user_id });
    if(!adopt) throw Error('no adoption');
    adopt.payMoney! += money;
    if(adopt.payMoney! < adopt.total!){
        adopt.status = 'pending';
    }
    else if(adopt.payMoney === adopt.total!){
        adopt.status = 'completed';
    }
    else{
        let remaining = adopt.payMoney! - adopt.total!;
        adopt.payMoney = adopt.total!;
        adopt.status = 'completed';
    }
    await adopt.save();

    return {total: adopt.total!, payMoney: adopt.payMoney!, remian: adopt.total! - adopt.payMoney!}
}

export const meakPetsFalse = async (pets: string[]): Promise<void> => {
    await Promise.all(pets.map(async pet => {
        const nPet = await findPetById(pet);
        nPet.isAdopted = false;
        nPet.save();
    }))
}

export const cancelingPets = async (user_id: string, pets: string[]): Promise<HydratedDocument<IAdopt>> => {
    const adopt = await Adopt.findOne({ user_id });
    if(!adopt) throw Error('no adoption');
    let total = 0;
    let flag = true;
    const petDelete = await Promise.all( pets.map(async pet => {
        const dPet = await findPetById(pet);
        const objId = new ObjectId(pet);
        if(!adopt.pets.includes(objId.toString())){
            flag = false;
        }
        total += dPet.price;
        return dPet;
    }));
    
    if(!flag){
        throw Error('one or more pets not adopted by you');
    }
    meakPetsFalse(pets);
    let newTotal = adopt.total! - total;
    
    if(adopt.payMoney! >= newTotal ){
        adopt.payMoney = newTotal;
        adopt.status = 'completed';
    }
    else if(adopt.payMoney! < newTotal){
        adopt.status = 'pending';
    }
    adopt.pets = adopt.pets.filter(pet => !pets.includes(pet.toString()));

    adopt.total = newTotal;
    return await adopt.save();
    
}