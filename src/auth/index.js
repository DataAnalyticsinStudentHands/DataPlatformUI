import { jwtVerify } from 'jose';

const publicKey = `-----BEGIN PUBLIC KEY-----
MIIEpAIBAAKCAQEApw69M06brXPZ0GLFWycBWDWSX6H4VciXzY41b68weusympwJ
48FJHE7orsDIZ3KxRh4LgnrGauour47u34QHdamWeNxT3d3kIe5jq7iHAT1wW9WG
z5KjA5OflnmoG4xkH1fm4wyPNz9Sf3CbH+cAIRWuaUjjqGnzG46UAmChXhkEirbv
htLBz+nB1PX0jjSxTGT5kzbjUJgsbmtDDiQcq/K0Uh9qmmN6cdB5y/QjM8hkEo6J
Ngir4NL1h7yq92jy30hXSfnoGW5dFgT3QUAX6hjr8eF/uzqpEv4xcwpFe9KprlCA
cJDn1pN+I6cMRrNRjlbGuWhwsKs+OHLLqXEFjwIDAQABAoIBABN6M3L88kep3zZd
nbb/+Dcpn9RIlSSjS5eqwe4wlc1vCKpgEQMd8QE87gIZ9gOhqquLKzpeSC4E+cZ8
OruSsC/2wtV6ksima0fNfI9z50GswSHj5mDjLuBm4M9xhbkYiD/jRscoGraNSngT
T/LLQweYeIpL9kcXe0G2QOl6DLZkscWyFUoc4Cp6WUyVvnD5HxbgCtiKmZs4SQpp
DXYDqPiYsqUk3p1Ix+VXqLcxjzSjzekwbTd9Qfa1TG/sdpB5/8M/eVBvIjVbSNdF
e0Tb99kC4SO5E9+QPNaQO+93hBrlYI4YwQQPgyAizKSZZTElH23CZZma57PJ5Is9
lXjZb/ECgYEA6I1tEmdGsCqjGKvdwM/oMQ0ETBOmvOvyoqxxbIYnm1WL20icZ+Bz
z6SCJ2ZdwgWisTNFa9tkrwZYTn+D4TQL1RToT/Fiv69ZJNCEMye0e97lhlOdDNT/
krD/ngwk59Uro47juETfpN5hhNxEQpnzzMk9ri1wVU0j0evyzXW2bXcCgYEAt+bH
b20iuYUHR5nD6BGJPZv6EOIurvWWFZPwZPPDULcjKabcPQz6YdxdKXXk9yKWlkKt
2JMC0iM9Zzvrx+OTP/1CStM7Tadgsk5WTIxJaqB3xcDEx9e4V+wX40AvMDTbxtoy
R/WIe0z2JNp/kwM1xENPul5SDbI1bc1RB967zqkCgYEAo+a5jxT2/0atuL+5BSID
dj7EXpIjHFf3pKuBLYnH9HTwo1aj1ZqeRSSfDwHY5txt9BI8xW3Von4IUxsQafLy
u/WGXoG0pYEChS3pXtyHGh7ZCjl4IQkmL89L+ap5gGP/48Dbwo3YSizp8mgEPCSh
bh4PuOkRmS1LJ7LyZ9ilALUCgYBXZ0vqXYhffCZVlXNS3OLJcVSMqbNeXEKUxtc+
Y8y0lBYWOcP7ECwATufISMwl2T6Q8+gEQvrYPP92DTimrDbT9t6HCZXp9l8y36CM
iTBriRDj4BamlJR81S0VSPAkjTrXa+Tx5nSThaSHJ4HysVfgi81c2m9NKyHRqf+V
KftA4QKBgQDfEF8H2Q8zFRbh8IaPZCC6iA1QRPVxLskB8xXy9kwMBpjxKiNeRox8
BrBPyvwckwxYeFn+EvLseP6EWPF1t+45QUdqR10hbZ9a9rUBr2K1fWfIm19G2D4D
YaoGyiyLx+1uiXq8D/IRivJz511xVg0jvba4GMDeMoc4B+Kd9Bxbdg==
-----END PUBLIC KEY-----`;

export async function verifyJWT(token) {
  try {
    const { payload } = await jwtVerify(token, publicKey);
    return payload; // Returns the verified claims
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}
