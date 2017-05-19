const R = require('ramda');

function handleSuccess (session, results) {
  session.close();
  if (results.records && results.records.length) {
    return results.records.map(record => {
      // ref. 'private' member of data to make this method easily testable.
      return record._fields;
      /** Below is the approach suggested by the docs but it is hard to test
      /*  since it relies on data being an instance of a class from neo4j-driver
      /*  that is difficult to mock.
       */
      // return record.keys.reduce((memo, key) => memo[key] = record.get(key), {});
    });
  }
  return [];
}

function handleError (session, error) {
  session.close();
  throw new Error(error);
}

// returns a string to be used as a neo4j-driver .run() argument
// it does not acutally add the values to be written to the DB.
// e.g. "item1: {item1}, item2: {item2}"
function makeParamString (params) {
  return R.reduce((memo, item) => {
    return `${memo} ${item}: {${item}},`
  }, '', params)
  .replace(/\,$/, '') // remove trailing comma
  .trim(); // remove trailling whitespace
}

module.exports = {
  handleSuccess,
  handleError,
  makeParamString
}
