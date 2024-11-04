import { Router } from "express";
import { userRouter } from "./user";
import { adminRouter } from "./admin";
import { spaceRouter } from "./space";
import { Signup } from "../controllers/Signup";
import { Signin } from "../controllers/Signin";
export const route = Router();


route.post("/signup",Signup);
route.post("/signin",Signin);
route.get("/elemets")
route.get("/avatars")

route.use("/user",userRouter)
route.use("/space",spaceRouter)
route.use("/admin",adminRouter)

route.get("/",(req,res)=>{
    res.send("helllloo just for test")
})


