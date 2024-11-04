import { SigninSchema } from "../types/index"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import client from "@repo/db/client"
const secret="Saibaba9857"
export const Signin=async(req:any,res:any)=>{
    const parsedData=SigninSchema.parse(req.body)
    if(!parsedData){
        res.status(403).json({msg:"Validation error"})
        return
    }
 
 try{   const user=await client.user.findUnique({
    where:{
        username:parsedData.username
    }
  })
  if(!user){
    return res.status(403).json({msg:"User not found"})

  }
  const isvalid=await bcrypt.compare(parsedData.password,user.password)
  if(!isvalid){
    return res.status(403).json({msg:"Invalid password"})

  }
  const token=jwt.sign(parsedData.username,secret)
  res.status(200).json({token:`${token}`})
}
catch(e){
    return res.status(403).json({msg:"user not found err in signin"})
    
}
}