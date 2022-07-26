import express from "express";
import dotenv from "dotenv";
import cors from "cors"
import { MongoClient } from "mongodb";




dotenv.config();

const app=express();

app.use(express.json())
app.use(cors())


const PORT=process.env.PORT

// const MONGOURL="mongodb://localhost"
const MONGO_URL=process.env.MONGO_URL


 async function Connection(){
    const Client=new MongoClient(MONGO_URL);
    await Client.connect();
    console.log("Mongo Connected")
    return(Client)
}
 export const Client= await Connection();

app.get("/",function(req,res){
    res.send("HALL BOOKING API TASK")
})
//creating the rooms
app.post('/creating_room',async function (req,res){
    const {num_of_persons,amenities_available,prices,room_name,room_id}=req.body
     const create_room= await Client.db("HOTEL").collection("Rooms").insertOne({room_name:room_name,room_id:room_id,num_of_persons:num_of_persons,Amenities:amenities_available,prices:prices})
     if(create_room){
        res.status(200).send("Room created successfully")
     }else{
        res.status(400).send("something went worng")
     }
})
//Listing all rooms
app.get("/Listallrooms", async ()=>{
    const data = await Client.db("HOTEL").collection("Rooms").find({}).toArray()
    res.status(200).send(data)
})
//Booking the rooms
app.post("/Booking",async ()=>{
    const {room_name,date,start_time,end_time,room_id,customer_name,customeer_phone_number}=req.body

    const room_exist= await Client.db("HOTEL").collection("Rooms").findOne({room_id:room_id})
    if(room_exist){
        const Booking= await Client.db("HOTEL").collection(room_name).insertOne({customer_name:customer_name,customeer_phone_number:customeer_phone_number,room_name:room_name,date:date,start_time:start_time,end_time:end_time,room_id:room_id})
        const customers= await Client.db("HOTEL").collection("customers").insertOne({customer_name:customer_name,customeer_phone_number:customeer_phone_number,room_name:room_name,date:date,start_time:start_time,end_time:end_time,room_id:room_id})
        res.status(200).send("Room booked successfully")
    }
    else{
        res.status(400).send("Room not exist")
    }
})
//Listing all customers
app.get("/Allcustomers", async ()=>{
    const data = await Client.db("HOTEL").collection("customers").find({}).toArray()
    res.status(200).send(data)
})

app.listen(PORT,()=>{
console.log(`PORT started in ${PORT}`)
})