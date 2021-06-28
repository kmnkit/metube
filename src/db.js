import mongoose from 'mongoose';

mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

const db = mongoose.connection;

const handleOpen = () => console.log("🚀 Connected to DB 👍");
const handleError = (err) => console.log("❌ DB Error 😭", err);

db.on("error", handleError).once("open", handleOpen);