let db = require('../db');
let router = require('express').Router();
let {
	Editor,
	Field,
	Validate,
	Format,
	Options
} = require("datatables.net-editor-server");

router.all('/api/dates', async function(req, res) {
    let update;
    let registered;
    let format = req.query.format ?
        req.query.format :
        '';
    
    // Different formats supported for the demo
    if ( format === 'custom' ) {
        update = 'M/D/YYYY';
        registered = 'dddd D MMMM YYYY';
    }
    else {
        update = 'YYYY-MM-DD';
        registered = 'YYYY-MM-DD';
    }
    
	let editor = new Editor(db, 'users')
		.fields(
			new Field('first_name'),
			new Field('last_name'),
			new Field('updated_date')
                .validator(
                    Validate.dateFormat(
                        update,
                        null,
                        new Validate.Options({
                            message: 'Please enter a date in the format ' + update
                        })
                    )
                )
                .getFormatter(Format.sqlDateToFormat(update))
                .setFormatter(Format.formatToSqlDate(update)),
            new Field('registered_date')
                .validator(
                    Validate.dateFormat(
                        registered,
                        null,
                        new Validate.Options({
                            message: 'Please enter a date in the format ' + registered
                        })
                    )
                )
                .getFormatter(Format.sqlDateToFormat(registered))
                .setFormatter(Format.formatToSqlDate(registered))
		);

	await editor.process(req.body);
	res.json(editor.data());
});

module.exports = router;
