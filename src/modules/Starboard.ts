import Module from '../base/Module'
import { Snowflake } from 'discord.js'
import MonoGuild from '@base/discord.js/Guild'

enum StarboardReactionRequirementType {
	USERS,
	PERCENT
}

export default class StarboardModule extends Module {
	id = 'starboard'

	channelId: Snowflake | null
	emojiId: Snowflake | string
	reactionRequirement: number = 10
	reactionRequirementMeasurement: StarboardReactionRequirementType = StarboardReactionRequirementType.USERS

	constructor(guild: MonoGuild, config: any = {}) {
		super(guild, {
			enabledDefault: true
		})

		this.enabled = config.enabled ?? this.enabledDefault

		this.channelId = config.channelId || null
		this.emojiId = config.emojiId || '⭐'
		this.reactionRequirement = config.reactionRequirement || 10
		this.reactionRequirementMeasurement = StarboardReactionRequirementType.USERS
	}

	setChannel(channelId: Snowflake | null) {
		this.channelId = channelId
	}

	exportConfig(): object {
		return {
			channelId: this.channelId,
			emojiId: this.emojiId,
			reactionRequirement: this.reactionRequirement,
			reactionRequirementMeasurement: this.reactionRequirementMeasurement
		}
	}
}
