import express from "express"
import client from "@repo/db/client"
import { route } from "./router/route"
const app=express()
const port =3000
app.use(express.json())
app.use("/api/v1",route)
app.listen(process.env.PORT || port,()=>{
    console.log(`listening to port ${port}`)
})
