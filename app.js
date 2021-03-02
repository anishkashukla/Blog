var bodyParser      = require("body-parser"),
methodOverride      = require("method-override"),
expressSanitizer    = require("express-sanitizer"),
mongoose            = require("mongoose"),
express             = require("express"),
passport            = require("passport"),
LocalStrategy       = require("passport-local"),
User                = require("./models/user"), 
app                 = express();

mongoose.connect("mongodb://localhost/blog_app",{ useNewUrlParser: true, useUnifiedTopology: true });
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

var blogSchema =new mongoose.Schema
({
    title : String,
    image : String,
    body : String,
    created : {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog",blogSchema);

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
    		res.render("index",{blogs: blogs});
    	}
    });
});

app.get("/blogs/new", function(req, res)
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


let PORT = 3000;
app.listen(PORT,function()
{
  console.log("Server started at localhost" +    PORT);
});
