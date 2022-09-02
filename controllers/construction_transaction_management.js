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

// 건설사 내역관리
// esimate_management
router.all("/api/deal_construction_list", async function (req, res) {
  let editor = new Editor(db, "spaces")
    .fields(
      new Field("spaces.id"),
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
      new Field("admin_user.name"),
      new Field("site_user.name")
    )
    .leftJoin("companies", "spaces.company_id", "=", "companies.id")
    .leftJoin("field_infos", "spaces.field_info_id", "=", "field_infos.id")
    .leftJoin(
      "users as admin_user",
      "spaces.admin_user_id",
      "=",
      "admin_user.id"
    )
    .leftJoin("users as site_user", "spaces.site_user_id", "=", "site_user.id")
    .where((q) => {
      q.where("spaces.type", "=", "field");
    });
  await editor.process(req.body);
  res.json(editor.data());
});

// 건설사 견적관리
router.all("/api/esimate_management2/:id", async function (req, res) {
  console.log("견적관리 : 요청확인");
  //tableName이 건설현장 이름
  var check = req.params;
  // console.log(params);
  console.log(req.params.id);
  console.log("req", check);
  let editor = new Editor(db, "estimations")
    .fields(
      new Field("estimations.id").set(false),
      new Field("spaces.name"),
      new Field("spaces.basic_address"),
      new Field("users.name"),
      new Field("estimations.percent"),
      new Field("estimations.created_at"),
      new Field("estimations.status")
    )
    .leftJoin("spaces", "estimations.factory_space_id", "=", "spaces.id")
    .leftJoin("users", "estimations.sales_user_id", "=", "users.id")
    .where((q) => {
      q.where("estimations.field_space_id", "=", req.params.id);
    });
  await editor.process(req.body);
  res.json(editor.data());
});

// 건설사 주문내역
router.all("/api/order_history", async function (req, res) {
  console.log("주문내역 : 요청확인");
  console.log(req.params.id);
  let editor = new Editor(db, "assignments")
    .fields(
      new Field("assignments.id"),
      new Field("spaces.name"),
      new Field("assignments.start_time"),
      // .getFormatter(Format.sqlDateToFormat("YYYY-MM-DD-HH:MM"))
      // .setFormatter(Format.formatToSqlDate("YYYY-MM-DD-HH:MM")),
      new Field("assignments.end_time"),
      //   .getFormatter(Format.sqlDateToFormat("YYYY-MM"))
      //   .setFormatter(Format.formatToSqlDate("YYYY-MM")),
      new Field("concat(users.name, ' ' ,users.position)"),
      new Field("assignments.type"),
      new Field("assignments.status"),
      new Field(
        "(case when (space_members.space_id = spaces.id)" +
          "then (select count(space_id) from space_members where space_id = spaces.id group by space_id)" +
          "else 0 end)"
      )
      // new Field(
      //   "select count(space_id) from space_members where space_members.space_id = spaces.id group by space_members.space_id"
      // )
    )
    .leftJoin("estimations", "assignments.estimation_id", "=", "estimations.id")
    .leftJoin("spaces", "estimations.factory_space_id", "=", "spaces.id")
    .leftJoin("users", "estimations.sales_user_id", "=", "users.id")
    .leftJoin("space_members", "spaces.id", "=", "space_members.space_id")
    .where((q) => {
      q.where("estimations.field_space_id", "=", 2417); // 아이디값 받아야함
    });
  await editor.process(req.body);
  res.json(editor.data());
});

module.exports = router;
