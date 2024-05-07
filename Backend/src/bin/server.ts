#!/usr/bin/env node

require('module-alias/register')

import { initTarot } from '@/components/tarot';
import { initSpam } from '@/components/spam';
import { initMajo } from '@/components/majo';
import { initAuth } from '@/components/auth';
import axios, { AxiosError } from 'axios';
import app from '@/app';
import debugLib from 'debug';
import http from 'http';
import figlet from 'figlet';

const debug = debugLib('res-backend:server');
const port = normalizePort(process.env.PORT || '3800');
const endpoint = process.env.ENDPOINT || 'UNSET';

let resourceMap: Record<string, string> = {};
let linkMap: Record<string, string> = {};

// Setup
(async (resourceMap: Record<string, string>, linkMap: Record<string, string>) => {
  if (endpoint === 'UNSET') {
    console.error('No avaliable endpoint set');
    process.exit(1);
  }
  console.log(
    figlet.textSync("Resolvo", {
        font: "3D Diagonal",
        horizontalLayout: "default",
        verticalLayout: "default"
    })
  );
  try {
    let { version, mappings, links } = (await axios.get(joinUrl(endpoint, 'map.json'))).data;
    console.log(`Fetched global mappings of version ${version}`)
    for (let key in mappings) {
      resourceMap[key] = joinUrl(endpoint, mappings[key]);
    }
    for (let key in links) {
      linkMap[key] = links[key];
    }
  } catch (e) {
    let { code, config } = e as AxiosError;
    console.log(`Caught unexpected error on requesting ${config?.url}`);
    console.log(code);
    process.exit(1);
  }
})(resourceMap, linkMap).then(async () => {
  console.log('');
  console.log('On auth load:');
  await initAuth(resourceMap);
  console.log('');
  console.log('On tarot load:');
  await initTarot(resourceMap);
  console.log('');
  console.log('On spam load:');
  await initSpam(resourceMap);
  console.log('');
  console.log('On majo load:');
  await initMajo(resourceMap);
  console.log('');
  console.log('With links listed');
  for (let key in linkMap) {
    console.log(`[${key}]: ${linkMap[key]}`);
  }
  console.log('');
  console.log('Preload complete');
});

app.set('port', port);

var server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val:any) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

function onError(error:any) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr!.port;
  console.log(`Listening on ${bind}`);
}

function joinUrl(base: string, ...extra: string[]) {
  return `${base}/${extra.join('/')}`;
}

export { resourceMap, linkMap, joinUrl }
