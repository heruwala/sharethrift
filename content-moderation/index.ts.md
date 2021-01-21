import express, { Router, json } from "express";
const app : express.Application = express();

app.use(json());

const port =  3001; // needs to match --app_port 

// when running through vs code (daprd) - env variables won't be set, so need to manually set here:
const daprdDefaults = {
  daprHttpPort: 3501,
  daprGrpcPort: 50001,
  daprMetricsPort: 9091
}

// Ports injected by dapr into container:
const daprHttpPort = process.env.DAPR_HTTP_PORT || daprdDefaults.daprHttpPort;
const daprGrpcPort  = process.env.DAPR_GRPC_PORT || daprdDefaults.daprGrpcPort;
const daprMetricsPort = process.env.DAPR_METRICS_PORT || daprdDefaults.daprMetricsPort;

const router = Router();

router.route('/healthz').get((_, res) => {
  res.send({ app: 'identity-service', status: 'healthy' });
});

app.use('/',router);
app.listen(port, () => console.log(`DAPR App [content-moderation] started: listening on port:${port}! with daprHttpPort:${daprHttpPort}, daprGrpcPort:${daprGrpcPort}, daprMetricsPort${daprMetricsPort}`));

export default router;

/*
var client = new dapr.dapr_grpc.DaprClient(
  `localhost:${daprGrpcPort}`, grpc.credentials.createInsecure());
*/

/*
router.route('/').get((_, response) => {
  return response.status(200).send("No parsing needed here rockstar 32");
});
*/

//import grpc from "grpc";
//import dapr from 'dapr-client';

/*
var messages = dapr.dapr_pb; 
var services = dapr.dapr_grpc;
*/
