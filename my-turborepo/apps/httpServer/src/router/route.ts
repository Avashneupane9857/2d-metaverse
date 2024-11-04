import { Router } from "express";
import { userRouter } from "./user";
import { adminRouter } from "./admin";
import { spaceRouter } from "./space";
import { Signup } from "../controllers/Signup";
export const route = Router();


route.post("/signup",Signup);
route.post("/signin", (req, res) => {
  res.json({ msg: "Helooo from signin" });
});
route.get("/elemets",(req,res)=>{

})
route.get("/avatars",(req,res)=>{
  
})

route.use("/userRouter",userRouter)
route.use("/spaceRouter",spaceRouter)
route.use("/adminRouter",adminRouter)