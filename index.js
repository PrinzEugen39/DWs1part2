const express = require("express");
const app = express();
const PORT = 5000;
const path = require("path");
const moment= require("moment")

//sequelize init
const config = require("./src/config/config.json");
const { Sequelize, QueryTypes } = require("sequelize");
const sequelize = new Sequelize(config.development);

//hbs endpoint
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "src/views/"));
//static file endpoint
app.use(express.static(path.join(__dirname, "src/assets")));
//parsing data from client
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
async function home(req, res) {
  try {
    const query = `SELECT * FROM "Blogs"`;
    let obj = await sequelize.query(query, { type: QueryTypes.SELECT });

    const data = obj.map((res) => ({
      ...res,
      author: "PrinzEugen39",
    }));
    // console.log(data);
    res.render("index", { dataFake: data });
  } catch (error) {
    console.log(error);
  }
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
async function addBlog(req, res) {
  try {
    const { title, content, startDate, endDate } = req.body;
    const image = "https://iili.io/HpOXaV9.md.png";

    const query = `INSERT INTO "Blogs" (title, content, image, duration, "startDate", "endDate", js, nodejs, expressjs, reactjs, author, "postAt", "createdAt", "updatedAt") VALUES ('${title}', '${content}', '${image}', '${dateDuration(
      startDate,
      endDate
    )}','${startDate}', '${endDate}', true, true, true, true, 'PrinzEugen39', NOW(), NOW(), NOW())`;

    await sequelize.query(query);

    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
}
//edit blog
    async function editBlog(req, res) {
      try {
        const { id } = req.params;
        const query = `SELECT * FROM "Blogs" WHERE id=${id}`;
        let obj = await sequelize.query(query, { type: QueryTypes.SELECT });

        const data = obj.map((res) => ({
          ...res,
          startDate: moment(res.startDate).format('YYYY-MM-DD'),
          endDate: moment(res.endDate).format('YYYY-MM-DD')
        }));
        res.render("edit-blog", { dataFake: data[0] });
      } catch (error) {
        console.log(error);
      }
    }
    async function updateBlog(req, res) {
      try {
        const { id } = req.params;
        const { title, content, startDate, endDate } =
          req.body;
        
        const query = `UPDATE "Blogs" SET
        title = '${title}',
        content = '${content}',
        "startDate" = '${startDate}',
        "endDate" = '${endDate}',
        duration = '${dateDuration(startDate, endDate)}',
        "postAt" = NOW(),
        "updatedAt" = NOW(),
        "createdAt" = NOW()
        WHERE id = '${id}'`;
  
        await sequelize.query(query,);
  
        res.redirect("/");
        
      } catch (error) {
        console.log(error);
      }
    }

//data project detail
async function blogcontent(req, res) {
  try {
    const { id } = req.params;
    const query = `SELECT * FROM "Blogs" WHERE id=${id}`;
    let obj = await sequelize.query(query, { type: QueryTypes.SELECT });

    const data = obj.map((res) => ({
      ...res,
      author: "PrinzEugen39",
    }));
    res.render("blog-content", { dataFake: data[0] });
  } catch (error) {
    console.log(error);
  }
}

//delete blog
async function deleteBlog(req, res) {
  try {
    const { id } = req.params;
    await sequelize.query(`DELETE FROM "Blogs" WHERE id=${id}`);

    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
}

const dateDuration = (startDate, endDate) => {
  let start = new Date(startDate);
  let end = new Date(endDate);
  //duration
  let durationDiff = end.getTime() - start.getTime();
  let day = durationDiff / (1000 * 3600 * 24);
  let week = Math.floor(day / 7);
  let month = Math.floor(week / 4);
  let year = Math.floor(month / 12);

  if (year > 0) {
    return `${year} Tahun`;
  } else if (month > 0) {
    return `${month} Bulan`;
  } else if (week > 0) {
    return `${week} Minggu`;
  } else {
    return `${day} Hari`;
  }
};

// arr.push()
// const num = 9
// const arr = [4, 6, 2, 3];

// arr.push(num);
// console.log(arr);
