let db = require("../db");
let router = require("express").Router();
let fs = require("fs");
let moment = require("moment");
let {
  Editor,
  Field,
  Validate,
  Format,
  Upload,
  promisify,
} = require("datatables.net-editor-server");

let unlink = promisify(fs.unlink); // await version of unlink

// 배너요청
router.all("/api/banners", async function (req, res) {
  var time = new Date();

  let editor = new Editor(db, "banners").fields(
    new Field("banners.id"),
    new Field("image").setFormatter(Format.ifEmpty(null)).upload(
      new Upload(__dirname + "/../public/uploads/{id}.{extn}")
        .db("banners_files", "id", {
          filename: Upload.Db.FileName,
          filesize: Upload.Db.FileSize,
          web_path: "/uploads/{id}.{extn}",
          system_path: Upload.Db.SystemPath,
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
    new Field("banners.type"),
    new Field("created_at")
      .getFormatter(Format.sqlDateToFormat("YYYY-MM-DD"))
      .setFormatter(Format.formatToSqlDate("YYYY-MM-DD")),
    new Field("updated_at")
      .getFormatter(Format.sqlDateToFormat("YYYY-MM-DD"))
      .setFormatter(Format.formatToSqlDate("YYYY-MM-DD")),

    new Field("banners.active")
  );
  // .where((q) => {
  //   q.where("end_date", ">=", time);
  // });
  await editor.process(req.body, req.files);
  res.json(editor.data());
});

//팝업관리
router.all("/api/pop_up", async function (req, res) {
  var time = new Date();

  let editor = new Editor(db, "popup").fields(
    new Field("popup.id"),
    new Field("popup.contents"),
    new Field("popup.image").setFormatter(Format.ifEmpty(null)).upload(
      new Upload(__dirname + "/../public/uploads/popup/{id}.{extn}")
        .db("popup_files", "id", {
          filename: Upload.Db.FileName,
          filesize: Upload.Db.FileSize,
          web_path: "/uploads/popup/{id}.{extn}",
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

    new Field("popup.created_at")
      .getFormatter(Format.sqlDateToFormat("YYYY-MM-DD"))
      .setFormatter(Format.formatToSqlDate("YYYY-MM-DD")),
    new Field("popup.updated_at")
      .getFormatter(Format.sqlDateToFormat("YYYY-MM-DD"))
      .setFormatter(Format.formatToSqlDate("YYYY-MM-DD")),
    new Field("popup.start_date"),
    new Field("popup.end_date")
  );
  // .where((q) => {
  //   q.where(
  //     "popup.end_date",
  //     ">=",
  //     moment(time).format("YYYY-MM-DD hh:mm:ss")
  //   );
  // }
  // );

  await editor.process(req.body, req.files);
  res.json(editor.data());
});

module.exports = router;
