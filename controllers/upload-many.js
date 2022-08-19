let db = require('../db');
let router = require('express').Router();
let {
	Editor,
	Field,
	Validate,
	Format,
	Options,
	Mjoin,
	Upload
} = require("datatables.net-editor-server");

router.all('/api/upload-many', async function(req, res) {
	let editor = new Editor(db, 'users')
		.fields(
			new Field('users.first_name'),
			new Field('users.last_name'),
			new Field('users.phone'),
			new Field('users.site').options(
				new Options().table('sites').value('id').label('name')
			),
			new Field('sites.name')
		)
		.leftJoin('sites', 'sites.id', '=', 'users.site')
		.join(
			new Mjoin('files')
				.link('users.id', 'users_files.user_id')
				.link('files.id', 'users_files.file_id')
				.fields(
					new Field('id').upload(
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
                    )
				)
		);

    await editor.process(req.body, req.files);
	res.json(editor.data());
});

module.exports = router;
