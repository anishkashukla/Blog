var bodyParser      = require("body-parser"),
methodOverride      = require("method-override"),
expressSanitizer    = require("express-sanitizer"),
mongoose            = require("mongoose"),
express             = require("express"),
passport            = require("passport"),
LocalStrategy       = require("passport-local"),
User                = require("./models/user"), 
Blog                = require("./models/blog"),
app                 = express();

// requiring routes

var blogRoutes  	  = require("./routes/blog"),
    authRoutes      = require("./routes/index");


mongoose.connect("mongodb://localhost/blog_app",{ useNewUrlParser: true, useUnifiedTopology: true });
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// PASSPORT CONFIGURATION 

app.use(require("express-session")
({
  secret : "Notes",
  resave : false,
  saveUnitialized : false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res, next)
{
  res.locals.currentUser  = req.user;
  next();
});

app.use("/",authRoutes);
app.use("/blogs", blogRoutes);


let PORT = 3000;
app.listen(PORT,function()
{
  console.log("Server started at localhost :  " +    PORT);
});
