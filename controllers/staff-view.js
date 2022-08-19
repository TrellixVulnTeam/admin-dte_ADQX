let db = require('../db');
let router = require('express').Router();
let {
	Editor,
	Field,
	Validate,
	Format,
	Options
} = require("datatables.net-editor-server");

router.all('/api/staff-view', async function(req, res) {
	let editor = new Editor(db, 'users')
		.readTable('staff_newyork')
		.fields(
			new Field('first_name').validator(Validate.notEmpty()),
			new Field('last_name').validator(Validate.notEmpty()),
			new Field('phone'),
			new Field('city'),
			new Field('site')
				.get(false)
				.setValue(4) // New York, for the VIEW condition
	);

	await editor.process(req.body);
	res.json(editor.data());
});

module.exports = router;
