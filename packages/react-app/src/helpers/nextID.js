import { ecsign, toRpcSig, keccak256 } from 'ethereumjs-util'
import crypto from "crypto"

async function personalSign(message, privateKey) {
    const msg = "\x19Ethereum Signed Message:\n" + message.length + message;
    const messageHash = keccak256(msg)
    const signature = ecsign(messageHash, privateKey)
    return Buffer.from(toRpcSig(signature.v, signature.r, signature.s).slice(2), 'hex')
}

export const generateNextIDSignature = async (address) => {
    const hash = crypto.createHmac('sha256', address)
                   .digest('hex');
    const message = Buffer.from('TestMessage', 'utf8');
    const secretKey = Buffer.from(hash, 'hex');
    const signature = await personalSign(message, secretKey);

    return '0x'+signature.toString('hex');
}