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

router.all("/api/material_lists", async function (req, res) {
  // router.all("/api/material_lists/:id", async function (req, res) {
  console.log("req");
  console.log(req.params.id);

  let editor = new Editor(db, "archives").fields(
    new Field("id"),
    new Field("type"),
    new Field("region"),
    new Field("company_name"),
    new Field("address"),
    new Field("tel"),
    new Field("created_at")
  );
  // .where((q) => {
  //   // q.where("type", "=", req.params.id);
  //   if (req.params.id == "undefined") {
  //     console.log("if");
  //     q.where("type", "=", "file");
  //   } else {
  //     console.log("esle");
  //     q.where("type", "=", req.params.id);
  //   }
  // });
  await editor.process(req.body);
  res.json(editor.data());
});

module.exports = router;
