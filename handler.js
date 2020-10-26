"use strict";

const faunadb = require("faunadb"),
  q = faunadb.query;

module.exports.createByText = async event => {
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
  const regex = new RegExp(
    /(?<qty>[0-9\.]+)\s+(?<unit>[a-zA-Z]+).?\s+#(?<task>\w+)/gim
  );
  const parsedMessageArr = regex.exec(event);
  const { qty, unit, task } = parsedMessageArr.groups;

  // Write parsed SMS values to FaunaDB
  const res = await client.query(
    q.Create(q.Collection("log"), {
      data: {
        qty: qty,
        task: task,
        unit: unit
      }
    })
  );

  return {
    statusCode: 200,
    body: res
  };
};
