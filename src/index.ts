import express from "express"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import cors from "cors"
import "dotenv/config"
import routers from "./routers"
import multer from "multer"

const app = express()
const PORT = parseInt(process.env.PORT as string)
const upload = multer()

app.use(cors({
    credentials: true,
    origin: process.env.ORIGIN_URL
}))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.any())


app.use("/", routers())
app.listen(PORT, ()=> {console.log("Server running in port http://localhost:"+PORT)})