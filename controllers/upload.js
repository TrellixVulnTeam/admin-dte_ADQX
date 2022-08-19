let db = require('../db');
let router = require('express').Router();
let fs = require('fs');
let {
	Editor,
	Field,
	Validate,
	Format,
	Options,
	Upload,
	promisify
} = require("datatables.net-editor-server");

let unlink = promisify(fs.unlink); // await version of unlink

router.all('/api/upload', async function(req, res) {
	let editor = new Editor(db, 'users').fields(
		new Field('first_name'),
		new Field('last_name'),
		new Field('phone'),
		new Field('city'),
		new Field('image').setFormatter(Format.ifEmpty(null)).upload(
			new Upload(__dirname + '/../public/uploads/{id}.{extn}')
				.db('files', 'id', {
					filename: Upload.Db.FileName,
					filesize: Upload.Db.FileSize,
					web_path: '/uploads/{id}.{extn}',
					system_path: Upload.Db.SystemPath
				})
				.validator(Validate.fileSize(500000, 'Files must be smaller than 500K'))
				.validator(
					Validate.fileExtensions(
						['png', 'jpg', 'gif'],
						'Only image files can be uploaded (png, jpg and gif)'
					)
				)
				.dbClean(async function(data) {
					for (let i = 0, ien = data.length; i < ien; i++) {
						await unlink(data[i].system_path);
					}
					return true;
				})
		)
	);

	await editor.process(req.body, req.files);
	res.json(editor.data());
});

module.exports = router;
