let db = require("../db");
let router = require("express").Router();
let {
  Editor,
  Field,
  Format,
  Options,
} = require("datatables.net-editor-server");

// 레미콘사 요청
router.all("/api/posts", async function (req, res) {
  let editor = new Editor(db, "posts").fields(
    // new Field("id").set(false),
    new Field("posts.type"),
    new Field("posts.title"),
    new Field("posts.content"),
    new Field("posts.created_at")
      .getFormatter(Format.sqlDateToFormat("YYYY-MM-DD"))
      .setFormatter(Format.formatToSqlDate("YYYY-MM-DD")),
    new Field("posts.updated_at")
      .getFormatter(Format.sqlDateToFormat("YYYY-MM-DD"))
      .setFormatter(Format.formatToSqlDate("YYYY-MM-DD"))
  );
  await editor.process(req.body);
  res.json(editor.data());
});

module.exports = router;
