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
  promisify,
} = require("datatables.net-editor-server");

let unlink = promisify(fs.unlink); // await version of unlink

router.all("/api/material_lists", async function (req, res) {
  // router.all("/api/material_lists/:id", async function (req, res) {
  console.log("req");
  console.log(req.params.id);

  let editor = new Editor(db, "archives")
    .fields(
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
          .validator(
            Validate.fileSize(500000, "Files must be smaller than 500K")
          )
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
      ),
      new Field("archives_files.web_path")
    )
    .leftJoin("archives_files", "archives_files.id", "=", "archives.image");
  await editor.process(req.body);
  res.json(editor.data());
});

//건자제리스트 등록
router.all("/api/material_item", async function (req, res) {
  var time = new Date();

  let editor = new Editor(db, "material_item")
    .fields(
      new Field("material_item.id"),
      new Field("material_item.image")
        .setFormatter(Format.ifEmpty(null))
        .upload(
          new Upload(__dirname + "/../public/uploads/{id}.{extn}")
            .db("material_item_files", "id", {
              filename: Upload.Db.FileName,
              filesize: Upload.Db.FileSize,
              web_path: "/uploads/{id}.{extn}",
              system_path: Upload.Db.SystemPath,
            })
            .validator(
              Validate.fileSize(500000, "Files must be smaller than 500K")
            )
            .validator(
              Validate.fileExtensions(
                ["png", "jpg", "gif"],
                "Only image files can be uploaded (png, jpg and gif)"
              )
            )
            .dbClean(async function (data) {
              for (let i = 0, ien = data.length; i < ien; i++) {
                await unlink(data[i].system_path);
              }
              return true;
            })
        ),
      new Field("material_item.created_at")
        .getFormatter(Format.sqlDateToFormat("YYYY-MM-DD"))
        .setFormatter(Format.formatToSqlDate("YYYY-MM-DD")),
      new Field("material_item.updated_at")
        .getFormatter(Format.sqlDateToFormat("YYYY-MM-DD"))
        .setFormatter(Format.formatToSqlDate("YYYY-MM-DD")),
      new Field("material_item.title"),
      new Field("material_item.contents"),
      new Field("material_item.type"),
      // new Field("material_item_files.id"),
      new Field("material_item_files.web_path")
    )
    .leftJoin(
      "material_item_files",
      "material_item_files.id",
      "=",
      "material_item.image"
    );

  await editor.process(req.body, req.files);
  res.json(editor.data());
});

module.exports = router;
