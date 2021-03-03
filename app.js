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

// ROUTES

app.get("/",function(req,res)
{
	   res.redirect("/blogs")
});



app.get("/blogs",function(req,res)
{
    Blog.find({}, function(err, blogs)
    {
    	if(err)
    	{
    		console.log("ERROR!!");
    	}
    	else
    	{
    		res.render("index",{blogs: blogs, currentUser: req.user});
    	}
    });
});

app.get("/blogs/new", isLoggedIn, function(req, res)
{
  res.render("new");
});

app.post("/blogs",function(req,res)
{ 
 
  Blog.create(req.body.blog,function(err,newBlog)
   {
      if(err)
      {
         res.render("/new");
      }
      else
      {
        res.redirect("/blogs");
      }
   });
});

app.get("/blogs/:id",function(req,res)
{
  Blog.findById(req.params.id, function(err,foundBlog)
  {
    if(err)
    {
      res.redirect("/blogs");
    } else 
    {
      res.render("show", {blog: foundBlog});

    }
  })
});

app.get("/blogs/:id/edit", function(req,res)
{
  Blog.findById(req.params.id, function(err, foundBlog)
  {
    if(err)
    {
      res.redirect("/blogs");
    }else
    {
      res.render("edit",{blog: foundBlog});
    }
  })
});

app.put("/blogs/:id", function(req, res)
{
  req.body.blog.body  = req.sanitize(req.body.blog.body)
  Blog.findOneAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog)
  {
    if(err)
      {
        res.redirect("/blogs");
      }else
      {
        res.redirect("/blogs/" + req.params.id);
      }
  });
});

app.delete("/blogs/:id", function(req, res)
{
    Blog.findOneAndDelete(req.params.id, function(err)
    {
        if(err)
        {
          res.redirect("/blogs");
        }else
        {
          res.redirect("/blogs");
        }
    });
});

// AUTH ROUTES

//show register form
app.get("/register", function(req, res)
{
  res.render("register");
})

// handle sign up
app.post("/register", function(req, res)
{
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err,user)
  {
    if(err)
    {
      console.log(err);
      return res.render("register")
    }
    passport.authenticate("local")(req,res, function()
    {
      res.redirect("/blogs");
    })
  })
})

// show login form 

app.get("/login", function(req, res)
{
  res.render("login");
})

// handle login logic

app.post("/login",passport.authenticate("local", 
{
  successRedirect: "/blogs",
  failureRedirect: "/login"
}), function(req, res)
{});

// logout route

app.get("/logout", function(req, res)
{
  req.logOut();
  res.redirect("/blogs")
});

function isLoggedIn(req, res, next)
{
  if(req.isAuthenticated())
  {
    return next();
  }
  res.redirect("/login");
}

let PORT = 3000;
app.listen(PORT,function()
{
  console.log("Server started at localhost :  " +    PORT);
});
