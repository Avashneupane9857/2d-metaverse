import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../config"
export const admin=(res:any,req:any,next:any)=>{
 const header=req.headers["authorization"]
 const token=header?.split(" ")[1]
    if(!token){
        return res.status(403).json({msg:"Unauthorized user admin"})
    }
    try{
        const decoded=jwt.verify(token,JWT_SECRET) as {role:string,userId:string}
        if(decoded.role !== "Admin"){
return res.status(403).json({msg:"Bro u are not admin"})
        }
       req.userId=decoded.userId
       next()
    }catch(e){
    
        return res.status(403).json({msg:"admin auth failed"})
    }

}