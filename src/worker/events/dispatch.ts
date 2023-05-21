import {WebSocketShard, WebSocketShardEvents} from '@discordjs/ws';
import {Event, TDispatchEvent} from '../event.js';
import {Worker} from '../worker.js';

export default class DispatchEvent extends Event {
	constructor() {
		super(WebSocketShardEvents.Dispatch);
	}

	protected async run(event: TDispatchEvent): Promise<void> {
		const data = await this.forward(event);
		Worker.logger.debug(`[${this.name}]: ${event.data.t}; ID: ${data.job}; Time: ${Date.now() - data.time}ms`);
	}
}