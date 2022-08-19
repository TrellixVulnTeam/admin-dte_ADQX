let db = require('../db');
let router = require('express').Router();
let {
	Editor,
	Field,
	Validate,
	Format,
	Options
} = require("datatables.net-editor-server");

router.all('/api/tableOnlyData', async function(req, res) {
	let editor = new Editor(db, 'users')
		.fields(
			new Field('first_name'),
			new Field('last_name'),
			new Field('updated_date')
                .set(false)
                .getFormatter(Format.sqlDateToFormat('ddd, Do MMMM YYYY'))
		);

	await editor.process(req.body);
	res.json(editor.data());
});

module.exports = router;
