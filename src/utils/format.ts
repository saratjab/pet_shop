import type { IUser } from '../models/userModel';
import type { IPet } from '../models/petModel';
import type { IAdopt } from '../models/adoptModel';

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

export const formatAdoptResponse = (adopt: IAdopt) => ({
  user_id: adopt.user_id,
  pets: adopt.pets,
  payMoney: adopt.payMoney,
  total: adopt.total,
  status: adopt.status,
});
