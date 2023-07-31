var PROTO_PATH = __dirname + "/./protos/helloworld.proto";

var grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");
var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
var hello_proto = grpc.loadPackageDefinition(packageDefinition).helloworld;

function sayHello(call, callback) {
  callback(null, { message: "Hello " + call.request.name });
}

function SayHelloStreamReply(call) {
  for (let i = 0; i < 10; i++) {
    call.write({ message: "Hello " + call.request.name + ", response " + i });
  }
  call.end();
}

function sayHelloClientStream(call, callback) {
  let name = '';
  call.on('data', function(request) {
    name += request.name + ' ';
  });
  call.on('end', function() {
    callback(null, { message: 'Hello ' + name });
  });
}

function sayHelloBidirectional(call) {
  call.on('data', function(request) {
    call.write({ message: 'Hello ' + request.name });
  });
  call.on('end', function() {
    call.end();
  });
}


function main() {
  var server = new grpc.Server();
  server.addService(hello_proto.Greeter.service, {
    sayHello: sayHello,
    SayHelloStreamReply: SayHelloStreamReply,
    sayHelloClientStream: sayHelloClientStream,
    sayHelloBidirectional: sayHelloBidirectional
  });
  server.bindAsync(
    "0.0.0.0:50051",
    grpc.ServerCredentials.createInsecure(),
    () => {
      server.start();
    }
  );
}

main();
