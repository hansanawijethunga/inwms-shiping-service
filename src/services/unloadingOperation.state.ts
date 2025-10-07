// State pattern for UnloadingOperation status transitions
import { UnloadingOperationModel } from '../repositories/unloadingOperation.model.js';
import type { UnloadingOperationDoc } from '../repositories/unloadingOperation.model.js';

export type UnloadingOperationStatus = 'Initialized' | 'Started' | 'Completed';

abstract class UnloadingOperationState {
  abstract handle(operation: UnloadingOperationDoc): Promise<{ updated: boolean; message: string }>
}

class InitializedState extends UnloadingOperationState {
  async handle(operation: UnloadingOperationDoc) {
    operation.startTime = new Date().toISOString();
    operation.status = 'Started';
    await operation.save();
    return { updated: true, message: 'Operation started.' };
  }
}

class StartedState extends UnloadingOperationState {
  async handle(operation: UnloadingOperationDoc) {
    operation.endTime = new Date().toISOString();
    operation.status = 'Completed';
    await operation.save();
    return { updated: true, message: 'Operation completed.' };
  }
}

class CompletedState extends UnloadingOperationState {
  async handle(operation: UnloadingOperationDoc) {
    return { updated: false, message: 'Cannot start an already finished operation.' };
  }
}

export class UnloadingOperationStateContext {
  private state: UnloadingOperationState;

  constructor(status: UnloadingOperationStatus) {
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

  async request(operation: UnloadingOperationDoc) {
    return await this.state.handle(operation);
  }
}
