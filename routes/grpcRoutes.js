const router = require("express").Router();
const grpcController = require("../controllers/grpcController");

router.get("/", grpcController.sayHello);
router.get("/serverstream", grpcController.streamGrpcData);
router.get("/clientstream", grpcController.streamClientGrpc);
router.get("/birectionstream", grpcController.biDirectionalGrpc);

module.exports = router;
