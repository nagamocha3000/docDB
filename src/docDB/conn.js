const level = require("level");
const path = require("path");
const dbPath = path.resolve(__dirname, "./_db");

module.exports.connect = (dbName, opts) => {
    opts = opts || { valueEncoding: "json" };
    return level(path.resolve(dbPath, dbName), opts);
};
