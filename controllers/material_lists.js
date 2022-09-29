let db = require("../db");
let router = require("express").Router();
let fs = require("fs");
let {
  Editor,
  Field,
  Validate,
  Format,
  Options,
  Mjoin,
  Upload,
  SearchPaneOptions,
} = require("datatables.net-editor-server");

router.all("/api/material_lists", async function (req, res) {
  // router.all("/api/material_lists/:id", async function (req, res) {
  console.log("req");
  console.log(req.params.id);

  let editor = new Editor(db, "archives").fields(
    new Field("archives.id"),
    new Field("archives.type"),
    new Field("archives.region"),
    new Field("archives.company_name"),
    new Field("archives.address"),
    new Field("archives.tel"),
    new Field("archives.created_at"),
    new Field("archives.image").setFormatter(Format.ifEmpty(null)).upload(
      new Upload(__dirname + "/../public/uploads/archives_files/{id}.{extn}")
        .db("archives_files", "id", {
          filename: Upload.Db.FileName,
          filesize: Upload.Db.FileSize,
          web_path: "/uploads/archives_files/{id}.{extn}",
          system_path: Upload.Db.SystemPath,
        })
        .validator(Validate.fileSize(500000, "Files must be smaller than 500K"))
        .validator(
          Validate.fileExtensions(
            ["xlsx"],
            "Only image files can be uploaded (xlsx)"
          )
        )
        .dbClean(async function (data) {
          for (let i = 0, ien = data.length; i < ien; i++) {
            await unlink(data[i].system_path);
          }
          return true;
        })
    )
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
  await editor.process(req.body, req.files);
  res.json(editor.data());
});

module.exports = router;
