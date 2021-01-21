import express, { Router, json } from "express";
const app : express.Application = express();

app.use(json());

const serviceName = 'identity';
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
router.route('/account').post(json(), (req, resp) => {
  req.body.serverMessage = 'hello';
  return resp.status(200).json(req.body);
});

//Create Company
router.route('/company').post(json(), (req, resp) => {
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

app.use('/',router);
app.listen(port, () => console.log(`DAPR App [${serviceName}] started: listening on port:${port} with daprHttpPort:${daprHttpPort}, daprGrpcPort:${daprGrpcPort}, daprMetricsPort${daprMetricsPort}`));

export default router;