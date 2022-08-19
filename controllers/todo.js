let db = require('../db');
let router = require('express').Router();
let {
	Editor,
	Field,
	Validate,
	Format,
	Options
} = require("datatables.net-editor-server");

router.all('/api/todo', async function(req, res) {
	let editor = new Editor(db, 'todo')
		.fields(
			new Field('item'),
			new Field('done'),
			new Field('priority')
		);

	await editor.process(req.body);
	res.json(editor.data());
});

module.exports = router;
