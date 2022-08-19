let db = require('../db');
let router = require('express').Router();
let {
	Editor,
	Field,
	Validate,
	Format,
	Options
} = require("datatables.net-editor-server");

router.all('/api/datetime', async function(req, res) {
	let editor = new Editor(db, 'users')
		.fields(
			new Field('first_name'),
			new Field('last_name'),
			new Field('updated_date')
                .validator(
                    Validate.dateFormat(
                        'MM-DD-YYYY h:mm A',
                        null,
                        new Validate.Options({
                            message: 'Please enter a date in the format MM-DD-YYYY h:mm a'
                        })
                    )
                )
                .getFormatter(Format.dateTime('YYYY-MM-DD HH:mm:ss', 'MM-DD-YYYY h:mm A'))
                .setFormatter(Format.dateTime('MM-DD-YYYY h:mm A', 'YYYY-MM-DD HH:mm:ss')),
            new Field('registered_date')
                .validator(
                    Validate.dateFormat(
                        'D MMM YYYY HH:mm',
                        null,
                        new Validate.Options({
                            message: 'Please enter a date in the format D MMM YYYY HH:mm'
                        })
                    )
                )
                .getFormatter(Format.dateTime('YYYY-MM-DD HH:mm:ss', 'D MMM YYYY HH:mm'))
                .setFormatter(Format.dateTime('D MMM YYYY HH:mm'), 'YYYY-MM-DD HH:mm:ss')
		);

	await editor.process(req.body);
	res.json(editor.data());
});

module.exports = router;
