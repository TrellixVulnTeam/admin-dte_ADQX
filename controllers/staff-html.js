let db = require('../db');
let router = require('express').Router();
let {
	Editor,
	Field,
	Validate,
	Format,
	Options
} = require("datatables.net-editor-server");

router.all('/api/staff-html', async function(req, res) {
	let editor = new Editor(db, 'datatables_demo').fields(
		new Field('first_name').validator(Validate.notEmpty()),
		new Field('last_name').validator(Validate.notEmpty()),
		new Field('position'),
		new Field('office'),
		new Field('salary')
			.validator(Validate.numeric())
            .setFormatter(Format.ifEmpty(null))
            .getFormatter( (val) => {
                return '$'+val;
            })
	);

	await editor.process(req.body);
	res.json(editor.data());
});

module.exports = router;
