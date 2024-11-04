import express from "express"
import client from "@repo/db/client"
import { route } from "./router/route"
const app=express()
const port =3000
app.use(express.json())

app.get("/",(req,res)=>{
    res.json({msg:"Server is healthy ur code has some issuse stupid"})
})
app.use("/api/v1",route)
app.listen(process.env.PORT || port,()=>{
    console.log(`listening to port ${port}`)
})
