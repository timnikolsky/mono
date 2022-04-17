import Module from '../base/Module'
import { Snowflake } from 'discord.js'
import MonoGuild from '@base/discord.js/Guild'

export default class ModerationModule extends Module {
	id = 'moderation'

	muteRole?: Snowflake | null

	constructor(guild: MonoGuild, config: any = {}) {
		super(guild, {
			enabledDefault: true
		})

		this.enabled = config.enabled ?? this.enabledDefault

		this.muteRole = null
	}

	exportConfig(): object {
		return {}
	}
}
