let db = require('../db');
let router = require('express').Router();
let {
	Editor,
	Field,
	Validate,
	Format,
	Options
} = require("datatables.net-editor-server");

router.all('/api/sites', async function(req, res) {
	let editor = new Editor(db, 'sites')
		.fields(
			new Field('id').set(false),
			new Field('name').validator(Validate.notEmpty())
		)
		.join(
			new Mjoin('users')
				.link('sites.id', 'users.site')
				.fields(
					new Field('id')
				)
		);

	await editor.process(req.body);
	res.json(editor.data());
});

module.exports = router;
