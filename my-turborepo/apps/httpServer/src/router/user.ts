import { Request, Response, Router } from "express";
import {  UpdateMetaverseSchema } from "../types";
import client from "@repo/db/client";
import { user } from "../middleware/user";
export const userRouter=Router()
userRouter.post("/metadata",user,async(req:Request,res:Response)=>{

    const parseData=UpdateMetaverseSchema.safeParse(req.body)
    if(!parseData.success){ res.status(403).json({msg:"Validation error brother"})}
   await client.user.update({
        where:{id: req.body.userId},
        data:{
            avatarId:parseData.data!.avatarId
        }
    })
    res.json({msg:"Metadata is updated"})

})
userRouter.get("/metadata/bulk",async(req,res)=>{
    const userIdString = (req.query.ids ?? "[]") as string;
    const userIds = (userIdString).slice(1, userIdString?.length - 1).split(",");
    console.log(userIds)
    const metadata = await client.user.findMany({
        where: {
            id: {
                in: userIds
            }
        }, select: {
            avatar: true,
            id: true
        }
    })

    res.json({
        avatars: metadata.map(m => ({
            userId: m.id,
            avatarId: m.avatar?.imageUrl
        }))
    })
})