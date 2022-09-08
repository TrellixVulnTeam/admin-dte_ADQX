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

// faq요청
router.all("/api/faq", async function (req, res) {
  console.log("faq요청확인");
  let editor = new Editor(db, "faqs").fields(
    new Field("id"),
    new Field("type"),
    new Field("title"),
    new Field("content"),
    new Field("created_at")
      .getFormatter(Format.sqlDateToFormat("YYYY-MM-DD"))
      .setFormatter(Format.formatToSqlDate("YYYY-MM-DD"))
  );
  // .where((q) => {
  //   //company_type , 건설사 or 레미콘
  //   q.where("users.company_type", "=", "REMICON");
  // });

  await editor.process(req.body);
  res.json(editor.data());
});

module.exports = router;
