let db = require("../db");
let router = require("express").Router();
let {
  Editor,
  Field,
  Validate,
  Format,
  Options,
} = require("datatables.net-editor-server");

router.all("/api/list", async function (req, res) {
  // console.log(req.params);
  // console.log(req.body.created_at);
  // console.log(req.body.value);
  // console.log("req.query " + req.query);
  // console.log("req.query.created_at " + req.query.created_at);
  // console.log(req.body);
  var body = req.body;
  console.log(body);
  console.log(body.Field);
  let editor = new Editor(db, "users").fields(
    new Field("signname"),
    new Field("name"),
    new Field("phone"),
    new Field("position"),
    new Field("tel"),
    new Field("created_at").validator(
      Validate.dateFormat(
        "YYYY-MM-DD",
        null,
        new Validate.Options({
          message: "Please enter a date in the format yyyy-mm-dd",
        })
      )
    ),
    new Field("updated_at")
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

// router.get("/api/list", async function (req, res) {
//   let editor = new Editor(db, "users").fields(
//     new Field("signname"),
//     new Field("name"),
//     new Field("phone"),
//     new Field("position"),
//     new Field("tel"),
//     new Field("created_at").validator(
//       Validate.dateFormat(
//         "YYYY-MM-DD",
//         null,
//         new Validate.Options({
//           message: "Please enter a date in the format yyyy-mm-dd",
//         })
//       )
//     ),
//     new Field("updated_at")
//       .validator(
//         Validate.dateFormat(
//           "YYYY-MM-DD",
//           null,
//           new Validate.Options({
//             message: "Please enter a date in the format yyyy-mm-dd",
//           })
//         )
//       )
//       .getFormatter(Format.sqlDateToFormat("YYYY-MM-DD"))
//       .setFormatter(Format.formatToSqlDate("YYYY-MM-DD"))
//   );

//   await editor.process(req.body);
//   res.json(editor.data());
// });

module.exports = router;
