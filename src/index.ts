import * as TranscriptionListenerHelpers from './transcripts_listener';
import * as bhasaTranscriptionsHelpers from './bhasa_transcriptions';
import * as BuildingBlockHelpers from './transcriptions_building_blocks';
import {
    ActivateTranscriptionsConfig,
    DeactivateTranscriptionsConfig,
    AddTranscriptionsListenerConfig,
    RemoveTranscriptionsListenerConfig,
} from './param_types';

async function activateTranscriptions(param: ActivateTranscriptionsConfig) {
    if (!param?.meeting?.self) {
        throw new Error('arguments[0].meeting.self is not available. Did you miss calling new DyteClient first?');
    }
    if (!param?.bhasaAccessToken) {
        throw new Error('Missing arguments[0].bhasaAccessToken. We need bhasa access token to retrive conversations and to generate transcriptions');
    }
    return bhasaTranscriptionsHelpers.activateTranscriptions(param);
}

async function deactivateTranscriptions(param: DeactivateTranscriptionsConfig) {
    if (!param.meeting?.self) {
        throw new Error('arguments[0].meeting.self is not available. Did you miss calling new DyteClient first?');
    }
    return bhasaTranscriptionsHelpers.deactivateTranscriptions(param);
}

async function addTranscriptionsListerner(param: AddTranscriptionsListenerConfig) {
    if (!param?.meeting?.self) {
        throw new Error('arguments[0].meeting.self is not available. Did you miss calling new DyteClient first?');
    }
    if (!param?.transcriptionsCallback) {
        throw new Error('arguments[0].transcriptionsCallback is not missing. Please provide transcriptionsCallback.');
    }
    return TranscriptionListenerHelpers.addTranscriptionsListener(param);
}

async function removeTranscriptionsListener(param: RemoveTranscriptionsListenerConfig) {
    if (!param.meeting?.self) {
        throw new Error('arguments[0].meeting.self is not available. Did you miss calling new DyteClient first?');
    }
    return TranscriptionListenerHelpers.removeTranscriptionsListener(param);
}

function getTranscriptions() {
    return BuildingBlockHelpers.getTranscriptions();
}

export {
    activateTranscriptions,
    deactivateTranscriptions,
    addTranscriptionsListerner,
    removeTranscriptionsListener,
    getTranscriptions,
};
