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

// 레미콘사 회원 요청
router.all("/api/list", async function (req, res) {
  console.log("요청확인");
  let editor = new Editor(db, "users")
    .fields(
      new Field("users.id").set(false),
      new Field("users.signname"),
      new Field("users.name"),
      new Field("users.phone"),
      new Field("users.company_type").setValue("REMICON"),
      new Field("users.position"),
      new Field("users.tel"),
      new Field("users.created_at")
        .getFormatter(Format.sqlDateToFormat("YYYY-MM-DD"))
        .setFormatter(Format.formatToSqlDate("YYYY-MM-DD")),
      new Field("users.updated_at")
        .getFormatter(Format.sqlDateToFormat("YYYY-MM-DD"))
        .setFormatter(Format.formatToSqlDate("YYYY-MM-DD")),
      new Field("companies.name"),
      new Field("users.company_id").options(
        new Options()
          .table("companies")
          .value("id")
          .label("name")
          .where((q) => {
            q.where("company_type", "=", "REMICON");
          })
      )
    )
    .leftJoin("companies", "users.company_id", "=", "companies.id")
    .where((q) => {
      //company_type , 건설사 or 레미콘
      q.where("users.company_type", "=", "REMICON");
    });
  await editor.process(req.body);
  res.json(editor.data());
});

// 회사정보 얻어오기
router.get("/api/companies", async function (req, res) {
  console.log("요청확인");
  let editor = new Editor(db, "companies")
    .fields(
      new Field("id").set(false),
      new Field("company_type"),
      new Field("name")
    )
    .where((q) => {
      //company_type , 건설사 or 레미콘
      q.where("company_type", "=", "REMICON");
    });
  await editor.process(req.body);
  res.json(editor.data());
});

module.exports = router;
