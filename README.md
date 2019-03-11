# lightcheck

Progect developed by Luca Di Liello for the IoT course by the University of Trento.

## How to

- Reach the main folder `lightcheck`

- Install all server libraries
```
npm install
```

- Install the client libraries
```
cd client
npm install
cd ..
```

- Start the express server with:
```
npm run start
```

- Launch the simulator with:
```
node simulator.js
```

- Start the client development server
```
cd client
npm run start
```

## Other utilities

- Reset the database:
```
node reset_db.js
```

- To change tile and osrm server for OpenStreetMaps edit the files `config.json` and `client/src/Config/config.json`

- Enjoy 
