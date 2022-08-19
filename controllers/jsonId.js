let db = require('../db');
let router = require('express').Router();
let {
	Editor,
	Field,
	Validate,
	Format,
	Options
} = require("datatables.net-editor-server");

router.all('/api/jsonId', async function(req, res) {
	let editor = new Editor(db, 'datatables_demo').fields(
		new Field('id')
			.getFormatter( (val) => {
				// Body parser needs a string to treat the object sent by
				// the client as an object rather than as an array
				return 'row_' + val;
			} )
			.set(false), // ID is automatically set by the database on create
		new Field('first_name').validator(Validate.notEmpty()),
		new Field('last_name').validator(Validate.notEmpty()),
		new Field('position'),
		new Field('office'),
		new Field('extn'),
		new Field('age')
			.validator(Validate.numeric())
			.setFormatter(Format.ifEmpty(null)),
		new Field('salary')
			.validator(Validate.numeric())
			.setFormatter(Format.ifEmpty(null)),
		new Field('start_date')
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
			.setFormatter(Format.formatToSqlDate('YYYY-MM-DD'))
	);

	await editor.process(req.body);

	let data = editor.data();
	
	// On 'read' remove the DT_RowId property so we can see fully how the `idSrc`
	// option works on the client-side
	for ( let i = 0, ien = data.data.length ; i < ien ; i++ ) {
		delete data.data[i].DT_RowId;
	}

	res.json(data);
});

module.exports = router;
