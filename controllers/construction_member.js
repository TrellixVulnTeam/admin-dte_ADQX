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

router.all("/api/construction_member", async function (req, res) {
  let editor = new Editor(db, "users")
    .fields(
      new Field("users.id").set(false),
      new Field("users.name"),
      new Field("users.signname"),
      new Field("users.phone"),
      new Field("users.company_type").setValue("CONSTRUCTION"),
      new Field("users.company_id").options(
        new Options()
          .table("companies")
          .value("id")
          .label("name")
          .where((q) => {
            q.where("company_type", "=", "CONSTRUCTION");
          })
      ),
      new Field("users.position"),
      new Field("users.tel"),
      new Field("companies.name"),
      new Field("users.created_at")
        .getFormatter(Format.sqlDateToFormat("YYYY-MM-DD"))
        .setFormatter(Format.formatToSqlDate("YYYY-MM-DD")),
      new Field("users.updated_at")
        .getFormatter(Format.sqlDateToFormat("YYYY-MM-DD"))
        .setFormatter(Format.formatToSqlDate("YYYY-MM-DD"))
    )
    .leftJoin("companies", "users.company_id", "=", "companies.id")
    .where((q) => {
      //company_type , 건설사 or 레미콘
      q.where("users.company_type", "=", "CONSTRUCTION");
    });
  await editor.process(req.body);

  res.json(editor.data());
});

// 회사정보 얻어오기
router.get("/api/construction_member_info", async function (req, res) {
  req.body;

  let editor = new Editor(db, "companies")
    .fields(
      new Field("id").set(false),
      new Field("company_type"),
      new Field("name")
    )
    .where((q) => {
      //company_type , 건설사 or 레미콘
      q.where("company_type", "=", "CONSTRUCTION");
    });
  await editor.process(req.body);
  res.json(editor.data());
});

module.exports = router;
