let db = require("../db");
let router = require("express").Router();
let {
  Editor,
  Field,
  Validate,
  Format,
  Options,
  Mjoin,
  SearchPaneOptions
} = require("datatables.net-editor-server");

// 레미콘사 get요청
router.all("/api/list", async function (req, res) {
  console.log("get요청");
  var body = req.body;
  // console.log(req.params);
  // console.log(req.query.created_at);
  // console.log(req.query);
  // console.log(req.body.name);
  // console.log("body 1", body);
  // console.log("body 2", body.data.created_at);
  console.log(req.body);
  console.log(req.query);
  let editor = new Editor(db, "users")
    .fields(
      new Field("users.signname"),
      new Field("users.name"),
      new Field("users.phone"),
      new Field("users.position"),
      new Field("users.tel"),
      new Field("users.created_at")
        // .SetValue(new Date().toISOString())
        .getFormatter(Format.sqlDateToFormat("YYYY-MM-DD"))
        .setFormatter(Format.formatToSqlDate("YYYY-MM-DD")),
      new Field("users.updated_at")
        // .SetValue(new Date().toISOString())
        .getFormatter(Format.sqlDateToFormat("YYYY-MM-DD"))
        .setFormatter(Format.formatToSqlDate("YYYY-MM-DD")),
      new Field("users.company_id").options(
        new Options().table("companies").value("id").label("name")
      ).searchPaneOptions(
				new SearchPaneOptions()
					.table('companies')
					.value('name')
      // new Field("name")
    )
    .leftJoin("companies", "users.company_id", "=", "companies.id")
    .field(
      new Field("companies.name").options(
        new Options().table("companies").value("id").label("name")
      )
    ));
  // .join(
  //   new Mjoin("companies")
  //     .link("users.company_id", "companies.id")
  //     .fields(new Field("name"))
  // )
  // .where({ company_type: "remicon" }); // users 테이블에 company_type이 remicon인 경우만
  await editor.process(req.body);
  res.json(editor.data());
});

// post 요청
// router.post("/api/list", async function (req, res) {
//   var body = req.body;

//   // console.log(req.params);
//   // console.log(req.query.created_at);
//   // console.log(req.query);
//   // console.log(req.body.name);
//   // console.log("body 1", body);
//   // console.log("body 2", body.data.created_at);
//   let editor = new Editor(db, "users").fields(
//     new Field("signname"),
//     new Field("name"),
//     new Field("phone"),
//     new Field("cname"),
//     new Field("position"),
//     new Field("tel"),
//     new Field("created_at")
//       // .SetValue(new Date().toISOString())
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
//       .setFormatter(Format.formatToSqlDate("YYYY-MM-DD")),
//     new Field("updated_at")
//       // .set(2)
//       .setValue(new Date().toISOString())
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
