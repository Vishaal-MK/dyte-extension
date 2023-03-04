import { BroadcastMessagePayload } from '@dytesdk/web-core/types/client/DyteParticipants';

let ws: WebSocket;

let transcriptions: BroadcastMessagePayload[] = [];

const bhasaIdToPeerIdMap: {[key: string]: string} = {};

function getWebSocket() {
    return ws;
}
function setWebSocket(newWS: WebSocket) {
    ws = newWS;
}

function getTranscriptions() {
    return transcriptions;
}

function setTranscriptions(newTranscriptions: BroadcastMessagePayload[]) {
    transcriptions = newTranscriptions;
}

function getPeerIdBybhasaId(bhasaId: string) {
    return bhasaIdToPeerIdMap[bhasaId];
}

function setPeerIdForbhasaId(bhasaId: string, peerId: string) {
    bhasaIdToPeerIdMap[bhasaId] = peerId;
}

export {
    getWebSocket,
    setWebSocket,
    getTranscriptions,
    setTranscriptions,
    getPeerIdBybhasaId,
    setPeerIdForbhasaId,
};
