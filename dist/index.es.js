let ws;
let transcriptions = [];
const bhasaIdToPeerIdMap = {};
function getWebSocket() {
  return ws;
}
function setWebSocket(newWS) {
  ws = newWS;
}
function getTranscriptions$1() {
  return transcriptions;
}
function setTranscriptions(newTranscriptions) {
  transcriptions = newTranscriptions;
}
function getPeerIdBybhasaId(bhasaId) {
  return bhasaIdToPeerIdMap[bhasaId];
}
function setPeerIdForbhasaId(bhasaId, peerId) {
  bhasaIdToPeerIdMap[bhasaId] = peerId;
}
let listernerParam;
const broadcastedMessageCB = async ({ payload, type }) => {
  if (type === "audioTranscriptionMessage") {
    let filteredTranscriptions = [];
    getTranscriptions$1().forEach((transcription) => {
      const shouldKeep = transcription.peerId !== payload.peerId || transcription.peerId === payload.peerId && !transcription.isPartialTranscript;
      if (shouldKeep) {
        filteredTranscriptions.push(transcription);
      }
    });
    filteredTranscriptions.push(payload);
    filteredTranscriptions = filteredTranscriptions.slice(-1 * listernerParam.noOfTranscriptionsToCache);
    setTranscriptions(filteredTranscriptions);
    listernerParam == null ? void 0 : listernerParam.transcriptionsCallback(filteredTranscriptions);
  }
};
async function addTranscriptionsListener(param) {
  listernerParam = param;
  param.meeting.participants.on("broadcastedMessage", broadcastedMessageCB);
}
async function removeTranscriptionsListener$1({
  meeting
}) {
  try {
    meeting.participants.removeListener("broadcastedMessage", broadcastedMessageCB);
  } catch (ex) {
    console.error("Failed to close Bhasa websocket. Error: ", ex);
  }
}

// Send audio stream to websocket
async function audioTranscriptionMiddleware(audioContext) {
  const processor = audioContext.createScriptProcessor(1024, 1, 1);
  processor.onaudioprocess = (e) => {
    const inputDatax = e.inputBuffer;
    let floatTo16Bit = function(inputArray, startIndex) {
      let output = new Int16Array(inputArray.length / 3 - startIndex);
      for (let i = 0; i < inputArray.length; i += 3) {
        let s = Math.max(-1, Math.min(1, inputArray[i]));
        output[i / 3] = s < 0 ? s * 32768 : s * 32767;
      }
      return output;
    };
    let inputData = inputDatax.getChannelData(0);
    const ws2 = getWebSocket();
    if ((ws2 == null ? void 0 : ws2.readyState) === WebSocket.OPEN) {
      let out = floatTo16Bit(inputData, 0);
      ws2.send(out.buffer);
    }
  };
  return processor;
}
async function activateTranscriptions$1({
  meeting,
  bhasaAccessToken,
  languageCode
}) {
  deactivateTranscriptions$1({ meeting });
  meeting.meta.roomName;
  const bhasaEndpoint = `wss://transcribe-api.bhasa.io/ws`;
  const ws2 = new WebSocket(bhasaEndpoint);
  setWebSocket(ws2);
  ws2.onmessage = async (event) => {
    var _a, _b, _c, _d;
    const data = JSON.parse(event.data);
    console.log("data is", data);
    if (data.type === "message_response") {
      (_a = data.messages) == null ? void 0 : _a.forEach((message) => {
        var _a2, _b2, _c2;
        if (getPeerIdBybhasaId((_a2 = message.from) == null ? void 0 : _a2.id) === meeting.self.id) {
          meeting.participants.broadcastMessage("audioTranscriptionMessage", {
            text: message.payload.content,
            isPartialTranscript: false,
            startTimeISO: ((_b2 = message.duration) == null ? void 0 : _b2.startTime) || new Date().toISOString(),
            endTimeISO: ((_c2 = message.duration) == null ? void 0 : _c2.endTime) || new Date().toISOString(),
            peerId: meeting.self.id,
            displayName: meeting.self.name
          });
        }
      });
    }
    if (data.type === "message" && Object.prototype.hasOwnProperty.call(data.message, "punctuated")) {
      if (((_b = data.message.user) == null ? void 0 : _b.peerId) === meeting.self.id) {
        setPeerIdForbhasaId(data.message.user.id, meeting.self.id);
        meeting.participants.broadcastMessage("audioTranscriptionMessage", {
          text: data.message.punctuated.transcript,
          isPartialTranscript: true,
          startTimeISO: ((_c = data.message.duration) == null ? void 0 : _c.startTime) || new Date().toISOString(),
          endTimeISO: ((_d = data.message.duration) == null ? void 0 : _d.endTime) || new Date().toISOString(),
          peerId: meeting.self.id,
          displayName: meeting.self.name
        });
      }
    }
  };
  ws2.onerror = (err) => {
    console.error("bhasa websocket error: ", err);
  };
  ws2.onclose = () => {
    console.info("Connection to bhasa websocket closed");
  };
  ws2.onopen = () => {
    ws2.send(JSON.stringify({
      event: "config",
      language: "en-US",
      timestamp: true,
      confidence: true,
      api_key: "a1b2c33d4e5f6g7h8i9jakblc",
      interim_output: false,
      profanity: true,
      encoding: "LINEAR_PCM"
    }));
  };
  return meeting.self.addAudioMiddleware(audioTranscriptionMiddleware);
}
async function deactivateTranscriptions$1({
  meeting
}) {
  var _a;
  try {
    setTranscriptions([]);
    meeting.self.removeAudioMiddleware(audioTranscriptionMiddleware);
    (_a = getWebSocket()) == null ? void 0 : _a.close();
  } catch (ex) {
    console.error("Failed to close bhasa websocket. Error: ", ex);
  }
}
async function activateTranscriptions(param) {
  var _a;
  if (!((_a = param == null ? void 0 : param.meeting) == null ? void 0 : _a.self)) {
    throw new Error("arguments[0].meeting.self is not available. Did you miss calling new DyteClient first?");
  }
  if (!(param == null ? void 0 : param.bhasaAccessToken)) {
    throw new Error("Missing arguments[0].bhasaAccessToken. We need bhasa access token to retrive conversations and to generate transcriptions");
  }
  return activateTranscriptions$1(param);
}
async function deactivateTranscriptions(param) {
  var _a;
  if (!((_a = param.meeting) == null ? void 0 : _a.self)) {
    throw new Error("arguments[0].meeting.self is not available. Did you miss calling new DyteClient first?");
  }
  return deactivateTranscriptions$1(param);
}
async function addTranscriptionsListerner(param) {
  var _a;
  if (!((_a = param == null ? void 0 : param.meeting) == null ? void 0 : _a.self)) {
    throw new Error("arguments[0].meeting.self is not available. Did you miss calling new DyteClient first?");
  }
  if (!(param == null ? void 0 : param.transcriptionsCallback)) {
    throw new Error("arguments[0].transcriptionsCallback is not missing. Please provide transcriptionsCallback.");
  }
  return addTranscriptionsListener(param);
}
async function removeTranscriptionsListener(param) {
  var _a;
  if (!((_a = param.meeting) == null ? void 0 : _a.self)) {
    throw new Error("arguments[0].meeting.self is not available. Did you miss calling new DyteClient first?");
  }
  return removeTranscriptionsListener$1(param);
}
function getTranscriptions() {
  return getTranscriptions$1();
}
export { activateTranscriptions, addTranscriptionsListerner, deactivateTranscriptions, getTranscriptions, removeTranscriptionsListener };
