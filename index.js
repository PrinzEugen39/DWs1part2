const express = require("express");
const app = express();
const PORT = 5000;
const path = require("path");

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "src/views/"));

app.use(express.static(path.join(__dirname, "src/assets")));

app.use(express.urlencoded({ extended: false }));

app.get("/", home);
app.get("/contact", contact);
app.get("/blog", blog);
app.post("/blog", addBlog);
app.get("/blog-content/:id", blogcontent);

app.listen(PORT, () => {
  console.log(`API listening on PORT ${PORT} `)
});

module.exports = app

//index
function home(req, res) {
  res.render("index");
}

//project
function blog(req, res) {
  res.render("blog");
}

//contact
function contact(req, res) {
  res.render("contact");
}

//add a new project
function addBlog(req, res) {
  const { title, content } = req.body;
  console.log(title);
  console.log(content);

  res.redirect("/");
}

function blogcontent(req, res) {
  const { id } = req.params;

  const data = {
    id,
    title: "Bing Chilling 🍦",
    content: "The Tiananmen Square Massacre 反右派鬥爭 The Anti-Rightist Struggle  Glnd Valen 动态网自由门 天安門 天安门 法輪功 李洪志 Free Tibet Cultural Revolution 人權 Human Rights 民運 Democratization 自由 ",
  };

  res.render("blog-content", {data});
}
