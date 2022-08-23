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
  let editor = new Editor(db, "users2").fields(
    new Field("users2.id").set(false),
    new Field("users2.name"),
    new Field("users2.signname"),
    new Field("users2.phone"),
    new Field("users2.company_id").options(
      new Options().table('companies2').value('id').label('name')
    ),
    new Field("users2.position"),
    new Field("users2.tel"),
    new Field("users2.created_at")
      .getFormatter(Format.sqlDateToFormat("YYYY-MM-DD"))
      .setFormatter(Format.formatToSqlDate("YYYY-MM-DD")),
    new Field("users2.updated_at")
      .getFormatter(Format.sqlDateToFormat("YYYY-MM-DD"))
      .setFormatter(Format.formatToSqlDate("YYYY-MM-DD"))
  ).leftJoin("companies2", 'users2.company_id',"=","companies2.id")
   .field(
    new Field('companies2.name')
   )
  ;

  await editor.process(req.body);
  console.log("req.body")
  res.json(editor.data());
});

module.exports = router;
