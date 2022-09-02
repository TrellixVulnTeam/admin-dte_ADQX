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
  let editor = new Editor(db, "spaces")
    .fields(
      new Field("spaces.id"),
      new Field("spaces.name"),
      new Field(
        "(select count(space_id)" +
          "from space_members where space_id = spaces.id " +
          "group by space_id)"
      ),
      new Field("concat(admin_user.name,'',admin_user.position)"),
      new Field("concat(site_user.name,'',site_user.position)")
    )

    .leftJoin(
      "users as admin_user",
      "spaces.admin_user_id",
      "=",
      "admin_user.id"
    )

    .leftJoin("users as site_user", "spaces.site_user_id", "=", "site_user.id")
    .where((q) => {
      //company_type , 건설사 or 레미콘
      q.where("spaces.type", "=", "FACTORY");
    });

  await editor.process(req.body);
  res.json(editor.data());
});

//2. 레미콘사 견적내역

router.all("/api/remicon_esimate_management/:id", async function (req, res) {
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
    .leftJoin("spaces", "estimations.field_space_id", "=", "spaces.id")
    .leftJoin("users", "estimations.sales_user_id", "=", "users.id")
    .where((q) => {
      q.where("estimations.factory_space_id", "=", req.params.id);
    });
  await editor.process(req.body);
  res.json(editor.data());
});

module.exports = router;
