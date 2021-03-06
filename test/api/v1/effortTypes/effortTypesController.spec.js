const assert = require('assert');
const proxyquire =  require('proxyquire').noCallThru();
const sinon = require('sinon');

let queryResolve;
let effortTypesController;
let queryStub;

describe('effortTypesController', () => {
  beforeEach(() => {
    queryResolve = {
      query: () => Promise.resolve()
    };

    queryStub = sinon.stub(queryResolve, 'query').returns(Promise.resolve());

    effortTypesController = proxyquire('api/v1/effortTypes/effortTypesController', {
      '../../../services/neo4jHelpers': queryResolve
    });
  });

  afterEach(() => {
    queryStub.restore();
  });

  describe('#deleteEffortType', () => {
    it('should return a rejected promise when called without a valid UUID', (done) => {
      effortTypesController.deleteEffortType().catch(() => done());
    });

    it('should return a rejected promise when called without a valid UUID', (done) => {
      effortTypesController.deleteEffortType('invalid-id').catch(() => done());
    });

    it('should pass the ID in the second argument to .query()', () => {
      const guid = '110ec58a-a0f2-4ac4-8393-c866d813b8d1';
      const queryPromise = effortTypesController.deleteEffortType(guid);
      const secondArgPassedToQuery = queryResolve.query.getCall(0).args[1];

      assert.deepEqual(secondArgPassedToQuery, {id: guid});
    });
  });

  describe('#getEffortType', () => {
    it('should return a rejected promise when called without a valid UUID', (done) => {
      effortTypesController.getEffortType().catch(() => done());
    });

    it('should return a rejected promise when called without a valid UUID', (done) => {
      effortTypesController.getEffortType('invalid-id').catch(() => done());
    });

    it('should pass the ID in the second argument to .query()', () => {
      const guid = '110ec58a-a0f2-4ac4-8391-c866d813b8d1';
      const queryPromise = effortTypesController.getEffortType(guid);
      const secondArgPassedToQuery = queryResolve.query.getCall(0).args[1];

      assert.deepEqual(secondArgPassedToQuery, {id: guid});
      queryStub.restore();
    });
  });

  describe('#getEffortTypes', () => {
    it('should contained ":EffortType" in the call to query', () => {
      const queryPromise = effortTypesController.getEffortTypes();
      const firstArgPassedToQuery = queryResolve.query.getCall(0).args[0];

      assert(firstArgPassedToQuery.includes(':EffortType'));
    });
  });

  describe('#createEffortType', () => {
    const validEffortType = {
      name: 'Epic',
      fields: [
        {
          name: 'title',
          type: 'title'
        }
      ]
    };

    it('should return a rejected promise when called without a parameter', (done) => {
      effortTypesController.createEffortType().catch(() => done());
    });

    it('should return a rejected promise when called without a "name" property', (done) => {
      effortTypesController.createEffortType({fields: validEffortType.fields}).catch(() => done());
    });

    it('should return a rejected promise when called without a "fields" property', (done) => {
      effortTypesController.createEffortType({name: 'valid name'}).catch(() => done());
    });

    it('should return a promise when called with a valid effortType', (done) => {
      effortTypesController.createEffortType(validEffortType).then(() => done());
    });

    it('should pass the the effortType as the second argument to .query()', () => {
      const queryPromise = effortTypesController.createEffortType(validEffortType);
      const secondArgPassedToQuery = queryResolve.query.getCall(0).args[1];

      assert.deepEqual(secondArgPassedToQuery, validEffortType);
    });
  });
});
