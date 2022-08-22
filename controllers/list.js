let db = require("../db");
let router = require("express").Router();
let {
  Editor,
  Field,
  Validate,
  Format,
  Options,
} = require("datatables.net-editor-server");

// get요청
router.get("/api/list", async function (req, res) {
  var body = req.body;

  // console.log(req.params);
  // console.log(req.query.created_at);
  // console.log(req.query);
  // console.log(req.body.name);
  // console.log("body 1", body);
  // console.log("body 2", body.data.created_at);
  let editor = new Editor(db, "users").fields(
    new Field("signname"),
    new Field("name"),
    new Field("phone"),
    new Field("position"),
    new Field("tel"),
    new Field("created_at")
      // .SetValue(new Date().toISOString())
      .validator(
        Validate.dateFormat(
          "YYYY-MM-DD",
          null,
          new Validate.Options({
            message: "Please enter a date in the format yyyy-mm-dd",
          })
        )
      )
      .getFormatter(Format.sqlDateToFormat("YYYY-MM-DD"))
      .setFormatter(Format.formatToSqlDate("YYYY-MM-DD")),
    new Field("updated_at")
      // .SetValue(new Date().toISOString())
      .validator(
        Validate.dateFormat(
          "YYYY-MM-DD",
          null,
          new Validate.Options({
            message: "Please enter a date in the format yyyy-mm-dd",
          })
        )
      )
      .getFormatter(Format.sqlDateToFormat("YYYY-MM-DD"))
      .setFormatter(Format.formatToSqlDate("YYYY-MM-DD"))
  );

  await editor.process(req.body);
  res.json(editor.data());
});

// post 요청
router.post("/api/list", async function (req, res) {
  var body = req.body;

  // console.log(req.params);
  // console.log(req.query.created_at);
  // console.log(req.query);
  // console.log(req.body.name);
  // console.log("body 1", body);
  // console.log("body 2", body.data.created_at);
  let editor = new Editor(db, "users").fields(
    new Field("signname"),
    new Field("name"),
    new Field("phone"),
    new Field("position"),
    new Field("tel"),
    new Field("created_at")
      // .SetValue(new Date().toISOString())
      .validator(
        Validate.dateFormat(
          "YYYY-MM-DD",
          null,
          new Validate.Options({
            message: "Please enter a date in the format yyyy-mm-dd",
          })
        )
      )
      .getFormatter(Format.sqlDateToFormat("YYYY-MM-DD"))
      .setFormatter(Format.formatToSqlDate("YYYY-MM-DD")),
    new Field("updated_at")
      // .set(2)
      .setValue(new Date().toISOString())
      .validator(
        Validate.dateFormat(
          "YYYY-MM-DD",
          null,
          new Validate.Options({
            message: "Please enter a date in the format yyyy-mm-dd",
          })
        )
      )
      .getFormatter(Format.sqlDateToFormat("YYYY-MM-DD"))
      .setFormatter(Format.formatToSqlDate("YYYY-MM-DD"))
  );

  await editor.process(req.body);
  res.json(editor.data());
});

module.exports = router;
