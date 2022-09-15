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

// 관리자 회원 요청
router.all("/api/admin_member", async function (req, res) {
  console.log("관리자회원 요청확인");
  let editor = new Editor(db, "admin").fields(
    new Field("admin_signname").validator(
      Validate.dbUnique(
        new Validate.Options({ message: "이미 가입된 아이디가 있습니다." })
      )
    ),
    new Field("password"),
    new Field("type"),
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
