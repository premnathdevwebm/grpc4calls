const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const PROTO_PATH = __dirname + "/../protos/helloworld.proto";

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const hello_proto = grpc.loadPackageDefinition(packageDefinition).helloworld;

const client = new hello_proto.Greeter(
  "0.0.0.0:50051",
  grpc.credentials.createInsecure()
);

const sayHello = async (req, res) => {
  client.SayHello({ name: "world" }, (err, response) => {
    if (err) {
      return res.status(500).send("Error: " + err.message);
    } else {
      return res.status(200).send(response);
    }
  });
};

const streamGrpcData = async (req, res) => {
  const datas = [];
  let call = client.SayHelloStreamReply({ name: "world" });
  call.on("data", (data) => {
    datas.push(data);
  });
  call.on("end", () => {
    return res.status(200).send(datas);
  });
  call.on("error", (err) => {
    return res.status(500).send(err.message);
  });
};

const streamClientGrpc = async (req, res) => {
  const { names } = req.query;
  let call = client.SayHelloClientStream((error, response) => {
    if (error) {
      return res.status(500).send(error.message);
    } else {
      return res.status(200).send(response);
    }
  });

  (JSON.parse(names)).forEach(name => {
    call.write({ name });
  });

  call.end();
};
const biDirectionalGrpc = async (req, res) => {
  const { names } = req.query;
  const responses = [];

  let call = client.SayHelloBidirectional();

  call.on('data', (response) => {
    responses.push(response);
  });

  call.on('end', () => {
    return res.status(200).send(responses);
  });

  call.on('error', (error) => {
    return res.status(500).send(error.message);
  });

  (JSON.parse(names)).forEach(name => {
    call.write({ name });
  });

  call.end();
};

module.exports = {
  sayHello,
  streamGrpcData,
  streamClientGrpc,
  biDirectionalGrpc,
};
