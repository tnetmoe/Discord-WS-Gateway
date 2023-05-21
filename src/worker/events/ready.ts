import {WebSocketShardEvents} from '@discordjs/ws';
import {Event, TReadyEvent} from '../event.js';
import {Worker} from '../worker.js';

export default class ReadyEvent extends Event {
	constructor() {
		super(WebSocketShardEvents.Ready);
	}

	protected async run(event: TReadyEvent): Promise<void> {
		Worker.logger.info(`[${this.name}]:
		User: ${event.data.user.username}#${event.data.user.discriminator} (${event.data.user.id})
		SessionID: "${event.data.session_id}"
		Gateway: "${event.data.resume_gateway_url}"
		Guilds: ${event.data.guilds.length}`);
	}
}