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

// 건설사 내역관리 요청

router.all("/api/history", async function (req, res) {
  console.log("요청확인");
  let editor = new Editor(db, "spaces")
    .fields(
      new Field("spaces.id").set(false),
      new Field("spaces.name"),
      new Field("companies.name"),
      new Field("spaces.basic_address"),
      new Field("field_infos.start_at")
        .getFormatter(Format.sqlDateToFormat("YYYY-MM"))
        .setFormatter(Format.formatToSqlDate("YYYY-MM")),
      new Field("field_infos.end_at")
        .getFormatter(Format.sqlDateToFormat("YYYY-MM"))
        .setFormatter(Format.formatToSqlDate("YYYY-MM")),
      new Field("field_infos.payment_method"),
      new Field("users.name")
    )
    .leftJoin("companies", "spaces.company_id", "=", "companies.id")
    .leftJoin("field_infos", "spaces.field_info_id", "=", "field_infos.id")
    .leftJoin("users", "spaces.admin_user_id", "=", "users.id")
    .where((q) => {
      //company_type , 건설사 or 레미콘
      q.where("spaces.type", "=", "field");
    });
  await editor.process(req.body);
  res.json(editor.data());
});

module.exports = router;
