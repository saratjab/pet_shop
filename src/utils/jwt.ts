import jwt from "jsonwebtoken";

export const generateToken = (userId: string) => {
    return jwt.sign({userId}, process.env.ACCESS_TOKEN_SECRET! , {
        expiresIn: "30S" 
    });
}

export const generateRefreshToken = (userId: string) => {
    return jwt.sign({ userId }, 
        process.env.REFRESH_TOKEN_SECRET! ,
        { expiresIn: "1d" }
    );
}