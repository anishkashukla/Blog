var express     = require("express");
var router      = express.Router();
var Blog        = require("../models/blog");

// INDEX - SHOW ALL BLOGS

router.get("/",function(req,res)
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

// ADD NEW BLOG

router.get("/new", isLoggedIn, function(req, res)
{
  res.render("new");
});

router.post("/",function(req,res)
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

//

router.get("/:id",function(req,res)
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

// EDIT BLOG

router.get("/:id/edit", function(req,res)
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

router.put("/:id", function(req, res)
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

// DELETE BLOG

router.delete("/:id", function(req, res)
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

// middleware

function isLoggedIn(req, res, next)
{
  if(req.isAuthenticated())
  {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;