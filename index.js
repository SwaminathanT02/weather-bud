// IMPORTS
import express from "express";
import ejs from "ejs";
import axios from "axios";

// CONSTANTS
const app = express();
const port = 3000;
const apiKey = "30a287fbb4cc9aa3e2f1990408f5c574";

// MIDDLEWARE
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));

// ROUTE HANDLERS | API REQ-RES
app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.post("/send-request", async (req, res) => {
    console.log(req.body);
    try{
        const response = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${req.body.city}&limit=1&appid=${apiKey}`);
        console.log(response.data);
        const cdts = {
            lat: response.data[0].lat,
            lon: response.data[0].lon
        };
        console.log(cdts);
        //https://api.openweathermap.org/data/2.5/forecast?lat=57&lon=-2.15&cnt=3&appid={API key}
        const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${cdts.lat}&lon=${cdts.lon}&appid=${apiKey}`);
        console.log(weatherResponse.data);
        res.render("index.ejs", {
            cityData: response.data,
            weather: weatherResponse.data,
            apiKey: apiKey
        });
    } catch (error){
        console.log(error.message);
        res.render("index.ejs", {
            error: "City not found! Try again!"
        });
    }
});

// LISTENER
app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});