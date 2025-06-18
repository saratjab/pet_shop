import axios from "axios";
import { handleError } from "../utils/handleErrors";
import { IPet } from "../models/petModel";

const Base_URL = 'http://localhost:300/api';

export const getAllPets = async (): Promise<IPet[]> => {
    try{
        const response = await axios.get<IPet[]>(`${Base_URL}/pets`);
        return response.data;
    }
    catch (err: any) {
        throw err
    }
}