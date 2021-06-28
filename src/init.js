// mongodb+srv://metubeAdmin:<password>@cluster0.c0isc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
import "regenerator-runtime";
import "dotenv/config";
import "./db";
import "./models/Comment";
import "./models/User";
import "./models/Video";
import app from "./server";

const PORT = process.env.PORT || 4000;

const handleListening = () => console.log(`🚀 Listen on ${PORT} ✅`);

app.listen(PORT, handleListening);
