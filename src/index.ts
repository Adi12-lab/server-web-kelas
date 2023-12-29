import express from "express"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import cors from "cors"
import compression from "compression"
import "dotenv/config"
import routers from "./routers"

const app = express()
const PORT = parseInt(process.env.PORT as string)

app.use(cors())
app.use(compression())
app.use(cookieParser())
app.use(bodyParser.json())


app.use("/", routers())
app.listen(PORT, ()=> {console.log("Server running in port http://localhost:"+PORT)})