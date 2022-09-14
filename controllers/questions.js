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

// 1:1요청
router.all("/api/questions", async function (req, res) {
  console.log("1:1 요청확인");
  let editor = new Editor(db, "questions")
    .fields(
      new Field("questions.id"),
      new Field("questions.type"),
      new Field("questions.title"),
      new Field("questions.content"),
      new Field("questions.reply"),
      new Field("questions.attachments"),
      new Field("users.name"),
      new Field("users.phone"),
      new Field("companies.name"),
      new Field("companies.company_type"),
      new Field("questions.created_at")
        .getFormatter(Format.sqlDateToFormat("YYYY-MM-DD"))
        .setFormatter(Format.formatToSqlDate("YYYY-MM-DD")),
      new Field("questions.updated_at")
        .getFormatter(Format.sqlDateToFormat("YYYY-MM-DD"))
        .setFormatter(Format.formatToSqlDate("YYYY-MM-DD"))
    )
    .leftJoin("users", "questions.user_id", "=", "users.id")
    .leftJoin("companies", "users.company_id", "=", "companies.id");
  await editor.process(req.body);
  res.json(editor.data());
});

module.exports = router;
