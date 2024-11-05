import { Router } from "express";
import { admin } from "../middleware/admin";
import { AddElementSchema, CreateAvatarSchema, CreateElementSchema, CreateMapSchema, UpdateElementSchema } from "../types";
import client from "@repo/db/client";

export const adminRouter=Router()

adminRouter.post("/element",admin,async(req,res)=>{
    const parsedData=CreateElementSchema.safeParse(req.body)
    if(!parsedData.success){
        res.status(400).json({msg:"Validation error"})
        return
    }
const element=await client.element.create({
data:{
    width:parsedData.data.width,
    height:parsedData.data.height,
    static:parsedData.data.static,
    imageUrl:parsedData.data.imageUrl

}
    })
    res.json({
        msg:"element created",
        id:element.id
    })

})
adminRouter.put("/element/:elementId",async(req,res)=>{
const parsedData=UpdateElementSchema.safeParse(req.body)
if(!parsedData.success){
    res.status(400).json({msg:"Validation error"})
    return
}
await client.element.update({
    where:{
        id:req.params.elementId
    },
    data:{
        imageUrl:parsedData.data.imageUrl
    }
})
res.json({msg:"Elements updated"})
})

adminRouter.post("/avatar", async (req, res) => {
    const parsedData = CreateMapSchema.safeParse(req.body)
    if (!parsedData.success) {
        res.status(400).json({message: "Validation failed"})
        return
    }
    const avatar = await client.avatar.create({
        data: {
            name: parsedData.data.name,
            imageUrl: parsedData.data.thumbnail
        }
    })
    res.json({avatarId: avatar.id})
})

adminRouter.post("/map", async (req, res) => {
    const parsedData = CreateMapSchema.safeParse(req.body)
    if (!parsedData.success) {
        res.status(400).json({message: "Validation failed"})
        return
    }
    const map = await client.map.create({
        data: {
            name: parsedData.data.name,
            width: parseInt(parsedData.data.dimensions.split("x")[0]),
            height: parseInt(parsedData.data.dimensions.split("x")[1]),
            thumbnail: parsedData.data.thumbnail,
            mapElements: {
                create: parsedData.data.defaultElements.map(e => ({
                    elementId: e.elementId,
                    x: e.x,
                    y: e.y
                }))
            }
        }
    })

    res.json({
        id: map.id
    })
})