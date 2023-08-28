const express = require("express");
const app = express();
const PORT = 5000;
const path = require("path");

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "src/views/"));

app.use(express.static(path.join(__dirname, "src/assets")));
app.use(express.urlencoded({ extended: false }));
//data dummy
const dataFake = [
  {
    title: "Lucky 7",
    image: "https://iili.io/HpOXYo7.md.jpg",
    content:
      "Genius is one percent inspiration and ninety-nine percent perspiration.",
    postedAt: new Date(),
  },
  {
    title: "SATORARE",
    image: "https://iili.io/HpOX1cb.md.png",
    content:
      "For <button>, <input> and <option> elements, the value attribute specifies the initial value of the element.",
    postedAt: new Date(),
  },
  {
    title: "Viva Evolution",
    image: "https://iili.io/HpOXaV9.md.png",
    content:
      "SIDE SPLITTING. UNHOLY PINNACLE OF PAIN. you will laugh but i will cry",
    postedAt: new Date(),
  },
];

//GET and POST methods
app.get("/", home);
app.get("/contact", contact);
app.get("/blog-content/:id", blogcontent);
app.get("/blog", blog);
app.post("/blog", addBlog);
app.get("/delete/:id", deleteBlog);
app.get("/edit-blog/:id", editBlog);
app.post("/edit-blog/:id", updateBlog);
function updateBlog(req, res) {
  const { id } = req.params;
  const { title, content } = req.body;
  dataFake[id].title = title;
  dataFake[id].content = content;
  
  res.redirect("/");
}

app.listen(PORT, () => {
  console.log(`API listening on PORT ${PORT} `);
});

module.exports = app;

//index
function home(req, res) {
  res.render("index", { dataFake });
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

  const data = {
    title,
    content,
    image: "image/ripiuw/DONTLETYOUDOWN.png",
    postedAt: new Date(),
  };

  dataFake.push(data);

  res.redirect("/");
}
//edit blog
function editBlog(req, res) {
  const { id } = req.params;
  console.log(dataFake[id]);
  res.render("edit-blog", { blog: dataFake[id], id });
}

//data dummy
function blogcontent(req, res) {
  const { id } = req.params;

  res.render("blog-content", { blog: dataFake[id] });
}

//delete blog
function deleteBlog(req, res) {
  const { id } = req.params;

  dataFake.splice(id, 1);
  res.redirect("/");
}

// function updateBlog(req, res) {

//   const { title, content } = req.body;
//   const id = req.params; // The index of the blog in the dataFake array
//   const data = {
//     title,
//     content,
//     image: "image/ripiuw/DONTLETYOUDOWN.png",
//     postedAt: new Date(),
//   };
//   console.log(data);
//   // Update the blog data

//   dataFake.push(id, 1, data);
//   res.redirect("/");
// }

// function updateBlog(req, res) {
//   const { title, content} = req.body;
//   const { id } = req.params;



// 	res.redirect("/");
// }

// arr.push()
// const num = 9
// const arr = [4, 6, 2, 3];

// arr.push(num);
// console.log(arr);
