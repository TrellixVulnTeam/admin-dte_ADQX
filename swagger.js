const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "My API",
    description: "Description",
  },
  host: "13.125.245.83",
  schemes: ["http"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./bin/www.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
