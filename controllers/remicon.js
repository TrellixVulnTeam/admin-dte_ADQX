let db = require("../db");
let router = require("express").Router();
let {
  Editor,
  Field,
  Validate,
  Format,
  Options,
  Mjoin,
  SearchPaneOptions,
} = require("datatables.net-editor-server");

// 레미콘사 요청
router.all("/api/remicon", async function (req, res) {
  // var idvalue = req.body.data;
  console.log("요청확인");
  let editor = new Editor(db, "companies")
    .fields(
      // new Field("id").set(false),
      new Field("name"),
      new Field("company_type").setValue("remicon"),
      new Field("address"),
      new Field("ceo_name"),
      new Field("created_at")
        .getFormatter(Format.sqlDateToFormat("YYYY-MM-DD"))
        .setFormatter(Format.formatToSqlDate("YYYY-MM-DD")),
      new Field("updated_at")
        .getFormatter(Format.sqlDateToFormat("YYYY-MM-DD"))
        .setFormatter(Format.formatToSqlDate("YYYY-MM-DD"))
    )
    .where((q) => {
      //company_type , 건설사 or 레미콘
      q.where("company_type", "=", "REMICON");
    });
  await editor.process(req.body);
  res.json(editor.data());
});

module.exports = router;
