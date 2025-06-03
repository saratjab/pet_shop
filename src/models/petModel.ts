import mongoose from "mongoose";

export interface IPet extends mongoose.Document {
  petTag: string,
  name: string;
  kind: string;
  age: number;
  price: number;
  description?: string;
  gender: 'M' | 'F';
  isAdopted: boolean;
}

export interface UPet extends mongoose.Document{
    name?: string;
    kind?: string;
    age?: number;
    price?: number;
    description?: string;
    gender?: 'M' | 'F';
    isAdopted?: boolean;
}

const petSchema = new  mongoose.Schema({
    petTag: {
        type: String,
        required: [true, 'Enter a petTag'],
        unique: true,
        lowercase: true
    },
    name: {
        type: String
    },
    kind: {
        type: String,
        required: [true, 'Enter the kind']
    },
    age: {
        type: Number,
        required: [true, 'Enter age']
    },
    price: {
        type: Number,
        required: [true, 'Enter the price']
    },
    description:{
        type: String
    },
    gender: {
        type: String,
        required: [true, 'Enter the gender'],
        enum: ['M', 'F']
    },
    isAdopted:{
        type: Boolean,
        required: [true, 'Is the pet Adopted or Not'],
        default: false
    }
}, {timestamps: true});

export default mongoose.model<IPet>('Pet', petSchema);
