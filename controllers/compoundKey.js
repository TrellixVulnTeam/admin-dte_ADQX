let db = require('../db');
let router = require('express').Router();
let {
	Editor,
	Field,
	Validate,
	Format,
	Options
} = require("datatables.net-editor-server");

// The key thing to note for compound key support is the use of an array as the
// third parameter for the Editor constructor, which is used to tell Editor what
// the primary key column(s) are called (default is just `id`).
router.all('/api/compoundKey', async function(req, res) {
	let editor = new Editor(db, 'users_visits', ['user_id', 'visit_date'])
		.fields(
			new Field('users_visits.user_id')
				.options(
					new Options()
						.table('users')
						.value('id')
						.label(['first_name', 'last_name'])
				)
				.validator(Validate.dbValues()),
			new Field('users_visits.site_id')
				.options(new Options().table('sites').value('id').label('name'))
				.validator(Validate.dbValues()),
			new Field('users_visits.visit_date')
				.validator(
					Validate.dateFormat(
						'YYYY-MM-DD',
						null,
						new Validate.Options({
							message: 'Please enter a date in the format yyyy-mm-dd'
						})
					)
				)
				.getFormatter(Format.sqlDateToFormat('YYYY-MM-DD'))
				.setFormatter(Format.formatToSqlDate('YYYY-MM-DD')),
			new Field('sites.name').set(false),
			new Field('users.first_name').set(false),
			new Field('users.last_name').set(false)
		)
		.leftJoin('sites', 'users_visits.site_id', '=', 'sites.id')
		.leftJoin('users', 'users_visits.user_id', '=', 'users.id')
		.validator(async function(editor, action, data) {
			if (action === 'edit') {
				// Detect duplicates
				let keys = Object.keys(data.data);

				for (let i = 0, ien = keys.length; i < ien; i++) {
					let key = keys[i];
					let values = data.data[key];
					let pkey = editor.pkeyToObject(key);

					// Discount the row being edited
					if (
						pkey.users_visits.user_id != values.users_visits.user_id ||
						pkey.users_visits.visit_date != values.users_visits.visit_date
					) {
						// Are there any rows that conflict?
						let any = await editor.db()('users_visits')
							.count('user_id as cnt')
							.where({
								user_id: values.users_visits.user_id,
								visit_date: values.users_visits.visit_date
							});

						// If there was a matching row, then report it as an error
						if (any.length && any[0].cnt != 0) {
							return 'This staff member is already busy that day';
						}
					}
				}
			}
		});

	await editor.process(req.body);
	res.json(editor.data());
});

module.exports = router;
