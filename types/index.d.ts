import { ActivateTranscriptionsConfig, DeactivateTranscriptionsConfig, AddTranscriptionsListenerConfig, RemoveTranscriptionsListenerConfig } from './param_types';
declare function activateTranscriptions(param: ActivateTranscriptionsConfig): Promise<{
    success: boolean;
    message: string;
}>;
declare function deactivateTranscriptions(param: DeactivateTranscriptionsConfig): Promise<void>;
declare function addTranscriptionsListerner(param: AddTranscriptionsListenerConfig): Promise<void>;
declare function removeTranscriptionsListener(param: RemoveTranscriptionsListenerConfig): Promise<void>;
declare function getTranscriptions(): import("@dytesdk/web-core/types/client/DyteParticipants").BroadcastMessagePayload[];
export { activateTranscriptions, deactivateTranscriptions, addTranscriptionsListerner, removeTranscriptionsListener, getTranscriptions, };
