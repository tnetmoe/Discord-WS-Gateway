import {WebSocketShardEvents} from '@discordjs/ws';
import {Event, TEvent} from '../event.js';
import {Worker} from '../worker.js';

export default class ResumedEvent extends Event {
	constructor() {
		super(WebSocketShardEvents.Resumed);
	}

	protected async run(event: TEvent): Promise<void> {
		Worker.logger.info(this.name, event);
	}
}