
let controllers = require( './controllers/index' );
let bodyParser = require( 'body-parser' );
let express = require( 'express' );
let bb = require( 'express-busboy' );
require('source-map-support').install();
let db = require('./db');

let app = express();
app.set( 'trust proxy', true );

// Show error information
process.on( 'unhandledRejection', (reason, p) => {
	console.log( 'Unhandled promise error:  ' + p + reason );
	console.log( 'stack: ' + reason.stack );
} );

// Allow file uploads
app.use( bodyParser.urlencoded({ extended: true }) );
bb.extend( app, {
	upload: true
} );
app.use( controllers );

// Static files for the demo. Use nginx or similar for real deploys
app.use( express.static('public') );
app.use( '/examples', express.static('examples') );

// 500 Error
app.use( function( err, req, res, next ) {
	res
		.status(500)
		.send('Something broke!');
} );

// 404 Error
app.use( function( req, res ) {
	res
		.status(404)
		.send('Sorry cant find that!');
} );

// Listening
app.listen( 8081, '0.0.0.0', function () {
    console.log( 'DataTables Editor demo - navigate to http://localhost:8081/' );
} );

// Test the database connection on startup by getting a list of table names in the db
// This can safely be removed if you are happy with your db connection configuration.
// It is used purely to show a console error if the connection is not available.
let query;
let bindings;

switch(db.client.constructor.name) {
	case 'Client_MSSQL':
		query = 'SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\' AND table_catalog = ?',
		bindings = [ db.client.database() ];
		break;
	case 'Client_MySQL':
	case 'Client_MySQL2':
		query = 'SHOW TABLES';
		break;
	case 'Client_PG':
		query =  'SELECT table_name FROM information_schema.tables WHERE table_schema = current_schema() AND table_catalog = ?';
		bindings = [ db.client.database() ];
		break;
	case 'Client_SQLite3':
		query = "SELECT name AS table_name FROM sqlite_master WHERE type='table'";
		break;
	case 'Client_Oracledb':
		query = "SELECT owner, table_name FROM all_tables";
		break;
}

db.raw(query, bindings)
	.then(function() {
		; // noop
	})
	.catch(function(err) {
		console.error( err.toString() );
	});
