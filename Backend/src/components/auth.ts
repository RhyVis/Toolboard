import debug from 'debug';
import crypto from 'crypto';

let tokenGlobalHash = '';

const initAuth = async (map: any) => {
  let token = process.env.TOKEN;
  if (!token) {
    console.log('Must set the token!');
    process.exit(1);
  } else {
    tokenGlobalHash = crypto.createHash('sha1').update(token).digest('hex');
    console.log(`Token set to ${tokenGlobalHash}`);
  }
}

function auth(tokenTest: string) {
  let testHash = crypto.createHash('sha1').update(tokenTest).digest('hex');
  let result = testHash === tokenGlobalHash;
  debug(`Token challange of ${tokenTest} has ${result ? 'succeed' : 'failed'}`);
  return result;
}

function authHash(hashTest: string) {
  let result = hashTest === tokenGlobalHash;
  debug(`Hash challange of ${hashTest} has ${result ? 'succeed' : 'failed'}`);
  return result;
}

export { initAuth, auth, authHash }
