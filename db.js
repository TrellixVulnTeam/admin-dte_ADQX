let knex = require("knex");
require('dotenv').config({ path: `${__dirname}/../.env` });
let dbConfig = {
  client: "mysql2",

  connection: {
    user: process.env.NODE_ENV === 'development' ? "datatables" :"zerotwo@zerotwo-mysql",
    password: process.env.NODE_ENV === 'development' ? "test" : "wpfhxn1234!",
    database: "conaz",
    host: process.env.NODE_ENV === 'development' ? "10.23.100.73":"zerotwo-mysql.mysql.database.azure.com",
    filename: "", // Only used for SQLite
    dateStrings: true,
  },
};

// Need a bit of customisation for Oracle to use ISO date stamps
if (dbConfig.client === "oracledb") {
  dbConfig.fetchAsString = ["date", "number", "clob"];
  dbConfig.pool = {
    afterCreate: function (conn, done) {
      conn.execute(
        "ALTER SESSION SET NLS_DATE_FORMAT='YYYY-MM-DD HH24:MI:SS'",
        function (err) {
          if (err) {
            done(err, conn);
          } else {
            done(err, conn);
          }
        }
      );
    },
  };
}

module.exports = knex(dbConfig);
