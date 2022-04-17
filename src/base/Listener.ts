import Mono from '@base/Mono'
import { ClientEvents } from 'discord.js'

type K = keyof ClientEvents

export interface RunFunction {
	(client: Mono, ...args: any): Promise<void>
}

export default class Listener {
	public event: K
	public run: RunFunction
	public once?: boolean

	constructor(event: K, runFunction: RunFunction, once?: boolean) {
		this.event = event
		this.run = runFunction
		this.once = once
	}
}
