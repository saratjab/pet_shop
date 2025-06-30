import { IUser } from "../models/userModel";
import { IPet } from "../models/petModel";

export const formatUserResponse = (user: IUser) => ({
    username: user.username,
    role: user.role,
    email: user.email,
    address: user.address,
});

export const formatPetResponse = (pet: IPet) => ({
    petTag: pet.petTag,
    name: pet.name,
    kind: pet.kind,
    age: pet.age,
    price: pet.price,
    description: pet.description,
    gender: pet.gender,
    isAdopted: pet.isAdopted ? 'Yes' : 'No',
});