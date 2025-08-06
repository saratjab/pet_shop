import Pet from '../../models/petModel';
import { petBuilder } from "../builder/petBuilder";

jest.mock('../../config/logger');

describe('deletePets service', () => {
    let mockPets: any;

    beforeEach( async () => {
        mockPets = [
            petBuilder({ id: '1', petTag: 'tag1'}),
            petBuilder({ id: '2', petTag: 'tag2'}),
            petBuilder({ id: '3', petTag: 'tag3'}),
        ];
        await Pet.insertMany(mockPets);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    
})