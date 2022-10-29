import Module from '../base/Module'
import { Snowflake } from 'discord.js'
import MonoGuild from '@base/discord.js/Guild'
import { ChannelNamesConfig } from '@typings/index'

export default class DayNightModule extends Module {
	id = 'dayNight'

	daytime: {
		hour: number
		minute: number
	}
	nighttime: {
		hour: number
		minute: number
	}

	daytimeGuildIconUrl: string | null
	nighttimeGuildIconUrl: string | null

	channelNames: ChannelNamesConfig[]

	constructor(guild: MonoGuild, config: any = {}) {
		super(guild, {
			enabledDefault: false
		})

		this.enabled = config.enabled ?? this.enabledDefault

		this.daytime = config.daytime ?? {
			hour: 10,
			minute: 0
		}
		this.nighttime = config.nighttime ?? {
			hour: 22,
			minute: 0
		}

		this.daytimeGuildIconUrl = config.daytimeGuildIconUrl ?? this.guild.iconURL({
			extension: 'png',
			size: 4096,
		})
		this.nighttimeGuildIconUrl = config.nighttimeGuildIconUrl ?? this.guild.iconURL({
			extension: 'png',
			size: 4096,
		})

		this.channelNames = config.channelNames ?? {}
	}

	async setDaytime(hour: number, minute: number) {
		await this.modify({ daytime: { hour, minute } })
		this.daytime = { hour, minute }
	}

	async setNighttime(hour: number, minute: number) {
		await this.modify({ nighttime: { hour, minute } })
		this.nighttime = { hour, minute }
	}

	async setDaytimeGuildIconUrl(url: string) {
		await this.modify({ daytimeGuildIconUrl: url })
		this.daytimeGuildIconUrl = url
	}

	async setNighttimeGuildIconUrl(url: string) {
		await this.modify({ nighttimeGuildIconUrl: url })
		this.nighttimeGuildIconUrl = url
	}

	async setChannelNames(channeId: Snowflake, daytimeName: string | null, nighttimeName: string | null) {
		if(daytimeName === null && nighttimeName === null) {
			await this.modify({
				channelNames: {
					[channeId]: {
						daytime: undefined,
						nighttime: undefined
					}
				}
			})
			return
		}

		await this.modify({
			channelNames: [
				...this.channelNames,
				{
					id: channeId,
					daytime: daytimeName,
					nighttime: nighttimeName
				}
			]
		})
	}

	exportConfig(): object {
		return {}
	}
}
