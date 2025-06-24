import jwt from "jsonwebtoken";

export const generateToken = (userId: string) => {
    return jwt.sign({userId}, process.env.ACCESS_TOKEN_SECRET! , {
        expiresIn: "1H" 
    }); // ToDo: change the expiresIn

    //? jwt.sign(payload, secret, options);
    //! payload
    //{ userId } -> this is the data you want to include in the token / this means later you can extract the user ID from the token to find the logged-in user

    //! secret
    // process.env.JWT_SECRET! -> secret key used to sign the token/ ! -> tells TS that you are sure it's not undefied

    //! options
    // { expireIn: '20m'} -> that means the token expire in 20 minutes / 2h, 7d

    //? generates a jwt token that contains the user's id and is valid for 20 min
    //? that token can be sent to the client (browser, mobile app)
    //? on the future requests, the client includes this token so the server knows who they are
}

export const generateRefreshToken = (userId: string) => {
    return jwt.sign({ userId }, 
        process.env.REFRESH_TOKEN_SECRET! ,
        { expiresIn: "5D" }
    );
}