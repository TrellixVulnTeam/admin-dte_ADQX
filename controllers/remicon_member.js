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
router.all("/api/remicon_member", async function (req, res) {
  // console.log("회원요청", req.query);
  // let signid = [];
  // signid.push(req.body);
  console.log("회원요청", req.body);
  console.log("회원요청", req.params);

  let editor = new Editor(db, "users")
    .fields(
      new Field("users.signname"),
      new Field("users.id"),
      new Field("users.name"),
      new Field("users.phone"),
      new Field("users.company_type").setValue("REMICON"),
      new Field("users.position"),
      new Field("users.tel"),
      new Field("companies.name"),
      new Field("users.created_at")
        .getFormatter(Format.sqlDateToFormat("YYYY-MM-DD"))
        .setFormatter(Format.formatToSqlDate("YYYY-MM-DD")),
      new Field("users.updated_at")
        .getFormatter(Format.sqlDateToFormat("YYYY-MM-DD"))
        .setFormatter(Format.formatToSqlDate("YYYY-MM-DD")),
      new Field("concat(users.name, ' ' ,users.position)"),
      new Field(
        "concat(companies.name,' 외 ',(select count(a.signname)-1 from users a where a.signname=users.signname group by a.signname),' 건 ')"
      )
      // new Field("'(count(*) OVER(PARTITION BY signname))'"),
      // new Field("(row_number()over(PARTITION BY signname))"),
      // new Field("companies.name"),
      // new Field("users.company_id").options(
      //   new Options()
      //     .table("companies")
      //     .value("id")
      //     .label("name")
      //     .where((q) => {
      //       q.where("company_type", "=", "REMICON");
      //     })
      // )
    )
    .leftJoin("companies", "users.company_id", "=", "companies.id")
    // .leftJoin("companies", "users.company_id", "=", "companies.id")

    .where((q) => {
      //company_type , 건설사 or 레미콘
      q.where("users.company_type", "=", "REMICON");
    });
  // .where((q) => {
  //   //company_type , 건설사 or 레미콘 "(select id from users where id=104)"
  //   q.where("users.id", "=", ("86", "88", "97"));
  // });

  // console.log("회원요청", req.body);
  // console.log("회원요청", req.query);
  await editor.process(req.body);
  res.json(editor.data());
});

// 회사정보 얻어오기
router.get("/api/remicon_info", async function (req, res) {
  let editor = new Editor(db, "companies")
    .fields(
      new Field("id").set(false),
      new Field("company_type"),
      new Field("name")
    )
    .where((q) => {
      q.where("company_type", "=", "REMICON");
    });
  await editor.process(req.body);
  res.json(editor.data());
});

// 레미콘사 회원이 속한 공장리스트 조회
router.all("/api/remicon_factorylist_table/:id", async function (req, res) {
  console.log("asdgsg", req.params.id);
  let editor = new Editor(db, "users")
    .fields(
      new Field("users.id "),
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
      new Field("companies.address")
      // new Field("users.company_id").options(
      //   new Options()
      //     .table("companies")
      //     .value("id")
      //     .label("name")
      //     .where((q) => {
      //       q.where("company_type", "=", "REMICON");
      //     })
      // )
    )
    .leftJoin("companies", "users.company_id", "=", "companies.id")
    .where((q) => {
      //company_type , 건설사 or 레미콘
      // q.where("users.signname", "=", req.params.id);
      q.where("users.signname", "=", req.params.id);
    });
  await editor.process(req.body);
  res.json(editor.data());
});
module.exports = router;
