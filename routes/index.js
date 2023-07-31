const { Router } = require("express");
const grpcRoutes = require("./grpcRoutes");

const router = new Router();
router.use(grpcRoutes);
module.exports = router;
