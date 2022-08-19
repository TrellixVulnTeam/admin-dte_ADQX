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

router.all('/api/joinArray', async function(req, res) {
	let editor = new Editor(db, 'users')
		.fields(
			new Field('users.first_name'),
			new Field('users.last_name'),
			new Field('users.site').options(
				new Options().table('sites').value('id').label('name')
			),
			new Field('sites.name')
		)
		.leftJoin('sites', 'sites.id', '=', 'users.site')
		.join(
			new Mjoin('permission')
				.link('users.id', 'user_permission.user_id')
				.link('permission.id', 'user_permission.permission_id')
				.order('name asc')
				.validator( 'permission[].id', Validate.mjoinMaxCount(4, 'No more than four selections please'))
				.fields(
					new Field('id')
						.validator(Validate.required())
						.options(
							new Options().table('permission').value('id').label('name')
						),
					new Field('name')
				)
		);

	await editor.process(req.body);
	res.json(editor.data());
});

module.exports = router;
