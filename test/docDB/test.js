const assert = require("assert");
const expect = require("chai").expect;
const fse = require("fs-extra");
const path = require("path");

describe("docDB", function() {
    it("should load module without throwing an error", () => {
        const loadDocDBModule = function() {
            let _ = require("../../src/docDB");
        };
        expect(loadDocDBModule).to.not.throw();
    });

    describe("in general", function() {
        let docDB,
            dbName = "TEST1";

        before(function() {
            docDB = require("../../src/docDB");
        });

        after(function() {
            fse.remove(
                path.resolve(__dirname, `../../src/docDB/_db/${dbName}`)
            );
        });

        it("should throw an error if one attempts to connect to a database that does not exist", function() {
            expect(docDB.exists(dbName)).to.be.false;
            expect(docDB.connect).to.be.a("function");
            expect(() => {
                docDB.connect(dbName);
            }).to.throw("db does not exist");
        });

        it("should be able to create a new database", function() {
            let db = docDB.createDB(dbName);
            expect(db).to.not.be.undefined;
            expect(db).to.not.be.null;
        });

        it("should throw an error if one attempts to create a database that already exists", function() {
            expect(() => docDB.createDB(dbName)).to.throw("db already exists");
        });

        it("should be able to connect to a database that's already been created", function() {
            expect(() => docDB.connect(dbName)).to.not.throw();
        });

        it("should be able to check if a database exists", function() {
            expect(docDB.exists(dbName)).to.be.true;
        });

        it("should delete a database", function() {
            docDB.deleteDB(dbName);
            expect(docDB.exists(dbName)).to.be.false;
            expect(() => docDB.connect(dbName)).to.throw("db does not exist");
            expect(() => docDB.deleteDB(dbName)).to.throw("db does not exist");
        });
    });
});
