import { ActivateTranscriptionsConfig, DeactivateTranscriptionsConfig } from "./param_types";
/**
 *
 * @param ActivateTranscriptionsConfig Required params to initialise the middleware.
 * `meeting` is needed to send messages across peers and to listen to room messages.
 * `bhasaAccessToken` is needed to connect to bhasa.ai.
 * @returns the raw result which `meeting.self.addAudioMiddleware` returns
 */
declare function activateTranscriptions({ meeting, bhasaAccessToken, languageCode, }: ActivateTranscriptionsConfig): Promise<{
    success: boolean;
    message: string;
}>;
declare function deactivateTranscriptions({ meeting, }: DeactivateTranscriptionsConfig): Promise<void>;
export { activateTranscriptions, deactivateTranscriptions };
