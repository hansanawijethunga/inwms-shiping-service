// State pattern for LoadingOperation status transitions
import { LoadingOperationModel } from '../repositories/loadingOperation.model.js';
import type { LoadingOperationDoc } from '../repositories/loadingOperation.model.js';

export type LoadingOperationStatus = 'Initialized' | 'Started' | 'Completed';

abstract class LoadingOperationState {
  abstract handle(operation: LoadingOperationDoc): Promise<{ updated: boolean; message: string }>
}

class InitializedState extends LoadingOperationState {
  async handle(operation: LoadingOperationDoc) {
    operation.startTime = new Date().toISOString();
    operation.status = 'Started';
    await operation.save();
    return { updated: true, message: 'Operation started.' };
  }
}

class StartedState extends LoadingOperationState {
  async handle(operation: LoadingOperationDoc) {
    operation.endTime = new Date().toISOString();
    operation.status = 'Completed';
    await operation.save();
    return { updated: true, message: 'Operation completed.' };
  }
}

class CompletedState extends LoadingOperationState {
  async handle(operation: LoadingOperationDoc) {
    return { updated: false, message: 'Cannot start an already finished operation.' };
  }
}

export class LoadingOperationStateContext {
  private state: LoadingOperationState;

  constructor(status: LoadingOperationStatus) {
    switch (status) {
      case 'Initialized':
        this.state = new InitializedState();
        break;
      case 'Started':
        this.state = new StartedState();
        break;
      case 'Completed':
      default:
        this.state = new CompletedState();
        break;
    }
  }

  async request(operation: LoadingOperationDoc) {
    return await this.state.handle(operation);
  }
}
