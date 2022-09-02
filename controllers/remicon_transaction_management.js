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

router.all("/api/estimate_info", async function (req, res) {
  let editor = new Editor(db, "spaces")
    .fields(
      new Field("spaces.id").set(false),
      new Field("spaces.name"),
      new Field("admin_user.name"),
      new Field("admin_user.position"),
      new Field("site_user.name"),
      new Field("site_user.position")
    )

    .leftJoin("space_members", "space_members.space_id", "=", "spaces.id")
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

module.exports = router;
