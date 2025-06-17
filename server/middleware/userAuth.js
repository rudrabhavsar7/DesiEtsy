import jwt from "jsonwebtoken";


export const authUser =  (req, res, next) => {
  const {token} = req.cookies;

    if(!token){
        return res.json({success: false, message:"Not Authorized"});
    }
    
    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)

        if(tokenDecode.userId){
            req.userId = tokenDecode.userId;
        }
        else{
            return res.json({success: false, message:"Not Authorized"});
        }
        next();
    } catch (error) {
        return res.json({success: false, message: error.message});
    }
};
