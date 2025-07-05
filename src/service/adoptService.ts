import Adopt, { IAdopt } from '../models/adoptModel';
import Pets, { IPet } from '../models/petModel';
import { HydratedDocument } from 'mongoose';
import { findUserById } from '../service/userService';

type paymentSummary = {
    total: number,
    payMoney: number,
    remaining: number
};

export const isPetValid = async (pets: string[]): Promise<HydratedDocument<IPet>[]> => {
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

export const getTotalPrice = async (pets: IPet[]): Promise<number> => {
    return pets.reduce((sum, pet) => sum + pet.price, 0);
}

export const makePetsAdopted = async (pets: IPet[]): Promise<void> => {
    await Pets.updateMany(
        { _id: { $in: pets.map(pet => pet.id)}},
        { $set: { isAdopted: true}}
    );
}

export const saveAdopt = async (adopt: IAdopt): Promise<HydratedDocument<IAdopt>> => {
    const user = await findUserById( adopt.user_id );
    const pets = await isPetValid( adopt.pets );
    const total = await getTotalPrice( pets) ;
    await makePetsAdopted( pets );
    const isOld = await isCustomerOld( user.id );

    let adoptDoc: HydratedDocument<IAdopt>;
    if(isOld){
        const userDB = await Adopt.findOne({ user_id: user.id });
        if(!userDB) throw Error ('user adoption not found');
        adoptDoc = userDB;
        adoptDoc.pets.push(...adopt.pets);
        adoptDoc.total! += total;
        adoptDoc.payMoney! += adopt.payMoney ?? 0;
    }
    else{
        adoptDoc = new Adopt({
            user_id: adopt.user_id,
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
    return adopts;
}

export const findAdoptById = async (id: string): Promise<HydratedDocument<IAdopt> > => {
    const adopt = await Adopt.findById(id);
    if(!adopt) throw Error('Adopt not found');
    return adopt;
}

export const findMyPets = async (user_id: string): Promise<HydratedDocument<IAdopt>> =>{
    const adopt = await Adopt.findOne({ user_id });
    if(!adopt) throw Error('no adoption');
    return adopt;
}

export const getMoney = async (user_id: string): Promise<paymentSummary> =>{
    const adopt = await Adopt.findOne({ user_id });
    if(!adopt) throw Error('no adoption');
    return {
        total: adopt.total!,
        payMoney: adopt.payMoney!,
        remaining: adopt.total! - adopt.payMoney!
    };
}

export const payments = async (user_id: string, money: number): Promise<paymentSummary> =>{
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
        adopt.payMoney = adopt.total!;
        adopt.status = 'completed';
    }
    await adopt.save();

    return {
        total: adopt.total!, 
        payMoney: adopt.payMoney!, 
        remaining: adopt.total! - adopt.payMoney! 
    };
}

export const makePetsNotAdopted = async (pets: IPet[]): Promise<void> => {
    await Pets.updateMany(
        { _id: { $in: pets.map(pet => pet.id)}},
        { $set: { isAdopted: true}}
    );
}

export const cancelingPets = async (user_id: string, pets: string[]): Promise<HydratedDocument<IAdopt>> => {
    const adopt = await Adopt.findOne({ user_id });
    if(!adopt) throw Error('No adoption found');
    
    const userAdoptedPets = adopt.pets.map(pet_id => pet_id.toString());
    const cancelablePetIds = pets.filter(id => userAdoptedPets.includes(id));

    if(cancelablePetIds.length === 0) throw Error(`None of the selected pets are part of the user's pets`);

    const petsToCancel = await Pets.find({
        _id: { $in: cancelablePetIds }
    });

    const total = await getTotalPrice(petsToCancel);

    await makePetsNotAdopted(petsToCancel);
    let newTotal = adopt.total! - total;
    
    if(newTotal === 0){
        adopt.payMoney = 0;
        adopt.status = 'cancelled';
    }
    else if(adopt.payMoney! >= newTotal ){
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