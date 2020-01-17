const assert = require("assert");
const expect = require("chai").expect;

describe("docDB", function() {
    it("should load module without throwing an error", () => {
        const loadDocDBModule = function() {
            let _ = require("../../src/docDB");
        };
        expect(loadDocDBModule).to.not.throw();
    });

    describe("in general", function() {
        let docDB,
            dbName = "TEST";

        before(function() {
            docDB = require("../../src/docDB");
        });

        it("should throw an error if one attempts to connect to a database that does not exist", function() {
            expect(docDB.connect).to.be.a("function");
            expect(() => {
                docDB.connect(dbName);
            }).to.throw("db does not exist");
        });

        it("should be able to create a new database");

        it(
            "should throw an error if one attempts to create a database that already exists"
        );

        it(
            "should be able to connect to a database that's already been created"
        );

        it("should delete a database");

        // it("should create new database", function() {
        //     let db = docDB.createDB(dbName);
        //     expect(db).to.not.be.undefined;
        //     expect(db).to.not.be.null;
        // });
    });
});
