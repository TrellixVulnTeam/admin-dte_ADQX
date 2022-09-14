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
router.all("/api/price_list", async function (req, res) {
  let editor = new Editor(db, "prices").fields(
    new Field("id").set(false),
    new Field("division"),
    new Field("slump_8_nominal_160"),
    new Field("slump_8_nominal_180"),
    new Field("slump_8_nominal_210"),
    new Field("slump_8_nominal_240"),
    new Field("slump_8_nominal_270"),
    new Field("slump_8_nominal_300"),
    new Field("slump_8_nominal_350"),
    new Field("slump_8_nominal_400"),
    new Field("slump_8_nominal_450"),
    new Field("slump_8_nominal_500"),
    new Field("slump_12_nominal_160"),
    new Field("slump_12_nominal_180"),
    new Field("slump_12_nominal_210"),
    new Field("slump_12_nominal_240"),
    new Field("slump_12_nominal_270"),
    new Field("slump_12_nominal_300"),
    new Field("slump_12_nominal_350"),
    new Field("slump_12_nominal_400"),
    new Field("slump_12_nominal_450"),
    new Field("slump_12_nominal_500"),
    new Field("slump_15_nominal_160"),
    new Field("slump_15_nominal_180"),
    new Field("slump_15_nominal_210"),
    new Field("slump_15_nominal_240"),
    new Field("slump_15_nominal_270"),
    new Field("slump_15_nominal_300"),
    new Field("slump_15_nominal_350"),
    new Field("slump_15_nominal_400"),
    new Field("slump_15_nominal_450"),
    new Field("slump_15_nominal_500"),
    new Field("slump_18_nominal_160"),
    new Field("slump_18_nominal_180"),
    new Field("slump_18_nominal_210"),
    new Field("slump_18_nominal_240"),
    new Field("slump_18_nominal_270"),
    new Field("slump_18_nominal_300"),
    new Field("slump_18_nominal_350"),
    new Field("slump_18_nominal_400"),
    new Field("slump_18_nominal_450"),
    new Field("slump_18_nominal_500"),
    new Field("slump_21_nominal_160"),
    new Field("slump_21_nominal_180"),
    new Field("slump_21_nominal_210"),
    new Field("slump_21_nominal_240"),
    new Field("slump_21_nominal_270"),
    new Field("slump_21_nominal_300"),
    new Field("slump_21_nominal_350"),
    new Field("slump_21_nominal_400"),
    new Field("slump_21_nominal_450"),
    new Field("slump_21_nominal_500"),
    new Field("mortar_350"),
    new Field("mortar_450"),
    new Field("mortar_550"),
    new Field("mortar_700"),
    new Field("mortar_100"),
    new Field("created_at")
      .getFormatter(Format.sqlDateToFormat("YYYY-MM-DD"))
      .setFormatter(Format.formatToSqlDate("YYYY-MM-DD")),
    new Field("updated_at")
      .getFormatter(Format.sqlDateToFormat("YYYY-MM-DD"))
      .setFormatter(Format.formatToSqlDate("YYYY-MM-DD"))
  );

  await editor.process(req.body);
  res.json(editor.data());
});

module.exports = router;
