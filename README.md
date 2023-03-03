# Dyte <> Bhasa.io transcriptions

## How to use?

Find the Dyte integration logic in your codebase which may look like this

```
// Somewhere in your codebase
const meeting = await DyteClient.init(...)
```

On top of the file where integration was found, import this package.

```
import {
    activateTranscriptions,
    deactivateTranscriptions,
    addTranscriptionsListerner,
    removeTranscriptionsListener
} from '@dytesdk/bhasa-transcription';
```

Now you can activate Bhasa transcriptions.

```
activateTranscriptions({
    meeting: meeting, // From DyteClient.init
    bhasaAccessToken: 'ACCESS_TOKEN_FROM_BHASA_AI',
});
```

This would ensure that your audio gets translated and resultant transcriptions get sent to all participants including `self` being referred by `meeting.self`.

If you want to show transcriptions to a participant or for `self`, you can do so using the following snippet.

```
addTranscriptionsListerner({
    meeting: meeting,
    noOfTranscriptionsToCache: 200,
    transcriptionsCallback: (allFormattedTranscriptions) => { console.log(allFormattedTranscriptions); },
})
```

Using `transcriptionsCallback` you can populate the transcriptions in your app/website at any desired place.

<b>NOTE</b>: For every partial or complete sentence, `transcriptionsCallback` will be called, with all formatted transcriptions.

Once meeting is over, deactivate the transcription generation.

```
deactivateTranscriptions({
    meeting: meeting, // From DyteClient.init
    bhasaAccessToken: 'ACCESS_TOKEN_FROM_BHASA_AI',
});
```
In similar fashion, remove the transcriptions listener, once the meeting is over.

```
removeTranscriptionsListener({meeting: meeting});
```
