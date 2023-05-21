import {WebSocketShardEvents} from '@discordjs/ws';
import {Event, THeartbeatEvent} from '../event.js';
import {Worker} from '../worker.js';

export default class HeartbeatCompleteEvent extends Event {
	constructor() {
		super(WebSocketShardEvents.HeartbeatComplete);
	}

	protected async run(event: THeartbeatEvent): Promise<void> {
		Worker.logger.debug(`[${this.name}] AckAt: ${event.ackAt}; heartbeatAt: ${event.heartbeatAt}; latency: ${event.latency}`);
	}
}