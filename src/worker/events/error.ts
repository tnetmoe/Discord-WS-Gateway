import {WebSocketShardEvents} from '@discordjs/ws';
import {Event, TErrorEvent} from '../event.js';
import {Worker} from '../worker.js';

export default class ErrorEvent extends Event {
	constructor() {
		super(WebSocketShardEvents.Error);
	}

	protected async run(event: TErrorEvent): Promise<void> {
		Worker.logger.error({event: this.name, error: event.error});
	}
}