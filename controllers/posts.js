let db = require("../db");
let router = require("express").Router();
let fs = require("fs");
let {
  Editor,
  Field,
  Format,
  Options,
  Upload,
  Validate,
  promisify,
} = require("datatables.net-editor-server");

let unlink = promisify(fs.unlink); // await version of unlink

//공지사항
router.all("/api/posts", async function (req, res) {
  console.log("qweqwe", req.files);
  let editor = new Editor(db, "posts").fields(
    new Field("id"),
    new Field("posts.type"),
    new Field("posts.title"),
    new Field("posts.content"),
    new Field("posts.image").setFormatter(Format.ifEmpty(null)).upload(
      new Upload(__dirname + "/../public/uploads/posts_files/{id}.{extn}")
        .db("posts_files", "id", {
          filename: Upload.Db.FileName,
          filesize: Upload.Db.FileSize,
          web_path: "/uploads/posts_files/{id}.{extn}",
        })
        .validator(Validate.fileSize(500000, "Files must be smaller than 500K"))
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
    new Field("posts.created_at")
      .getFormatter(Format.sqlDateToFormat("YYYY-MM-DD"))
      .setFormatter(Format.formatToSqlDate("YYYY-MM-DD")),
    new Field("posts.updated_at")
      .getFormatter(Format.sqlDateToFormat("YYYY-MM-DD"))
      .setFormatter(Format.formatToSqlDate("YYYY-MM-DD"))
  );
  await editor.process(req.body, req.files);
  res.json(editor.data());
});

module.exports = router;
