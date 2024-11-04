import { Request, Response, Router } from "express";
import { UpdateElementSchema, UpdateMetaverseSchema } from "../types";
import client from "@repo/db/client";
import { user } from "../middleware/user";

export const userRouter=Router()
userRouter.post("/metadata",user,(req:Request,res:Response)=>{

    const parseData=UpdateMetaverseSchema.safeParse(req.body)
    if(!parseData.success){ res.status(403).json({msg:"Validation error brother"})}
    client.user.update({
        where:{id: req.body.userId},
        data:{
            avatarId:parseData.data!.avatarId
        }
    })

})
userRouter.get("/metadata/bulk",(req,res)=>{

})