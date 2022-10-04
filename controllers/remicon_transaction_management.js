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

// 레미콘사 내역
router.all("/api/remicon_management_list", async function (req, res) {
  let editor = new Editor(db, "companies")
    .fields(
      new Field("companies.id"),
      new Field("spaces.id"),
      new Field("companies.name"),
      // new Field("spaces.company_id"),
      new Field(
        "(select count(*) from users where company_id=companies.id group by company_id)",
        "cnt"
      ),
      new Field("companies.address")
    )
    .leftJoin("spaces", "spaces.company_id", "=", "companies.id")
    .where((q) => {
      //company_type , 건설사 or 레미콘
      q.where("companies.company_type", "=", "remicon");
    });

  await editor.process(req.body);
  res.json(editor.data());
});

// 레미콘 공장 구성원 리스트
router.all("/api/remicon_memberlist/:id", async function (req, res) {
  let editor = new Editor(db, "users")
    .fields(
      new Field("users.name"),
      new Field("users.phone"),
      new Field("companies.name")
    )
    .leftJoin("companies", "users.company_id", "=", "companies.id")
    .where((q) => {
      //company_type , 건설사 or 레미콘
      q.where("companies.id", "=", req.params.id);
    });

  await editor.process(req.body);
  res.json(editor.data());
});

//2. 레미콘사 견적내역

router.all(
  "/api/remicon_esimate_management/:id",
  // "/api/remicon_esimate_management/:id/:min",
  // "/api/remicon_esimate_management/:id/:min/:max",
  async function (req, res) {
    // var r_id;
    // var r_date;

    // if (req.params.id.length < 10) {
    //   r_id = req.params.id;
    // } else r_date = req.params.id;

    // console.log("asdfsf", req.params.id, req.params.id.length);
    console.log("asdfsf", req.params);
    let editor = new Editor(db, "estimations")

      .fields(
        new Field("estimations.id"),
        new Field("companies.name"),
        new Field("spaces.id"),
        new Field("spaces.name"),
        new Field("companies.id"),
        new Field("spaces.basic_address"),
        new Field("users.name"),
        new Field("estimations.percent"),
        new Field("estimations.created_at")
          .getFormatter(Format.sqlDateToFormat("YYYY-MM-DD"))
          .setFormatter(Format.formatToSqlDate("YYYY-MM-DD")),
        new Field("estimations.status")
      )
      .leftJoin("spaces", "estimations.field_space_id", "=", "spaces.id")
      .leftJoin("users", "estimations.manager_user_id", "=", "users.id")
      .leftJoin("companies", "spaces.company_id", "=", "companies.id")
      .where((q) => {
        // if (req.params.id.length < 10) {
        //   q.where("estimations.factory_space_id", "=", req.params.id);
        // } else {
        //   // q.where("estimations.created_at", "<=", req.params.id);
        //   q.where("estimations.created_at", "<=", "2022-08-07");
        // }
        q.where("estimations.factory_space_id", "=", req.params.id);
        // q.where("estimations.created_at", ">=", req.params.min);
      });
    await editor.process(req.body);
    res.json(editor.data());
  }
);

//3. 레미콘사 주문내역

router.all("/api/remicon_order_management/:id", async function (req, res) {
  let editor = new Editor(db, "assignments")
    .fields(
      new Field("assignments.id"),
      new Field("companies.id"),
      new Field("companies.name"),
      new Field("spaces.id"),
      new Field("spaces.name"),
      new Field("users.company_id"),
      new Field("assignments.date"),
      new Field("assignments.total"),
      new Field("assignments.remark"),
      new Field("assignments.multal"),
      new Field("assignments.mulcha"),
      new Field("assignments.inducer"),
      new Field("assignment_specs.value"),
      new Field("assignment_specs.norminal_strength"),
      new Field("assignment_specs.slump"),
      new Field("assignment_specs.quantity"),
      // .options(
      //   new Options().table("assignments").value("multal").label("multal")
      // ),
      new Field("assignments.start_time")
        .getFormatter(Format.sqlDateToFormat("YYYY-MM-DD"))
        .setFormatter(Format.formatToSqlDate("YYYY-MM-DD")),
      new Field("assignments.end_time")
        .getFormatter(Format.sqlDateToFormat("YYYY-MM-DD"))
        .setFormatter(Format.formatToSqlDate("YYYY-MM-DD"))
    )
    .leftJoin("estimations", "assignments.estimation_id", "=", "estimations.id")
    .leftJoin("spaces", "estimations.field_space_id", "=", "spaces.id")
    .leftJoin("users", "estimations.sales_user_id", "=", "users.id")
    .leftJoin("companies", "spaces.company_id", "=", "companies.id")
    .leftJoin(
      "assignment_specs",
      "assignments.id",
      "=",
      "assignment_specs.assignment_id"
    )
    .where((q) => {
      q.where("estimations.factory_space_id", "=", req.params.id); // 아이디값 받아야함
    });
  await editor.process(req.body);
  res.json(editor.data());
});

// 4. 레미콘사 거래내역
router.all("/api/remicon_Transaction_history/:id", async function (req, res) {
  let editor = new Editor(db, "assignments")
    .fields(
      new Field("assignments.id").set(false),
      new Field("companies.id"),
      new Field("companies.name"),
      new Field("spaces.id"),
      new Field("spaces.name"),
      new Field("spaces.basic_address"),
      new Field(
        "concat(assignment_specs.value,'-',assignment_specs.norminal_strength,'-',assignment_specs.slump)",
        "standard"
      ),
      new Field("assignments.date")
        .getFormatter(Format.sqlDateToFormat("YYYY-MM-DD-HH:MM"))
        .setFormatter(Format.formatToSqlDate("YYYY-MM-DD-HH:MM")),
      new Field("assignments.status")
    )
    .leftJoin("estimations", "assignments.estimation_id", "=", "estimations.id")
    .leftJoin("spaces", "estimations.field_space_id", "=", "spaces.id")
    .leftJoin("companies", "spaces.company_id", "=", "companies.id")
    .leftJoin(
      "assignment_specs",
      "assignments.id",
      "=",
      "assignment_specs.assignment_id"
    )
    .where((q) => {
      q.where("estimations.factory_space_id", "=", req.params.id); // 아이디값 받아야함
    });
  await editor.process(req.body);
  res.json(editor.data());
});

module.exports = router;
