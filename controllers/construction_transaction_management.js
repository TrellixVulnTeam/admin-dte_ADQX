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

//1.건설사 내역리스트
router.all("/api/history_management_list", async function (req, res) {
  let editor = new Editor(db, "spaces")
    .fields(
      new Field("spaces.id"),
      new Field("spaces.name"),
      new Field("companies.id"),
      new Field("companies.name"),
      // new Field("spaces.basic_address"),
      // new Field("field_infos.start_at")
      //   .getFormatter(Format.sqlDateToFormat("YYYY-MM"))
      //   .setFormatter(Format.formatToSqlDate("YYYY-MM")),
      // new Field("field_infos.end_at")
      //   .getFormatter(Format.sqlDateToFormat("YYYY-MM"))
      //   .setFormatter(Format.formatToSqlDate("YYYY-MM")),
      // new Field("field_infos.payment_method"),
      new Field("admin_user.name"),
      new Field("site_user.name"),
      new Field(
        "(select count(space_id)" +
          "from space_members where space_id = spaces.id " +
          "group by space_id)",
        "cnt"
      )
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

// 건설사 현장 구성원 리스트
router.all("/api/construnction_memberlist/:id", async function (req, res) {
  console.log("req확인", req.params.id);
  let editor = new Editor(db, "space_members")
    .fields(
      new Field("users.name"),
      new Field("users.phone"),
      new Field("companies.name")
    )
    .leftJoin("users", "space_members.user_id", "=", "users.id")
    .leftJoin("companies", "users.company_id", "=", "companies.id")
    .where((q) => {
      //company_type , 건설사 or 레미콘
      q.where("space_members.space_id", "=", req.params.id);
    });

  await editor.process(req.body);
  res.json(editor.data());
});

//2. 건설사 견적내역

router.all(
  "/api/construction_esimate_management/:id/:min/:max",
  async function (req, res) {
    var current_year = new Date().getFullYear();
    let min;
    let max;
    console.log("asdf", req.params);

    if (req.params.min == "undefined" && req.params.max == "undefined") {
      console.log("확인");
      min = current_year + "-01-01";
      max = current_year + "-12-31";
    } else {
      min = req.params.min;
      max = req.params.max;
    }
    console.log("min max", min, max);
    let editor = new Editor(db, "estimations")
      .fields(
        new Field("estimations.id"),
        new Field("b.id"),
        new Field("b.name"),
        new Field("users.name"),
        new Field("companies.id"),
        new Field("companies.name"),
        new Field("estimations.percent"),
        new Field("estimations.created_at")
          .getFormatter(Format.sqlDateToFormat("YYYY-MM-DD"))
          .setFormatter(Format.formatToSqlDate("YYYY-MM-DD")),
        new Field("estimations.status")
      )
      .leftJoin("spaces as a", "estimations.factory_space_id", "=", "a.id")
      .leftJoin("spaces as b", "estimations.field_space_id", "=", "b.id")
      .leftJoin("companies", "a.company_id", "=", "companies.id")
      .leftJoin("users", "estimations.sales_user_id", "=", "users.id")
      .where((q) => {
        q.where("estimations.field_space_id", "=", req.params.id);
        q.where("estimations.created_at", ">=", min);
        q.where("estimations.created_at", "<=", max);
      });
    // .leftJoin("spaces as a", "estimations.factory_space_id", "=", "spaces.id")
    // .leftJoin("spaces as b", "estimations.factory_space_id", "=", "spaces.id")
    // .leftJoin("companies", "spaces.company_id", "=", "companies.id")
    // .leftJoin("users", "estimations.sales_user_id", "=", "users.id")
    // .where((q) => {
    //   q.where("estimations.field_space_id", "=", req.params.id);
    // });
    await editor.process(req.body);
    res.json(editor.data());
  }
);

//3. 건설사 주문내역
router.all(
  "/api/construction_order_history/:id/:min/:max",
  async function (req, res) {
    var current_year = new Date().getFullYear();
    let min;
    let max;
    console.log("asdf", req.params);

    if (req.params.min == "undefined" && req.params.max == "undefined") {
      console.log("확인");
      min = current_year + "-01-01";
      max = current_year + "-12-31";
    } else {
      min = req.params.min;
      max = req.params.max;
    }
    console.log("min max", min, max);

    let editor = new Editor(db, "assignments")
      .fields(
        new Field("assignments.id"),
        new Field("companies.id"),
        new Field("companies.name"),
        new Field("spaces.name"),
        new Field("assignments.start_time"),
        new Field("assignments.end_time"),
        new Field("assignments.date"),
        new Field("assignments.total"),
        // new Field("concat(users.name, ' ' ,users.position)"),
        // new Field("users.position"),
        // new Field("users.name"),
        new Field("assignments.remark"),
        new Field("assignments.multal"),
        new Field("assignments.mulcha"),
        new Field("assignments.inducer"),
        new Field("assignment_specs.value"),
        new Field("assignment_specs.norminal_strength"),
        new Field("assignment_specs.slump"),
        new Field("assignment_specs.quantity"),
        new Field("assignments.type").options(
          new Options().table("assignments").value("type").label("type")
        )

        // new Field("estimations.slump_1"),
        // new Field("estimations.norminal_strength_1"),
        // new Field("estimations.slump_2"),
        // new Field("estimations.norminal_strength_2"),
        // new Field("estimations.slump_3"),
        // new Field("estimations.norminal_strength_3"),
        // new Field("assignments.status"),
        // new Field(
        //   "(select count(space_id)" +
        //     "from space_members where space_id = spaces.id " +
        //     "group by space_id)"
        // )
      )
      .leftJoin(
        "estimations",
        "assignments.estimation_id",
        "=",
        "estimations.id"
      )
      .leftJoin("spaces", "estimations.factory_space_id", "=", "spaces.id")
      .leftJoin("users", "estimations.sales_user_id", "=", "users.id")
      .leftJoin("companies", "spaces.company_id", "=", "companies.id")
      .leftJoin(
        "assignment_specs",
        "assignments.id",
        "=",
        "assignment_specs.assignment_id"
      )
      // .leftJoin("space_members", "spaces.id", "=", "space_members.space_id")
      .where((q) => {
        q.where("estimations.field_space_id", "=", req.params.id); // 아이디값 받아야함
        q.where("assignments.date", ">=", min);
        q.where("assignments.date", "<=", max);
      });
    await editor.process(req.body);
    res.json(editor.data());
  }
);

// 4.건설사 거래내역
router.all(
  "/api/construction_Transaction_history/:id/:min/:max",
  async function (req, res) {
    var current_year = new Date().getFullYear();
    let min;
    let max;
    console.log("asdf", req.params);

    if (req.params.min == "undefined" && req.params.max == "undefined") {
      console.log("확인");
      min = current_year + "-01-01";
      max = current_year + "-12-31";
    } else {
      min = req.params.min;
      max = req.params.max;
    }
    console.log("min max", min, max);
    let editor = new Editor(db, "assignments")
      .fields(
        new Field("assignments.id"),
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
        // new Field("assignments.id"),
        // new Field("spaces.name"),
        // new Field("assignments.date"),
        // new Field("assignments.status")
      )
      .leftJoin(
        "estimations",
        "assignments.estimation_id",
        "=",
        "estimations.id"
      )
      .leftJoin("spaces", "estimations.factory_space_id", "=", "spaces.id")
      .leftJoin("companies", "spaces.company_id", "=", "companies.id")
      .leftJoin(
        "assignment_specs",
        "assignments.id",
        "=",
        "assignment_specs.assignment_id"
      )
      // .leftJoin("users", "estimations.sales_user_id", "=", "users.id")
      // .leftJoin("space_members", "spaces.id", "=", "space_members.space_id")
      .where((q) => {
        q.where("estimations.field_space_id", "=", req.params.id); // 아이디값 받아야함
        q.where("assignments.date", ">=", min);
        q.where("assignments.date", "<=", max);
      });
    await editor.process(req.body);
    res.json(editor.data());
  }
);

module.exports = router;
