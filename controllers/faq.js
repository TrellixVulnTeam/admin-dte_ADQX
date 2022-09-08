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
      .setFormatter(Format.formatToSqlDate("YYYY-MM-DD")),
    new Field("updated_at")
      .getFormatter(Format.sqlDateToFormat("YYYY-MM-DD"))
      .setFormatter(Format.formatToSqlDate("YYYY-MM-DD"))
  );

  await editor.process(req.body);
  res.json(editor.data());
});

module.exports = router;
