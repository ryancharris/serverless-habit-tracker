"use strict";

const faunadb = require("faunadb"),
  q = faunadb.query;

module.exports.createByText = async event => {
  const client = new faunadb.Client({
    secret: process.env.FAUNA_KEY,
    domain: "localhost",
    scheme: "http",
    port: 8443
  });

  const res = await client.query(
    q.Create(q.Collection("activity-log"), {
      data: {
        timestamp: Date.now(),
        activity: event.activity,
        duration: event.duration
      }
    })
  );

  return {
    statusCode: 200,
    body: res
  };
};
