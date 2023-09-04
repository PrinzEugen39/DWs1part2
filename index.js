const express = require("express");
const app = express();
const PORT = 5000;
const path = require("path");
const moment= require("moment")
const bcrypt = require("bcrypt");
const session = require("express-session");
const flash = require("express-flash");
const upload = require("./src/middleware/uploadFiles");

//sequelize init
const config = require("./src/config/config.json");
const { Sequelize, QueryTypes } = require("sequelize");
const sequelize = new Sequelize(config.development);


//hbs endpoint
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "src/views/"));
//static file endpoint
app.use(express.static(path.join(__dirname, "src/assets")));
app.use(express.static(path.join(__dirname, "src/uploads")));
//parsing data from client
app.use(express.urlencoded({ extended: false }));
//setup flash
app.use(flash())
//setup session
app.use(session({
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 1000 * 60 * 60 * 4
  },
  store: new session.MemoryStore(),
  saveUninitialized: true,
  resave: false,
  secret: "secretValue"
}))

//GET routing
app.get("/", home);
app.get("/contact", contact);
app.get("/blog", blog);
app.get("/blog-content/:id", blogcontent);
app.get("/edit-blog/:id", editBlog);
app.get("/delete/:id", deleteBlog);
app.get("/login", login);
app.get("/register", register);
app.get("/logout", logout);

//POST routing
app.post("/blog", upload.single('upload-image'),addBlog);
app.post("/edit-blog/:id", upload.single('upload-image'), updateBlog);
app.post("/register", registerUser);
app.post("/login", loginUser)

app.listen(PORT, () => {
  console.log(`API listening on PORT ${PORT} `);
});

module.exports = app;

//index
async function home(req, res) {
  try {
    let query = "";
    let obj = "";
    let data = "";

    if (req.session.idUser){
      query = `SELECT "Blogs".id, title, content, image, duration, js, nodejs, expressjs, reactjs, "Users".name AS author FROM "Blogs" LEFT JOIN "Users" ON "Blogs".author = "Users".id WHERE "Users".id = :idUser ORDER BY "Blogs".id DESC`;
      obj = await sequelize.query(query, { type: QueryTypes.SELECT,
        replacements: {
          idUser: req.session.idUser,
        }});    
        data = obj.map((res) => ({
          ...res,
          isLogin: req.session.isLogin,
          user: req.session.user,
        }));
    } else {
      query = `SELECT "Blogs".id, title, content, image, duration, js, nodejs, expressjs, reactjs, "Users".name AS author FROM "Blogs" LEFT JOIN "Users" ON "Blogs".author = "Users".id ORDER BY "Blogs".id DESC`;
      obj = await sequelize.query(query, { type: QueryTypes.SELECT,});  
      data = obj.map((res) => ({
        ...res,
        isLogin: req.session.isLogin,
        user: req.session.user,
      }));  
    }
    let loginCheck = {
      isLogin: req.session.isLogin,
      user: req.session.user
    }
    // console.log(data);
    res.render("index", { dataFake: data, loginCheck });
  } catch (error) {
    console.log(error);
  }
}

//project
function blog(req, res) {
  let loginCheck = {
    isLogin: req.session.isLogin,
    user: req.session.user
  }
  res.render("blog", { loginCheck });
}

//contact
function contact(req, res) {
  res.render("contact");
}

