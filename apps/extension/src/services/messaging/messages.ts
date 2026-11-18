import { CandidateProfile } from '../../core/schema';
import { JobDetails, FillResult } from '../../adapters';
import { GenerateAnswerInput, GenerateAnswerResult, ProviderStatus } from '../ai/aiService';

export type ExtensionMessage =
  | { type: 'PING' }
  | { type: 'GET_PAGE_STATUS' }
  | {
      type: 'PAGE_STATUS_RESPONSE';
      payload: {
        isSupported: boolean;
        atsPlatform: string;
        jobDetails: JobDetails;
        fieldsCount: number;
      };
    }
  | {
      type: 'EXECUTE_AUTOFILL';
      payload: {
        profile: CandidateProfile;
        overwrite: boolean;
      };
    }
  | {
      type: 'AUTOFILL_RESPONSE';
      payload: FillResult;
    }
  | {
      type: 'GENERATE_AI_ANSWER';
      payload: GenerateAnswerInput;
    }
  | {
      type: 'TEST_AI_CONNECTION';
    }
  | {
      type: 'AI_CONNECTION_RESPONSE';
      payload: ProviderStatus;
    }
  | {
      type: 'INSERT_ANSWER_TO_FIELD';
      payload: {
        fieldId: string;
        answer: string;
      };
    };

export async function sendTabMessage<T = any>(tabId: number, message: ExtensionMessage): Promise<T> {
  return chrome.tabs.sendMessage(tabId, message);
}

export async function sendRuntimeMessage<T = any>(message: ExtensionMessage): Promise<T> {
  return chrome.runtime.sendMessage(message);
}
