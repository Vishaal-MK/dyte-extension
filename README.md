On top of the file with Dyte integration import this package.

```
import {
    activateTranscriptions,
    deactivateTranscriptions,
    addTranscriptionsListerner,
    removeTranscriptionsListener
} from '@dytesdk/bhasa-transcription';
```

Now activate Bhasa transcriptions.

```
activateTranscriptions({
    meeting: meeting, // From DyteClient.init
    bhasaAccessToken: 'ACCESS_TOKEN_FROM_BHASA_AI',
});
```

This would ensure that your audio gets translated and resultant transcriptions get sent to all participants including `self` being referred by `meeting.self`.

Show transcriptions to a participant or for `self`

```
addTranscriptionsListerner({
    meeting: meeting,
    noOfTranscriptionsToCache: 200,
    transcriptionsCallback: (allFormattedTranscriptions) => { console.log(allFormattedTranscriptions); },
})
```

Using `transcriptionsCallback`, populate the transcriptions in your app/website at any desired place.

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
