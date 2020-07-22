import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify, decode } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import Axios from 'axios'
import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'

const logger = createLogger('auth')

const cert = `-----BEGIN CERTIFICATE-----
MIIDATCCAemgAwIBAgIJXY88Y9IpP/jKMA0GCSqGSIb3DQEBCwUAMB4xHDAaBgNV
BAMTE215YXZ1ei51cy5hdXRoMC5jb20wHhcNMjAwNzEzMDcxNTAyWhcNMzQwMzIy
MDcxNTAyWjAeMRwwGgYDVQQDExNteWF2dXoudXMuYXV0aDAuY29tMIIBIjANBgkq
hkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtC2/9vRwXzt2MHS3hbz+a34WikwsZuGd
nmltv+kg86jxuKaX4Nov+DM4A+yk4zEedpGxfVhsCxZCDqA3PlFI2gCZ6/MV79MW
0dnpTaRdiw6z1RF6dwwQ/aCjybezpGfgIrOwJi9DhgDU2mWDmtURWZUr81ZzdOyB
776QQFNw0OcC1dLs8B/8OlYj7YkP8e3IgiH1P7ixVTVfc1oq7vEA4Ar1kQQKW3qf
MsHVs0/2CTbvMdoS/VK7hrTmoHoFhGRrU11BvLT3uPGrxt0jjaToQWGx26NX7Mh7
/mKw7VdP5R8KIBsxZaTZkLT+z+GXGE+wsx/K5MKpLYi+WA292l0srQIDAQABo0Iw
QDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBSGUyhaznbZ8p10UyF4/WA4bSd4
BDAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEBAGqQfTRGDsg6t/6/
WBGVKK5vhUbMzmWYyuC6SWb45OUhbkvdhfbbNntt12nIlD2zuSyWVJq730iBSpYN
nWTnp6HmUuJdPrbBohO0cbymtk+I50kUy+EPd/TDyDYcBUu7kCYuQSmc2tWxFkE1
6ogmD6XDLKxTL/i3VvN9wjD4Qd3hWrY4QGob+I/EbDJIpFdKRZA7vVMIl8MeW8rj
HXFrq9+A3L6/JBR+gxEylaMkpDbLXb+h7N38l4kTOUpDf5ipm3nHq+7MNN4R+CWz
ulqD6PpwgtHt+es0NUZ0fmWOxA08JF7TM+R9mK6kN3zXrzvDKt7P6GOAxZioK3Tp
YLT1x8A=
-----END CERTIFICATE-----`

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)
  const jwt: Jwt = decode(token, { complete: true }) as Jwt

  // TODO: Implement token verification
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/
  console.log(jwt, Axios, verify, jwt)

  return verify(token, cert,  { algorithms: ['RS256'] }) as JwtPayload
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
