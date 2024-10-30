import { SignJWT, jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.ADMIN_PASSWORD);

export async function createToken() {
  const token = await new SignJWT({})
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret);
  
  return token;
}

export async function verifyToken(token: string) {
  try {
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}