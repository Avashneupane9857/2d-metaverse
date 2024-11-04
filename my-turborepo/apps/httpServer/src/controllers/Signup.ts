import { SignupSchema } from "../types/"
import client from "@repo/db/client"
import bcrypt from "bcrypt"
export const Signup = async(req:any , res:any) => {
    const parsedData=SignupSchema.parse(req.body)
    console.log(parsedData)
    if(!parsedData){
         res.status(400).json({msg:"Validation failed"})
         return
    }
    try{
    const hashedPassword= await bcrypt.hash(parsedData.password,10)
    console.log(hashedPassword)
    const user= await client.user.create({
        data:{
            username:parsedData.username,
            password:hashedPassword,
            role:parsedData.type =="admin"? "Admin":"User",
        }
       })
       res.json({
        userId:user.id
       })
    }
    catch(e){
        res.status(400).json({msg:"Duplication of data or any else error"})
        console.log("this is the error"+e)
    }
  
    }
