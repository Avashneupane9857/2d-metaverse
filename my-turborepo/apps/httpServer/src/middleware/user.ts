import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../config"
export const user=(req:any,res:any,next:any)=>{
 const header=req.headers.authorization
 console.log(header)
 const token=header?.split(" ")[1]
    if(!token){
        return res.status(403).json({msg:"Unauthorized user user"})
    }
    try{
        const decoded=jwt.verify(token,JWT_SECRET) as {role:string,userId:string}
        if(decoded.role !== "User"){
return res.status(403).json({msg:"Bro u are not admin"})
        }
    //    req.userId=decoded.userId yesma body bata hudaina lah remember that when yo passes it goes we can access buy req.userId
    req.userId = decoded.userId
       next()
    }catch(e){
    
        return res.status(403).json({msg:"user auth failed"})
    }

}