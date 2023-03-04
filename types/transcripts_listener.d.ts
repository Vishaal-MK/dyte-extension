/**
 * Though this file indicates the integration of bhasa.ai.
 * We are not utilising bhasa.ai messaging in favor of Dyte websocket messaging.
 * This is being done to propagate User Name against their transcriptions.
 */
import { AddTranscriptionsListenerConfig, RemoveTranscriptionsListenerConfig } from './param_types';
/**
 * @param AddTranscriptionsListenerConfig
 * noOfTranscriptionsToCache is the count of transcriptions you want
 */
declare function addTranscriptionsListener(param: AddTranscriptionsListenerConfig): Promise<void>;
declare function removeTranscriptionsListener({ meeting, }: RemoveTranscriptionsListenerConfig): Promise<void>;
export { addTranscriptionsListener, removeTranscriptionsListener, };
