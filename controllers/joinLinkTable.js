let db = require('../db');
let router = require('express').Router();
let {
	Editor,
	Field,
	Validate,
	Format,
	Options
} = require("datatables.net-editor-server");

router.all('/api/joinLinkTable', async function(req, res) {
	let editor = new Editor(db, 'users')
		.fields(
			new Field('users.first_name'),
			new Field('users.last_name'),
			new Field('users.phone'),
			new Field('users.site').options(
				new Options().table('sites').value('id').label('name')
			),
			new Field('sites.name'),
			new Field('user_dept.dept_id').options(
				new Options().table('dept').value('id').label('name')
            ),
            new Field('dept.name')
		)
		.leftJoin('sites',     'sites.id',          '=', 'users.site')
		.leftJoin('user_dept', 'users.id',          '=', 'user_dept.user_id')
		.leftJoin('dept',      'user_dept.dept_id', '=', 'dept.id');

	await editor.process(req.body);
	res.json(editor.data());
});

module.exports = router;
