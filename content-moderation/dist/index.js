"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const app = express_1.default();
app.use(express_1.json());
const serviceName = 'content-moderaation';
const port = 3002; // needs to match --app_port 
// when running through vs code (daprd) - env variables won't be set, so need to manually set here:
const daprdDefaults = {
    daprHttpPort: 3502,
    daprGrpcPort: 50002,
    daprMetricsPort: 9092
};
// Ports injected by dapr into container:
const daprHttpPort = process.env.DAPR_HTTP_PORT || daprdDefaults.daprHttpPort;
const daprGrpcPort = process.env.DAPR_GRPC_PORT || daprdDefaults.daprGrpcPort;
const daprMetricsPort = process.env.DAPR_METRICS_PORT || daprdDefaults.daprMetricsPort;
const router = express_1.Router();
router.route('/health22').get((_, res) => {
    res.send({ app: serviceName, status: 'healthy' });
});
router.route('/healthz').get((_, res) => {
    res.send({ app: serviceName, status: 'healthy' });
});
/*
router.route('/dapr/subscribe').get((_, res) => {
  res.send({ app: 'identity-service', status: 'healthy' });
});

router.route('/').get((_, response) => {
  
  return response.status(200).send(`No parsing needed here daprPort:${daprPort} daprGRPCPort:${daprGRPCPort} httpExternalPort:${process.env.HTTP_EXTERNAL_PORT} `);
});
*/
//Create Account
router.route('/account').post(express_1.json(), (req, resp) => {
    return resp.status(200).json(req.body);
});
//Create Company
router.route('/company').post(express_1.json(), (req, resp) => {
    return resp.status(200).json(req.body);
});
//Invite to Company
//Remove from Company
//Assign Role
//Join Company
//Leave Company
//Suspend Account
//Delete Account
//Manage Profile
/*

kubectl apply -f ./deploy/default.yaml
minikube service identity

*/
app.use('/', router);
app.listen(port, () => console.log(`DAPR App [${serviceName}] started: listening on port:${port} with daprHttpPort:${daprHttpPort}, daprGrpcPort:${daprGrpcPort}, daprMetricsPort${daprMetricsPort}`));
exports.default = router;
//# sourceMappingURL=index.js.map