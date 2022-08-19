let db = require('../db');
let router = require('express').Router();
let {
	Editor,
	Field,
	Validate,
	Format,
	Options
} = require("datatables.net-editor-server");

router.all('/api/checkbox', async function(req, res) {
	let editor = new Editor(db, 'users')
		.fields(
			new Field('first_name'),
			new Field('last_name'),
			new Field('phone'),
			new Field('city'),
			new Field('zip'),
            new Field('active')
                .setFormatter( function ( val, data, opts ) {
                    return ! val ? 0 : 1;
                } )
		);

	await editor.process(req.body);
	res.json(editor.data());
});

module.exports = router;
