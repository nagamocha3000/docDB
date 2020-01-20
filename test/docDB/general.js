const expect = require("chai").expect;
const fse = require("fs-extra");
const path = require("path");
const shortid = require("shortid");

describe.skip("docDB", function() {
    it.skip("should load module without throwing an error", () => {
        const loadDocDBModule = function() {
            let _ = require("../../src/docDB");
        };
        expect(loadDocDBModule).to.not.throw();
    });

    describe("in general", function() {
        let docDB,
            dbName = `TEST_${shortid.generate()}`;

        before(function() {
            docDB = require("../../src/docDB");
            fse.removeSync(
                path.resolve(__dirname, `../../src/docDB/_db/${dbName}`)
            );
        });

        after(function() {
            fse.removeSync(
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
            db.close();
        });

        it("should throw an error if one attempts to create a database that already exists", function() {
            expect(docDB.exists(dbName)).to.be.true;
            expect(() => docDB.createDB(dbName)).to.throw("db already exists");
        });

        it("should be able to connect to a database that's already been created", function() {
            expect(() => {
                let db = docDB.connect(dbName);
                db.close();
            }).to.not.throw();
        });

        it("should be able to check if a database exists", function() {
            expect(docDB.exists(dbName)).to.be.true;
        });

        it("should delete a database", function() {
            expect(docDB.deleteDB).to.be.a("function");
            docDB.deleteDB(dbName);
            expect(docDB.exists(dbName)).to.be.false;
            expect(() => docDB.connect(dbName)).to.throw("db does not exist");
        });
    });
});
