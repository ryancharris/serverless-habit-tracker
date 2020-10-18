"use strict";

const faunadb = require("faunadb"),
  q = faunadb.query;

module.exports.hello = async event => {
  const client = new faunadb.Client({
    secret: process.env.FAUNA_KEY,
    domain: "localhost",
    scheme: "http",
    port: 8443
  });

  const res = await client.query(
    q.Map(
      q.Paginate(q.Collections()),
      q.Lambda(x => q.Get(x))
    )
  );

  return {
    statusCode: 200,
    body: res
  };
};
