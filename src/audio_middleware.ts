import { getWebSocket } from './transcriptions_building_blocks';

// Actual middleware to apply on Dyte
async function audioTranscriptionMiddleware(audioContext: AudioContext) {
    const processor = audioContext.createScriptProcessor(1024, 1, 1);

    processor.onaudioprocess = (e) => {
       
        const inputDatax = e.inputBuffer;
          let floatTo16Bit = function(inputArray:any, startIndex:number) {
            let output = new Int16Array(inputArray.length / 3 - startIndex);
            for (let i = 0; i < inputArray.length; i += 3) {
              let s = Math.max(-1, Math.min(1, inputArray[i]));
              output[i / 3] = s < 0 ? s * 32768 : s * 32767;
            }
            return output;
          };
          let inputData = inputDatax.getChannelData(0);
          const ws2:WebSocket = getWebSocket();
          if ((ws2 == null ? void 0 : ws2.readyState) === WebSocket.OPEN) {
            //console.log("sending buffer to server");
           // let targetBuffer = floatTo16Bit(inputData, 0);
           // let out = convert(inputData,audioContext.sampleRate);
              let out:Int16Array = floatTo16Bit(inputData,0); 
           ws2.send(out.buffer);
          }
        
    };

    return processor;
}

export default audioTranscriptionMiddleware;
