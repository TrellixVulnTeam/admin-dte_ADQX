let db = require('../db');
let router = require('express').Router();
let {
	Editor,
	Field,
	Validate,
	Format,
	Options
} = require("datatables.net-editor-server");

function editorLib() {
	return new Editor(db, 'datatables_demo').fields(
		new Field('first_name').validator(Validate.notEmpty()),
		new Field('last_name').validator(Validate.notEmpty()),
		new Field('position'),
		new Field('office'),
		new Field('extn'),
		new Field('age')
			.validator(Validate.numeric())
			.setFormatter(Format.ifEmpty(null)),
		new Field('salary')
			.validator(Validate.numeric())
			.setFormatter(Format.ifEmpty(null)),
		new Field('start_date')
			.validator(Validate.required())
			.validator(
				Validate.dateFormat(
					'YYYY-MM-DD',
					null,
					new Validate.Options({
						message: 'Please enter a date in the format yyyy-mm-dd'
					})
				)
			)
			.getFormatter(Format.sqlDateToFormat('YYYY-MM-DD'))
			.setFormatter(Format.formatToSqlDate('YYYY-MM-DD'))
	);
}

router.get('/api/rest/get', async function(req, res) {
	let editor = editorLib();
	await editor.process(req.body);
	res.json(editor.data());
});

router.post('/api/rest/create', async function(req, res) {
	let editor = editorLib();
	await editor.process(req.body);
	res.json(editor.data());
});

router.put('/api/rest/edit', async function(req, res) {
	let editor = editorLib();
	await editor.process(req.body);
	res.json(editor.data());
});

router.delete('/api/rest/remove', async function(req, res) {
	let editor = editorLib();
	await editor.process(req.body);
	res.json(editor.data());
});

module.exports = router;
