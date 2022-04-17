import Module from '../base/Module'
import { Snowflake } from 'discord.js'
import MonoGuild from '@base/discord.js/Guild'

export default class PrivateRoomsModule extends Module {
	id = 'privateRooms'

	joinChannelId: Snowflake | null
	defaults: PrivateRoomsDefaults

	constructor(guild: MonoGuild, config: any = {}) {
		super(guild, {
			enabledDefault: false
		})

		this.enabled = config.enabled ?? this.enabledDefault

		this.joinChannelId = config.joinChannelId ?? null

		this.defaults = config.defaults || {
			name: '{{username}}',
			limit: 0,
			hidden: false,
			locked: false
		}
		this.defaults.name = config.defaults?.name ?? '{{username}}'
		this.defaults.limit = config.defaults?.limit ?? 0
		this.defaults.hidden = config.defaults?.hidden ?? false
		this.defaults.locked = config.defaults?.locked ?? false
	}

	async setJoinChannelId(channelId: Snowflake) {
		await this.modify({ joinChannelId: channelId })
		this.joinChannelId = channelId
	}

	async setDefaultName(name: string) {
		await this.modify({ defaults: { name } })
		this.defaults.name = name
	}

	async setDefaultLimit(limit: number) {
		await this.modify({ defaults: { limit } })
		this.defaults.limit = limit
	}

	async setDefaultHidden(hidden: boolean) {
		await this.modify({ defaults: { hidden } })
		this.defaults.hidden = hidden
	}

	async setDefaultLocked(locked: boolean) {
		await this.modify({ defaults: { locked } })
		this.defaults.locked = locked
	}

	exportConfig(): object {
		return {}
	}
}

interface PrivateRoomsDefaults {
	name: string,
	limit: number,
	hidden: boolean,
	locked: boolean
}
