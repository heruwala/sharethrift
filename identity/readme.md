Pleaes revivew 


Helpful Resources;
//https://xaviergeerinck.com/post/dapr/creating-account-microservice
//https://github.com/ksivamuthu/cloud-dapr-demo/blob/master/kitchen-service/app.js

 
 .vscode/
    launch.json
    tasks.json

Each DAPR instance when running through daprd needs unique ports:

      "appId": "identity",
      "appPort": 3001,
      "httpPort": 3501,
      "metricsPort": 9091,
      "grpcPort": 50001,

App Port / --app-port

AppPort needs to be the same port that the express web server is serving content on.


HTTP Port / --dapr-http-port
Metrics Port / --metrics-port
GRPC Port / --dapr-grpc-port



      "alsoLogToStdError": true,
      "componentsPath": "$HOME/.dapr/components",



Scaling subscriptions is hard, filtering by user, also hard.. so leveraging Azure's SignalR is easier.

https://itnext.io/how-we-manage-live-1m-graphql-websocket-subscriptions-11e1880758b0