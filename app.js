import express from 'express';
import bodyParser from 'body-parser';
import https from 'https';
import ejs from 'ejs';
import _ from 'lodash';
import mongoose from 'mongoose';

const homeStartingContent = "This website is for the blogs,you can store your blogs and also view them.\nYou can also create new blogs by using /compose and that will be stored in database hosted on MongoDB.";
const aboutContent = "Hi,\nI am Rahul R Mahawar.\nAndroid/Fullstack Web Developer.\nThis site is for Blogs that you can play with\nIt is using Node.js along with EJS,JS,HTML,CSS.";
const contactContent = "Rahul R Mahawar.\nEmail: rahul.mahawar.img@gmail.com";

mongoose.set('strictQuery', false);
mongoose.connect("mongodb+srv://admin-rahul:cullen000@cluster0.mhrmtrf.mongodb.net/blogDB", { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();

app.set('view engine', 'ejs');
app.use(express.static("resources"));
app.use(bodyParser.urlencoded({ extended: true }));

//create schema
const postSchema = ({
  title: String,
  content: String
});

//create model
const PostModel = mongoose.model("Post", postSchema);

app.get("/", function (req, res) {

  PostModel.find({}, function (err, posts) {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
    });
  });
});
app.get("/about", function (req, res) {
  res.render("about", {
    aboutContent: aboutContent
  });
});
app.get("/contact", function (req, res) {
  res.render("contact", {
    contactContent: contactContent
  });
});
app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {

  //create document
  const post = new PostModel({
    title: req.body.inputTitle,
    content: req.body.postField
  });
  post.save(function (err) {
    if (!err) {
      res.redirect("/");
    }
  });
});
app.get("/posts/:postId", function (req, res) {
  const requestedPostId = req.params.postId;

  PostModel.findOne({ _id: requestedPostId }, function (err, post) {
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}


app.listen(port, function () {
  console.log("Server started on " + port);
});
