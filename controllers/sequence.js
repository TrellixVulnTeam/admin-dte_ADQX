let db = require('../db');
let router = require('express').Router();
let {
	Editor,
	Field,
	Validate,
	Format,
	Options
} = require("datatables.net-editor-server");

router.all('/api/sequence', async function(req, res) {
	let editor = new Editor(db, 'audiobooks').fields(
		new Field('title').validator(Validate.notEmpty()),
		new Field('author').validator(Validate.notEmpty()),
		new Field('duration').validator(Validate.notEmpty()),
		new Field('readingOrder').validator(Validate.notEmpty()),
    );
    
    editor.on( 'preCreate', async (e, values) => {
        // On create update all the other records to make room for our new one
        await e
            .db()('audiobooks')
            .update('readingOrder', e.db().raw('readingOrder+1'))
            .where('readingOrder', '>=', values.readingOrder);
    } );
    
    editor.on( 'preRemove', async (e, id, values) => {
		// On remove, the sequence needs to be updated to decrement all rows
		// beyond the deleted row. Get the current reading order by id (don't
        // use the submitted value in case of a multi-row delete).
        let order = await e.db()('audiobooks').first('readingOrder').where('id', id);

        await e
            .db()('audiobooks')
            .update('readingOrder', e.db().raw('readingOrder-1'))
            .where('readingOrder', '>=', order.readingOrder);
    } );

	await editor.process(req.body);
	res.json(editor.data());
});

module.exports = router;
