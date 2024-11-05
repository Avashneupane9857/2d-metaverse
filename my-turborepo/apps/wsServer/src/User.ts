import {WebSocket} from "ws"
import { RoomManager } from "./RoomManager"
import { OutgoingMessage } from "./config";

export function getRandom(length:number){
    const character = "Saibaba9857";
  
    let finalRand = "";
    
    for (let i = 0; i < length; i++) {
      finalRand += character.charAt(Math.floor(Math.random() * character.length));
    }
    return finalRand
}

export class User{
    public id:string;
    constructor(private ws:WebSocket){
        this.id=getRandom(10)

    }
    initHandler(){
        this.ws.on("message",(data)=>{
            const parsedData=JSON.parse(data.toString())
            switch (parsedData.type){
                case "join":
                    const spaceId=parsedData.payload.spaceId
                    RoomManager.getInstance().addUser(spaceId,this);
                    this.send({
                        type:"space-joined",
                        payload:{
                         spaceId:spaceId,
                         userId:this.id
                    
                        }
                    })
            }
        })
    }
    send(payload:OutgoingMessage){
        this.ws.send(JSON.stringify(payload))
    }
}