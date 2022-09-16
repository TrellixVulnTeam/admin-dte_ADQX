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

router.all("/api/construction", async function (req, res) {
  let editor = new Editor(db, "companies")
    .fields(
      new Field("company_type"),
      new Field("name"),
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
      q.where("company_type", "=", "CONSTRUCTION");
    });
  await editor.process(req.body);
  res.json(editor.data());
});

module.exports = router;
