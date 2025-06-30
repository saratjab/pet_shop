import { IUser } from "../models/userModel";

export const formatUserResponse = (user: IUser) => ({
    username: user.username,
    role: user.role,
    email: user.email,
    address: user.address,
})