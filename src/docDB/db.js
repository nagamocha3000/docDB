const level = require("level");
const path = require("path");
const dbPath = path.resolve(__dirname, "./_db");

const getDBs = () => {
    let contents = fs.readdirSync(dbPath, { withFileTypes: true });
    let dbNames = contents
        .filter(entry => entry.isDirectory())
        .map(entry => entry.name);
    return dbNames;
};

const connect = dbName => {
    throw new Error("db does not exist");
};

module.exports = { connect };
