import { SignupSchema } from "../types"
import client from "@repo/db/client"
export const Signup = async(req:any , res:any) => {
    const parsedData=SignupSchema.parse(req.body)
    if(!parsedData){
         res.status(400).json({msg:"Validation failed"})
         return
    }
    try{
       await client.user.create({
        data:{
            username:parsedData.username,
            password:parsedData.password,
            role:parsedData.type =="admin"? "Admin":"User",
        }
       })
    }
    catch(e){
        console.log("this is the error"+e)
    }
    res.json({msg:"hellooo wordl"})
  
    }
