import { Request, Response, Router } from "express";
import { AddElementSchema, CreateElementSchema, CreateSpaceSchema, DeleteElementSchema } from "../types";
import client from "@repo/db/client";
import { user } from "../middleware/user";

export const spaceRouter=Router()

spaceRouter.post("/",user, async(req,res)=>{
const parsedData=CreateSpaceSchema.safeParse(req.body)
if(!parsedData.success){
     res.status(400).json({
        msg:"Validation failed"
    }) 
    return
}
if(!parsedData.data.mapId){
  const space=  await client.space.create({
        data:{
            name:parsedData.data.name,
            width: parseInt(parsedData.data.dimensions.split("x")[0]),
            height: parseInt(parsedData.data.dimensions.split("x")[1]),
            creatroId :req.body.userId as string
        }

    })
    res.json({msg:"Space created",spaceId: space.id})

}
const map = await client.map.findFirst({
    where: {
        id: parsedData.data.mapId
    }, select: {
        mapElements: true,
        width: true,
        height: true
    }
})
console.log("after")
if (!map) {
    res.status(400).json({message: "Map not found"})
    return
}
console.log("map.mapElements.length")
console.log(map.mapElements.length)
let space = await client.$transaction(async () => {
    const space = await client.space.create({
        data: {
            name: parsedData.data.name,
            width: map.width,
            height: map.height,
            creatroId: req.body.userId!,
        }
    });

    await client.spaceElements.createMany({
        data: map.mapElements.map(e => ({
            spaceId: space.id,
            elementId: e.elementId,
            x: e.x!,
            y: e.y!
        }))
    })

    return space;

})
console.log("space created")
res.json({spaceId: space.id})
})


spaceRouter.delete("/:spaceId",user,async(req,res)=>{
    const spaceId=req.params.spaceId
const space=await client.space.findUnique({
    where:{
        id:spaceId
    },select:{
        creatroId:true
    }
})
        if(space?.creatroId!==req.body.userId){
             res.status(403).json({msg:"Un_Authorizzzed"})
             return
        }
        await client.space.delete({
            where:{id:spaceId}
        })
        res.json({msg:"Space deleted"})
    
})


spaceRouter.get("/all",user,async(req,res)=>{
      const spaces=   await client.space.findMany({
        where:{creatroId:req.body.userId}
      })
      if(!spaces){
        res.status(400).json({msg:"No spaces can be found"})
      }

res.status(200).json({msg:"Users are ",data:spaces})


})


spaceRouter.post("/element",user,async(req,res)=>{
const parsedData=AddElementSchema.safeParse(req.body)
if(!parsedData.success){
    res.status(400).json({msg:"Validation failed"})
    return
}
const space =await client.space.findUnique({
    where:{
        id:req.body.spaceId,
        creatroId:req.body.userId
    },
    select:{
        width:true,
        height:true
    }


})
if(!space){
    res.status(400).json({msg:"Sopce not found"})
    return
}
const element=await client.spaceElements.create({
    data:{
        spaceId:parsedData.data.spaceId,
        elementId:parsedData.data.elementId,
        x:req.body.x,
        y:req.body.y, 
    }
})

    res.json({msg:"Elements added "})

})



spaceRouter.delete("/element",user,async(req,res)=>{
    console.log("spaceElement?.space1 ")
    const parsedData = DeleteElementSchema.safeParse(req.body)
    if (!parsedData.success) {
        res.status(400).json({message: "Validation failed"})
        return
    }
    const spaceElement = await client.spaceElements.findFirst({
        where: {
            id: parsedData.data.id
        }, 
        include: {
            space: true
        }
    })
    console.log(spaceElement?.space)
    console.log("spaceElement?.space")
    if (!spaceElement?.space.creatroId || spaceElement.space.creatroId !== req.body.userId) {
        res.status(403).json({message: "Unauthorized"})
        return
    }
    await client.spaceElements.delete({
        where: {
            id: parsedData.data.id
        }
    })
    res.json({message: "Element deleted"})
})






spaceRouter.get("/:spaceId",async(req,res)=>{
    const space=await client.space.findUnique({
        where:{
            id:req.params.spaceId

        },
        include: {
            elements: {
                include: {
                    element: true
                }
            },
        }
        

    })
    if(!space){
        res.status(400).json({msg:"Space not found"})
        return
    }

    res.json({
        "dimensions": `${space.width}x${space.height}`,
        elements: space.elements.map(e => ({
            id: e.id,
            element: {
                id: e.element.id,
                imageUrl: e.element.imageUrl,
                width: e.element.width,
                height: e.element.height,
                static: e.element.static
            },
            x: e.x,
            y: e.y
        })),
    })
})