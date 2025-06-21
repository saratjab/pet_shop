import axios from "axios";
import { IPet } from "../models/petModel";

const BaseURL = 'http://localhost:3000/api';

export const getAllPets = async (): Promise<IPet[]> => {
    try{
        const response = await axios.get<IPet[]>(`${BaseURL}/pets`);
        return response.data;
    }catch(err){
        console.error('Error in getAllPets:', err);
        throw err;
    }
}