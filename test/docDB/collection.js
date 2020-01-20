const { expect } = require("chai");
const fse = require("fs-extra");
const path = require("path");
const shortid = require("shortid");
const docDB = require("../../src/docDB");

const cleanup = dbName =>
    fse.removeSync(path.resolve(__dirname, `../../src/docDB/_db/${dbName}`));

const testErr = done => () => done(new Error("Test Error"));

let invertPromise = pr =>
    new Promise((resolve, reject) => pr.then(reject).catch(resolve));

let docObj1 = {
    id: 1,
    firstname: "John",
    surname: "Doe",
    is_validated: true,
    emails: ["john@doe.com", "jd@example.com", "jd4@jd.com"],
    address: null
};

describe("docDB add/remove a collection", function() {
    let dbName = `TEST_${shortid.generate()}`;
    let db = docDB.createDB(dbName);
    before(() => cleanup(dbName));
    after(() => cleanup(dbName));

    it("foo", function(done) {
        expect(docDB.foo).to.be.a("function");
        docDB
            .foo()
            .then(() => done())
            .catch(err => {
                expect(err).to.be.instanceOf(Error);
                expect(err.message).to.equal(`Something`);
                done();
            });
    });

    it.skip("should be able to create a collection", function(done) {
        let collectionName = `collection_${shortid.generate()}`;
        expect(db.createCollection).to.be.a("function");
        db.createCollection(collectionName)
            .then(() => done())
            .catch(testErr(done));
    });

    it.skip("should error out if one attempts to create a collection that already exists", function(done) {
        let collectionName = `collection_${shortid.generate()}`;
        db.createCollection(collectionName)
            .then(() => {
                db.createCollection(collectionName)
                    .then(testErr(done))
                    .catch(err => {
                        expect(err).to.be.instanceOf(Error);
                        expect(err.message).to.equal(
                            `Collection ${collectionName} already exists`
                        );
                        done();
                    });
            })
            .catch(testErr(done));
    });

    it.skip("should be able to delete a collection", function(done) {
        let collectionName = `collection_${shortid.generate()}`;
        expect(db.deleteCollection).to.be.a("function");
        db.createCollection(collectionName)
            .then(
                db
                    .deleteCollection(collectionName)
                    .then(() => done())
                    .catch(err => done(err))
            )
            .catch(testErr(done));
    });

    it.skip("should return an error if one attempts to delete a collection that does not exist", function(done) {
        let collectionName = `collection_${shortid.generate()}`;
        db.deleteCollection(collectionName)
            .then(testErr(done))
            .catch(err => {
                expect(err).to.be.instanceOf(Error);
                expect(err.message).to.equal(
                    `Collection ${collectionName} does not exist`
                );
                done();
            });
    });

    it.skip("should be able to retrieve a collection", function() {
        expect(db.getCollection).to.be.a("function");
    });
});

describe.skip("docDB collection ops", function(done) {
    let dbName = `TEST_${shortid.generate()}`;
    let collectionName = `collection_${shortid.generate()}`;
    let db = docDB.createDB(dbName);
    before(() => cleanup(dbName));
    after(() => cleanup(dbName));

    let collectionOpts = {
        id: "user-defined"
    };

    db.createCollection(collectionName, collectionOpts)
        .then(() => {
            let collection = db.getCollection(collectionName);
            describe("add valid document to a collection", function(done) {
                let docID = shortid.generate();
                let doc = JSON.stringify({ ...docObj1, id: docID });
                collection
                    .add(doc)
                    .then(id => {
                        expect(id).to.equal(docID);
                        done();
                    })
                    .catch(testErr(done));
            });

            describe("errors if one attempts to add a document whose id matches one already present in the db", function(done) {
                let docID = shortid.generate();
                let doc = JSON.stringify({ ...docObj1, id: docID });
                collection
                    .add(doc)
                    .then(id => {
                        expect(id).to.equal(docID);
                        collection
                            .add(doc)
                            .then(testErr(done))
                            .catch(err => {
                                expect(err).to.be.instanceOf(Error);
                                expect(err.message).to.equal(
                                    `Doc [${id}] already exists`
                                );
                                done();
                            });
                    })
                    .catch(testErr(done));
            });

            describe("errors if one attempts to add non-object json", function(done) {
                let invalidDocs = ['"string"', "[1, 2, 3]", 4, null];
                let inserts = Promise.all(
                    invalidDocs
                        .map(doc => collection.add(doc))
                        .map(invertPromise)
                );
                inserts
                    .then(res => {
                        res.forEach(err => {
                            expect(err).to.be.instanceOf(Error);
                            expect(err.message).to.equal(`Invalid doc`);
                        });
                        done();
                    })
                    .catch(testErr(done));
            });

            describe("insert and retrieve a document without additional modification", function(done) {
                let docID = shortid.generate();
                let originalDocObj = { ...docObj1, id: docID };
                let originalDocJSON = JSON.stringify(originalDocObj);
                collection
                    .add(docJSON)
                    .then(id => {
                        expect(id).to.equal(docID);
                    })
                    .then(() => collection.findByID(docID).then())
                    .then(retrievedDoc => {
                        expect(retrievedDoc).to.deep.equal(docObj);
                        expect(retrievedDoc.toJSON()).to.equal(originalDocJSON);
                        done();
                    })
                    .catch(testErr(done));
            });

            describe("if id is user-defined, reject doc if id not provided");

            describe("delete single document by id");

            describe("errorrs if id for delete does not exist in db");

            describe("update a document based on its id");

            describe("reject update if non-object json provided");

            describe("reject update if id does not exist in database");

            describe("nested update");
        })
        .catch(testErr(done));
});

describe("handles different id options");
