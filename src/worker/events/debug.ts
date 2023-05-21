import {WebSocketShardEvents} from '@discordjs/ws';
import {Event, TDebugEvent} from '../event.js';
import {Worker} from '../worker.js';

export default class DebugEvent extends Event {
	constructor() {
		super(WebSocketShardEvents.Debug);
	}

	protected async run(event: TDebugEvent): Promise<void> {
		Worker.logger.debug(`[${this.name}]: ${event.message}`);
	}
}