const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes.js");


const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("api/v1/", userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});