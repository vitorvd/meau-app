import mitt, { Handler } from 'mitt';

export enum EventTypes {
  CREATED_USER = 'user:created'
}

export class EventBus {
  private static eventBus: EventBus;
  private emitter;

  constructor(){
    this.emitter = mitt();
  }

  public static getEventBus() {
    if(EventBus.eventBus) {
      return EventBus.eventBus
    }

    EventBus.eventBus = new EventBus();
    return EventBus.eventBus;
  }

  public emit(event: EventTypes, data: any) {
    this.emitter.emit(event, data);
  }

  public listen(event: EventTypes, handler: Handler) {
    this.emitter.on(event, handler);

    return () => this.emitter.off(event, handler);
  }
}