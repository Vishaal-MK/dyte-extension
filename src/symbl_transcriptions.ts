import audioTranscriptionMiddleware from "./audio_middleware";
import {
  ActivateTranscriptionsConfig,
  DeactivateTranscriptionsConfig,
} from "./param_types";
import {
  getPeerIdBybhasaId,
  getWebSocket,
  setPeerIdForbhasaId,
  setTranscriptions,
  setWebSocket,
} from "./transcriptions_building_blocks";

/**
 *
 * @param ActivateTranscriptionsConfig Required params to initialise the middleware.
 * `meeting` is needed to send messages across peers and to listen to room messages.
 * `bhasaAccessToken` is needed to connect to bhasa.ai.
 * @returns the raw result which `meeting.self.addAudioMiddleware` returns
 */
async function activateTranscriptions({
  meeting,
  bhasaAccessToken,
  languageCode,
}: ActivateTranscriptionsConfig) {
  // As a fail-safe, deactivateTranscriptions if activateTranscriptions function is called twice
  // eslint-disable-next-line no-use-before-define
  deactivateTranscriptions({ meeting });

  const uniqueMeetingId = meeting.meta.roomName;
  const bhasaEndpoint = `ws://216.48.191.199:8000/ws/listen`;

  const ws = new WebSocket(bhasaEndpoint);
  setWebSocket(ws);

  // Fired when a message is received from the WebSocket server
  ws.onmessage = async (event) => {
    const data = JSON.parse(event.data);
    console.log("data is",data);
    if (data.type === "message_response") {
      data.messages?.forEach((message: any) => {
        // console.log('Live transcript (more accurate): ', message.payload.content, data);

        if (getPeerIdBybhasaId(message.from?.id) === meeting.self.id) {
          // More accurate Transcript
          meeting.participants.broadcastMessage(
            "audioTranscriptionMessage", // This can be named anything we want
            {
              text: message.payload.content,
              isPartialTranscript: false,
              startTimeISO:
                message.duration?.startTime || new Date().toISOString(),
              endTimeISO: message.duration?.endTime || new Date().toISOString(),
              peerId: meeting.self.id,
              displayName: meeting.self.name,
            }
          );
        }
      });
    }

    if (
      data.type === "message" &&
      Object.prototype.hasOwnProperty.call(data.message, "punctuated")
    ) {
      // console.log('Live transcript (less accurate): ',
      //     data.message.punctuated.transcript, data);
      if (data.message.user?.peerId === meeting.self.id) {
        // bhasa sends their own user Id in from.id for accurate messages
        // Need this mapping there to use it to show/send transcripts
        setPeerIdForbhasaId(data.message.user.id as string, meeting.self.id);

        meeting.participants.broadcastMessage(
          "audioTranscriptionMessage", // This can be named anything we want
          {
            text: data.message.punctuated.transcript,
            isPartialTranscript: true,
            startTimeISO:
              data.message.duration?.startTime || new Date().toISOString(),
            endTimeISO:
              data.message.duration?.endTime || new Date().toISOString(),
            peerId: meeting.self.id,
            displayName: meeting.self.name,
          }
        );
      }
    }
  };

  // Fired when the WebSocket closes unexpectedly due to an error or lost connetion
  ws.onerror = (err) => {
    // eslint-disable-next-line no-console
    console.error("bhasa websocket error: ", err);
  };

  // Fired when the WebSocket connection has been closed
  ws.onclose = () => {
    // eslint-disable-next-line no-console
    console.info("Connection to bhasa websocket closed");
  };

  // Fired when the connection succeeds.
  ws.onopen = () => {
    ws.send(
      JSON.stringify({
        event: "config",
        language: "en-US",
        timestamp: true,
        confidence: true,
        api_key: "a1b2c33d4e5f6g7h8i9jakblc",
        interim_output: false,
        profanity: true,
        encoding: "LINEAR_PCM",
      })
    );
  };

  return meeting.self.addAudioMiddleware(audioTranscriptionMiddleware);
}

async function deactivateTranscriptions({
  meeting,
}: DeactivateTranscriptionsConfig) {
  try {
    setTranscriptions([]);
    meeting.self.removeAudioMiddleware(audioTranscriptionMiddleware);
    getWebSocket()?.close();
  } catch (ex) {
    // eslint-disable-next-line no-console
    console.error("Failed to close bhasa websocket. Error: ", ex);
  }
}

export { activateTranscriptions, deactivateTranscriptions };
