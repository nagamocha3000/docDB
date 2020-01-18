const level = require("level");
const path = require("path");
const dbPath = path.resolve(__dirname, "./_db");
const fs = require("fs");
const fse = require("fs-extra");

const getDB = (() => {
    let openedDBs = new Map();
    let opts = { valueEncoding: "json" };
    return dbName => {
        let db = openedDBs.get(dbName);
        if (db === undefined) {
            try {
                db = level(path.resolve(dbPath, dbName), opts);
                openedDBs.set(dbName, db);
            } catch (error) {
                console.error("err2");
            }
        }
        return db;
    };
})();

const createDB = dbName => {
    if (exists(dbName)) throw new Error("db already exists");
    return getDB(dbName);
};

const connect = dbName => {
    if (exists(dbName)) return getDB(dbName);
    else throw new Error("db does not exist");
};

const exists = dbName =>
    fs
        .readdirSync(dbPath, { withFileTypes: true })
        .filter(entry => entry.isDirectory())
        .map(entry => entry.name)
        .includes(dbName);

const deleteDB = dbName => {
    if (exists(dbName)) {
        fse.removeSync(path.resolve(dbPath, dbName));
    } else throw new Error("db does not exist");
};

module.exports = { connect, exists, createDB, deleteDB };
