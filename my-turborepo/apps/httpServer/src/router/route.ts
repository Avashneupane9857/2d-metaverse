import { Router } from "express";
import { userRouter } from "./user";
import { adminRouter } from "./admin";
import { spaceRouter } from "./space";
import { Signup } from "../controllers/Signup";
import { Signin } from "../controllers/Signin";
import client from "@repo/db/client";
export const route = Router();


route.post("/signup",Signup);
route.post("/signin",Signin);
route.get("/elements", async (req, res) => {
    const elements = await client.element.findMany()

    res.json({elements: elements.map(e => ({
        id: e.id,
        imageUrl: e.imageUrl,
        width: e.width,
        height: e.height,
        static: e.static
    }))})
})

route.get("/avatars", async (req, res) => {
    const avatars = await client.avatar.findMany()
    res.json({avatars: avatars.map(x => ({
        id: x.id,
        imageUrl: x.imageUrl,
        name: x.name
    }))})
})

route.use("/user",userRouter)
route.use("/space",spaceRouter)
route.use("/admin",adminRouter)

route.get("/",(req,res)=>{
    res.send("helllloo just for test")
})


