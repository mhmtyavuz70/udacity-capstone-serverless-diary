// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '4qhh52lgt4'
export const apiEndpoint = `https://${apiId}.execute-api.us-west-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'myavuz.us.auth0.com',
  clientId: 'HR8FGaKdqc67XA4a355o6Ext68ffGOET',
  callbackUrl: 'http://localhost:3000/callback'
}
