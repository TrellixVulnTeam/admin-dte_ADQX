let db = require('../db');
let router = require('express').Router();
let {
	Editor,
	Field,
	Validate,
	Format,
	Options,
	Mjoin
} = require("datatables.net-editor-server");

router.all('/api/softDelete', async function(req, res) {
	let editor = new Editor(db, 'users')
		.fields(
			new Field('users.first_name'),
			new Field('users.last_name'),
			new Field('users.phone'),
			new Field('users.removed_date').setFormatter(Format.ifEmpty(null)),
			new Field('users.site').options(
				new Options()
					.table('sites')
					.value('id')
					.label('name')
			),
			new Field('sites.name')
		)
        .leftJoin('sites', 'sites.id', '=', 'users.site')
        .where( 'users.removed_date', null )
        .on( 'preRemove', () => {
            // Disallow delete, just in case someone tries to use the API directly
            return false;
        } );

	await editor.process(req.body);
	res.json(editor.data());
});

module.exports = router;
