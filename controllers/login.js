require("dotenv").config();
let db = require("../db");
let router = require("express").Router();
let mysql = require("mysql2");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const jwt = require("../utils/jwt-util");
const redisClient = require("../utils/redis");
const refresh = require("../utils/refresh");
const authJWT = require("../middleware/authJWT");

let connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DBNAME,
  port: process.env.DB_PORT,
});

router.get("/refresh", refresh);

router.get("/", authJWT, async (req, res) => {
  const user = req.signname;
  console.log(user);
  if (user) {

    res.render("index.html");
  } else {
    return res.render("login.html");
  }
});

router.get("/login", (req, res) => {
  res.render("login.html");
});

router.post("/login", async (req, res) => {
  let { signname, password } = req.body;
  const selectquery = `SELECT  * FROM admin where admin_signname = '${signname}'`;
  connection.query(selectquery, async (err, user) => {
    user = user[0];
    
    if (user) {
      const success = await bcrypt.compare(password, user.password);
      if (success) {
        const accessToken = jwt.sign(user);
        const refreshToken = jwt.refresh();

        console.log(" 1 sign",user.admin_signname)

        redisClient.set(user.admin_signname, refreshToken);
        res.cookie("authorization", "Bearer" + accessToken, {
          expires: new Date(Date.now() + 1000 * 60 * 60 * 2),
          httpOnly: true,
        });
        res.cookie("refresh", refreshToken, {
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
          httpOnly: true,
        });
        // res.setHeader("Authorization", "Bearer" + accessToken);
        // res.setHeader("Refresh", refreshToken);
        // res.status(200).send({
        //     ok: true,
        //     data : {
        //         accessToken,
        //         refreshToken
        //     }
        // });
        res.redirect("/");
      } else {
        res
          .status(401)
          .send(
            '<script>alert("비밀번호 오류");location.href="http://localhost:8090/"</script>'
          );
      }
    }
  });
});

router.get("/logout", (req, res) => {
  res.clearCookie("authorization");
  res.clearCookie("refresh");
  res.redirect("/");
});

module.exports = router;
