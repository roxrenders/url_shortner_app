const express = require("express");
const cookieParser = require('cookie-parser')
const {checkForAuthentication,  restrictTo} = require('./middlewares/auth')
const { connectToMongoDB } = require("./connect");
const path = require('path');
 
const URL = require("./models/url");

const urlRoute = require("./url");
const staticRoute = require('./routes/staticRouter')
const userRoute = require('./routes/user')

const app = express();
const PORT = 8002;

connectToMongoDB("mongodb://127.0.0.1:27017/short_url").then(() =>
  console.log("MongoDB connected")
);

app.set("view engine", "ejs")
app.set('views', path.resolve('./views'))

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkForAuthentication);


app.use("/url", restrictTo(["NORMAL"]), urlRoute);
app.use("/user", userRoute); 
app.use("/", staticRoute);

app.get("/url/:shortId", async (req, res) => {
    const shortId = req.params.shortId; 
    const entry = await URL.findOneAndUpdate(
      {
        shortId,
      },
      {
        $push: {
          visitHistory: {
            timestamp: Date.now(),
          },
        },
      }
    );
    
if (entry && entry.redirectURL) {
  res.redirect(entry.redirectURL);
} else 
{res.status(404).send('Redirect URL not found.');}
  });
  

app.listen(PORT, () => console.log(`server started at PORT:${PORT}`));
