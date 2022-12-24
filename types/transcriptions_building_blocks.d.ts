import { BroadcastMessagePayload } from '@dytesdk/web-core/types/client/DyteParticipants';
declare function getWebSocket(): WebSocket;
declare function setWebSocket(newWS: WebSocket): void;
declare function getTranscriptions(): BroadcastMessagePayload[];
declare function setTranscriptions(newTranscriptions: BroadcastMessagePayload[]): void;
declare function getPeerIdBySymblId(symblId: string): string;
declare function setPeerIdForSymblId(symblId: string, peerId: string): void;
export { getWebSocket, setWebSocket, getTranscriptions, setTranscriptions, getPeerIdBySymblId, setPeerIdForSymblId, };
