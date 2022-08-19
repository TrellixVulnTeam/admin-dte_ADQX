let db = require('../db');
let router = require('express').Router();
let {
	Editor,
	Field,
	Validate,
	Format,
	Options
} = require("datatables.net-editor-server");

router.all('/api/joinSelf', async function(req, res) {
	let editor = new Editor(db, 'users')
		.fields(
			new Field('users.first_name'),
			new Field('users.last_name'),
			new Field('users.manager').options(
				new Options()
					.table('users')
					.value('id')
					.label(['first_name', 'last_name'])
			),
			new Field('manager.first_name'),
			new Field('manager.last_name')
		)
		.leftJoin('users as manager', 'users.manager', '=', 'manager.id');

	await editor.process(req.body);
	res.json(editor.data());
});

module.exports = router;
