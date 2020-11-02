"use strict";

const faunadb = require("faunadb"),
  q = faunadb.query;

module.exports.createByText = async (event, context, callback) => {
  const { message, from } = JSON.parse(event.body);
  let clientParams = {
    secret: process.env.FAUNA_KEY,
    domain: process.env.FAUNA_HTTP_DOMAIN,
    scheme: process.env.FAUNA_HTTP_SCHEME
  };

  if (process.env.STAGE_ENV === "development") {
    clientParams.port = 8443;
  }

  // Instantiate client to write to FaunaDB
  const client = new faunadb.Client(clientParams);

  // Parse values from SMS string using RegEx
  const parsedMessageArr = /(?<qty>[0-9\.]+)\s+(?<unit>[a-zA-Z]+).?\s+#(?<task>\w+)/gim.exec(
    message
  );
  const { qty, unit, task } = parsedMessageArr.groups;

  // Write parsed SMS values to FaunaDB
  return await client
    .query(
      q.Create(q.Collection("log"), {
        data: {
          from: from,
          qty: qty,
          task: task,
          unit: unit
        }
      })
    )
    .then(res => {
      JSON.stringify({
        statusCode: 200,
        body: res
      });
    })
    .catch(err => {
      JSON.stringify({
        statusCode: err.requestResult.statusCode,
        body: {
          name: err.name,
          message: err.message,
          description: err.description
        }
      });
    });
};
