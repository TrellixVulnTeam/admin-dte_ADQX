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

// 레미콘사 요청
router.all("/api/remicon", async function (req, res) {
  let editor = new Editor(db, "companies")
    .fields(
      new Field("companies.id"),
      new Field("companies.name"),
      new Field("companies.company_type").setValue("remicon"),
      new Field("companies.address"),
      new Field("companies.ceo_name"),
      new Field("companies.created_at")
        .getFormatter(Format.sqlDateToFormat("YYYY-MM-DD"))
        .setFormatter(Format.formatToSqlDate("YYYY-MM-DD")),
      new Field("companies.updated_at")
        .getFormatter(Format.sqlDateToFormat("YYYY-MM-DD"))
        .setFormatter(Format.formatToSqlDate("YYYY-MM-DD")),
      new Field("factory_infos.tel"),
      new Field("factory_infos.fax"),
      new Field("factory_infos.capa"),
      new Field("factory_infos.truck_count"),
      new Field("factory_infos.cement_silo"),
      new Field("factory_infos.start_at")
        .getFormatter(Format.sqlDateToFormat("YYYY-MM-DD"))
        .setFormatter(Format.formatToSqlDate("YYYY-MM-DD")),
      new Field("factory_infos.ks_acquired_at")
        .getFormatter(Format.sqlDateToFormat("YYYY-MM-DD"))
        .setFormatter(Format.formatToSqlDate("YYYY-MM-DD"))
    )
    .leftJoin("spaces", "companies.id", "=", "spaces.company_id")
    .leftJoin(
      "factory_infos",
      "spaces.factory_info_id",
      "=",
      "factory_infos.id"
    )
    .where((q) => {
      //company_type , 건설사 or 레미콘
      q.where("companies.company_type", "=", "REMICON");
    });
  await editor.process(req.body);
  res.json(editor.data());
});

module.exports = router;
