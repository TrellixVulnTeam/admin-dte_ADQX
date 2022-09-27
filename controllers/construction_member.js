let db = require("../db");
let router = require("express").Router();
let knex = require("knex");
let {
  Editor,
  Field,
  Validate,
  Format,
  Options,
  Mjoin,
  SearchPaneOptions,
} = require("datatables.net-editor-server");

//건설사 회원
router.all("/api/construction_member", async function (req, res) {
  let editor = new Editor(db, "users")
    .fields(
      new Field("users.id"),
      new Field("users.name"),
      new Field("users.signname"),
      new Field("users.phone"),
      new Field("users.company_type").setValue("CONSTRUCTION"),
      new Field(
        "concat((select name from spaces where site_user_id = users.id and type='field' group by site_user_id),' 외 ', (select count(a.site_user_id)-1 from spaces a where a.site_user_id=users.id group by a.site_user_id),'건')",
        "cnt"
      ),
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

//건설사 회원이 속한 현장리스트 조회
router.all("/api/construction_fieldlist_table/:id", async function (req, res) {
  console.log("asdgsg", req.params.id);
  let editor = new Editor(db, "spaces")
    .fields(
      new Field("spaces.id"),
      new Field("spaces.name"),
      new Field("spaces.basic_address"),
      new Field("spaces.admin_user_id").options(
        new Options().table("users").value("id").label("name")
      ),
      new Field("spaces.site_user_id").options(
        new Options().table("users").value("id").label("name")
      ),
      new Field("users.name")
    )
    .leftJoin("users", "spaces.site_user_id", "=", "users.id")
    .where((q) => {
      q.where("spaces.type", "=", "FIELD");
      q.where("spaces.site_user_id", "=", req.params.id);
    });
  await editor.process(req.body);
  res.json(editor.data());
});

// 건설사정보 얻어오기
router.get("/api/construction_field_users_info", async function (req, res) {
  req.body;

  let editor = new Editor(db, "users")
    .fields(new Field("id").set(false), new Field("name"))
    .where((q) => {
      //company_type , 건설사 or 레미콘
      q.where("company_type", "=", "CONSTRUCTION");
    });
  await editor.process(req.body);
  res.json(editor.data());
});

module.exports = router;
