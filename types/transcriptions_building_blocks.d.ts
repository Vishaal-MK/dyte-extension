import { BroadcastMessagePayload } from '@dytesdk/web-core/types/client/DyteParticipants';
declare function getWebSocket(): WebSocket;
declare function setWebSocket(newWS: WebSocket): void;
declare function getTranscriptions(): BroadcastMessagePayload[];
declare function setTranscriptions(newTranscriptions: BroadcastMessagePayload[]): void;
declare function getPeerIdBybhasaId(bhasaId: string): string;
declare function setPeerIdForbhasaId(bhasaId: string, peerId: string): void;
export { getWebSocket, setWebSocket, getTranscriptions, setTranscriptions, getPeerIdBybhasaId, setPeerIdForbhasaId, };
