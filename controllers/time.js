let db = require('../db');
let router = require('express').Router();
let {
	Editor,
	Field,
	Validate,
	Format,
	Options
} = require("datatables.net-editor-server");

router.all('/api/time', async function(req, res) {
	let editor = new Editor(db, 'users')
		.fields(
			new Field('first_name'),
			new Field('last_name'),
			new Field('city'),
			new Field('shift_start')
                .validator(Validate.dateFormat('h:mm A'))
                .getFormatter(Format.dateTime('HH:mm:s', 'h:mm A'))
                .setFormatter(Format.dateTime('h:mm A', 'HH:mm:s')),
            new Field('shift_end')
                .validator(Validate.dateFormat('HH:mm:ss'))
		);

	await editor.process(req.body);
	res.json(editor.data());
});

module.exports = router;
