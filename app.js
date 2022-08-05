const express = require('express');
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose  = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("Article", articleSchema);

//--------------------------------Request Tragesting All Aticles--------------------------------------------
 
app.route('/articles')

.get(function(req, res) {
  Article.find(function(err,foundArticles) {
        if(!err) {
         res.send(foundArticles);
        } else {
         res.send(err);
        }
  });
})

.post(function(req, res) {

  const newArticle = new Article ({
   title: req.body.title,
   content: req.body.content
  });

  newArticle.save(function(err) {
    if(!err) {
     res.send("Succesfully add the new title");
    } else {
     res.send(err);
    }
  });
})

.delete(function(req, res) {
  Article.deleteMany(function(err) {
    if(!err){
      res.send("Successfully deleted all the articles");
    } else {
      res.send(err);
    }
  })
});


//--------------------------------Request Tragesting A Aticle--------------------------------------------

app.route("/articles/:articleTitle")

.get(function(req, res){
   Article.findOne({title: req.params.articleTitle}, function(err, foundArticle) {
     if(foundArticle) {
      res.send(foundArticle);
     } else {
      res.send("No Articles matching found");
     }
   });
})

.put(function(req, res){
  Article.updateOne(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    function(err) {
      if(!err) {
        res.send("Sucessfully Updated");
      }
    }
  )
})

.patch(function(req,res) {
  Article.updateOne(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err) {
      if(!err) {
        res.send("Sucessfullyupdated the article.")
      } else {
        res.send(err);
      }
    }
  )
})

.delete(function(req, res) {
  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err) {
      if(!err) {
        res.send("Successfully deleted the article.");
      } else {
        res.send(err);
      }
    }
  )
});

app.listen(3000, function(){
  console.log("Server are runnig in pr=ort 3000");
});