//add a new project
async function addBlog(req, res) {
  try {
    const { title, content, startDate, endDate } = req.body;
    const image = req.file.filename;
    const author = req.session.idUser;

    const query = `INSERT INTO "Blogs" (title, content, image, duration, "startDate", "endDate", js, nodejs, expressjs, reactjs, "postAt", "createdAt", "updatedAt", author) VALUES ('${title}', '${content}', '${image}', '${dateDuration(startDate,endDate)}','${startDate}', '${endDate}', :js, :nodejs, :expressjs, :reactjs, NOW(), NOW(), NOW(), ${author})`;

    await sequelize.query(query, {
      replacements : {
        js: req.body.js ? true : false,
        nodejs: req.body.nodejs ? true : false,
        expressjs: req.body.expressjs ? true : false,
        reactjs: req.body.reactjs ? true : false,
      }, type: QueryTypes.INSERT
    });

    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
}
//edit blog
    async function editBlog(req, res) {
      try {
        if (!req.session.isLogin) {
          res.redirect("/login");
          return;
        }
        const { id } = req.params;
        const query = `SELECT * FROM "Blogs" WHERE id=${id}`;
        let obj = await sequelize.query(query, { type: QueryTypes.SELECT });

        const data = obj.map((res) => ({
          ...res,
          isLogin: req.session.isLogin,
          user: req.session.user,
          startDate: moment(res.startDate).format('YYYY-MM-DD'),
          endDate: moment(res.endDate).format('YYYY-MM-DD')
        }));
                
        let loginCheck = {
          isLogin: req.session.isLogin,
          user: req.session.user
        }

        res.render("edit-blog", { dataFake: data[0], loginCheck });
      } catch (error) {
        console.log(error);
      }
    }
    const fs = require("fs");
    async function updateBlog(req, res) {
      try {
        const { id } = req.params;
        const { title, content, startDate, endDate} =req.body;
        const image = req.file ? req.file.filename: null;

        // Get old image dari uploads
        const oldImage = `SELECT image FROM "Blogs" WHERE id = '${id}'`;
        const [oldImageResult] = await sequelize.query(oldImage);
        const oldImageFilename = oldImageResult[0].image;

        // Delete old image dari uploads jika ada diganti dengan image baru
        if (image) {
          fs.unlinkSync(`src/uploads/${oldImageFilename}`);
        }
        
        const query = `UPDATE "Blogs" SET
        title = '${title}',
        content = '${content}',
        ${image ? `image = '${image}',` : ''}
        "startDate" = '${startDate}',
        "endDate" = '${endDate}',
        duration = '${dateDuration(startDate, endDate)}',
        "updatedAt" = NOW(),
        js=:js,
        nodejs=:nodejs,
        expressjs=:expressjs,
        reactjs=:reactjs  
        WHERE id = '${id}'`;
  
        await sequelize.query(query, {
          replacements: {
            js: req.body.js ? true : false,
            nodejs: req.body.nodejs ? true : false,
            expressjs: req.body.expressjs ? true : false,
            reactjs: req.body.reactjs ? true : false,
          }, type: QueryTypes.UPDATE
        });
        res.redirect("/");
      } catch (error) {
        console.log(error);
      }
    }

//data project detail
async function blogcontent(req, res) {
  try {
    const { id } = req.params;
    const query = `SELECT "Blogs".id, title, content, image, duration, js, nodejs, expressjs, reactjs, "Blogs"."createdAt", 
    "Users".name AS author FROM "Blogs" 
    LEFT JOIN "Users" ON "Blogs".author = "Users".id WHERE "Blogs".id=${id};`;
    let obj = await sequelize.query(query, { type: QueryTypes.SELECT });

    const data = obj.map((res) => ({
      ...res,
      isLogin: req.session.isLogin,
      user: req.session.user,
    }));
    let loginCheck = {
      isLogin: req.session.isLogin,
      user: req.session.user
    }
    res.render("blog-content", { dataFake: data[0], loginCheck});
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
function login (req, res) {
  res.render('login')
}

async function loginUser (req, res) {
  try {
    const { email, password } = req.body;
    const query = `SELECT * FROM "Users" WHERE email = '${email}'`
    let obj = await sequelize.query(query, { type: QueryTypes.SELECT })
    console.log(obj);
    //check if email is valid
    if(!obj.length) {
      req.flash("danger", "Please enter a valid email");
      return res.redirect("login");
    }
    await bcrypt.compare(password, obj[0].password, (err, result) => {
      if (!result) {
        req.flash("danger", "Wrong password");
        return res.redirect("login");
      } else {
        req.session.isLogin = true;
        req.session.idUser = obj[0].id;
        req.session.user = obj[0].name;
        console.log(req.session.idUser);
        req.flash("success", "login success");
        res.redirect("/")
      }
    })
  } catch (error) {
    console.log(error);
  }
}

function register (req, res) {
  res.render('register')
}

async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body;
    const salt = 10;
    // checking email
    const query = `SELECT * FROM "Users" WHERE email='${email}'`;
    let obj = await sequelize.query(query, { type: QueryTypes.SELECT });

    if (obj.length) {
      req.flash("danger", "Email has already exists");
      res.redirect("/register");
    } else {
          await bcrypt.hash(password, salt, (err, hashPw) => {
            const query = `INSERT INTO "Users" (name, email, password, "createdAt", "updatedAt") VALUES ('${name}', '${email}', '${hashPw}', NOW(), NOW())`
            sequelize.query(query)
          });
          res.redirect("login")
    }
  } catch (error) {
    console.log(error);
  }
}

function logout (req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    res.redirect("/");
  });
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
