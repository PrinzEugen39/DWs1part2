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
    startDate: "2023-08-01",
    endDate: "2023-08-10",
    duration: "2 Bulan",
    JS: false,
    nodeJS: false,
    expressJS: true,
    reactJS: false,
  },
  {
    title: "SATORARE",
    image: "https://iili.io/HpOX1cb.md.png",
    content:
      "For <button>, <input> and <option> elements, the value attribute specifies the initial value of the element.",
      startDate: "2023-08-01",
      endDate: "2023-08-10",
      duration: "1 Bulan",
      JS: true,
      nodeJS: true,
      expressJS: false,
      reactJS: true,
  },
  {
    title: "Viva Evolution",
    image: "https://iili.io/HpOXaV9.md.png",
    content:
      "SIDE SPLITTING. UNHOLY PINNACLE OF PAIN. you will laugh but i will cry",
      startDate: "2023-08-01",
      endDate: "2023-08-10",
      duration: "3 Minggu",
      JS: true,
      nodeJS: true,
      expressJS: true,
      reactJS: true,
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
  const {
  title, 
  content,
  startDate,
  endDate,
  JS,
  nodeJS,
  expressJS,
  reactJS,
  } = req.body;
  let start = new Date(startDate);
  let end = new Date(endDate);
  if (start > end) {
    return alert("End date should be greater than start date");
  }
  //duration
  let durationDiff = end.getTime() - start.getTime();
  let day = durationDiff / (1000 * 3600 * 24);
  let week = Math.floor(day / 7);
  let month = Math.floor(week / 4);
  let year = Math.floor(month / 12);
  let duration = " ";

  if (day > 0 ){
    duration = day + " Day";
  }
  if (week > 0){
    duration = week + " Week";
  }
  if (month > 0){
    duration = month + " Month";
  } 
  if (year > 0){
    duration = year + " Year";
  }

  const data = {
    title,
    content,
    image: "image/ripiuw/DONTLETYOUDOWN.png",
    startDate,
    endDate,
    duration,
    JS,
    nodeJS,
    expressJS,
    reactJS,
  };

  dataFake.push(data);

  res.redirect("/");
}
//edit blog
    function editBlog(req, res) {
      const { id } = req.params;
      res.render("edit-blog", { blog: dataFake[id], id });
    }
    function updateBlog(req, res) {
      const { id } = req.params;
      const { 
        title, 
        content,
        startDate,
        endDate,
        JS,
        nodeJS,
        expressJS,
        reactJS,
      } = req.body;
      let start = new Date(startDate);
      let end = new Date(endDate);
      if (start > end) {
        return alert("End date should be greater than start date");
      }
      //duration
      let durationDiff = end.getTime() - start.getTime();
      let day = durationDiff / (1000 * 3600 * 24);
      let week = Math.floor(day / 7);
      let month = Math.floor(week / 4);
      let year = Math.floor(month / 12);
      let duration = " ";
    
      if (day > 0 ){
        duration = day + " Day";
      }
      if (week > 0){
        duration = week + " Week";
      }
      if (month > 0){
        duration = month + " Month";
      } 
      if (year > 0){
        duration = year + " Year";
      }

      dataFake[id].title = title;
      dataFake[id].content = content;
      dataFake[id].JS = JS;
      dataFake[id].nodeJS = nodeJS;
      dataFake[id].expressJS = expressJS;
      dataFake[id].reactJS = reactJS;
      dataFake[id].duration = duration;
      
      res.redirect("/");
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


// arr.push()
// const num = 9
// const arr = [4, 6, 2, 3];

// arr.push(num);
// console.log(arr);
