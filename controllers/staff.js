let db = require('../db');
let router = require('express').Router();
let {
	Editor,
	Field,
	Validate,
	Format,
	Options
} = require("datatables.net-editor-server");

router.all('/api/staff', async function(req, res) {
	let editor = new Editor(db, 'datatables_demo').fields(
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

	await editor.process(req.body);
	res.json(editor.data());
});

module.exports = router;
