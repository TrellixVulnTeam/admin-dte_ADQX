let knex = require("knex");
let dbConfig = {
  client: "mysql2",
  connection: {
    // user: "root",
    // password: "1234",
    // database: "conaz",
    // host: "localhost",
    user: "datatables",
    password: "test",
    database: "conaz",
    host: "10.23.100.73",
    filename: "", // Only used for SQLite
    dateStrings: true,
    // user: "zerotwo@zerotwo-mysql",
    // password: "wpfhxn1234!",
    // database: "conaz",
    // host: "zerotwo-mysql.mysql.database.azure.com",
    // filename: "", // Only used for SQLite
    // dateStrings: true,
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
