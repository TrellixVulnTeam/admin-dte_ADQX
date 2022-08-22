let db = require("../db");
let router = require("express").Router();
let {
  Editor,
  Field,
  Validate,
  Format,
  Options,
  Mjoin,
} = require("datatables.net-editor-server");

router.all("/api/construction_member", async function (req, res) {
  let editor = new Editor(db, "users").fields(
    new Field("users.name"),
    new Field("users.signname"),
    new Field("users.phone"),
    new Field("users.company_id"),
    new Field("users.position"),
    new Field("users.tel"),
    new Field("users.created_at")
      .getFormatter(Format.sqlDateToFormat("YYYY-MM-DD"))
      .setFormatter(Format.formatToSqlDate("YYYY-MM-DD")),
    new Field("users.updated_at")
      .getFormatter(Format.sqlDateToFormat("YYYY-MM-DD"))
      .setFormatter(Format.formatToSqlDate("YYYY-MM-DD"))
  ).join(
    new Mjoin("companies").link('users.company_id',"companies.id")
    .fields(
      new Field('name')
    )
  );

  await editor.process(req.body);
  res.json(editor.data());
});

module.exports = router;
