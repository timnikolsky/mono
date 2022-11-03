import Module from '../base/Module'
import { Snowflake } from 'discord.js'
import MonoGuild from '@base/discord.js/Guild'
import { ChannelNamesConfig } from '@typings/index'
import { DayNightTime } from '../enums'
import Console from '@utils/console'

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

	timeout: NodeJS.Timeout | null

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

		this.channelNames = config.channelNames ?? []

		this.timeout = null
	}

	getCurrentTime(): DayNightTime {
		const now = new Date()
		const nowHour = now.getUTCHours()
		const nowMinute = now.getUTCMinutes()

		// If daytime is before tighttime
		if(this.daytime.hour < this.nighttime.hour || (this.daytime.hour === this.nighttime.hour && this.daytime.minute < this.nighttime.minute)) {
			// If now is between daytime and nighttime
			if((
				nowHour > this.daytime.hour
				|| nowHour === this.daytime.hour && nowMinute >= this.daytime.minute
			) && (
				nowHour < this.nighttime.hour
				|| nowHour === this.nighttime.hour && nowMinute < this.nighttime.minute
			)) {
				return DayNightTime.DAYTIME
			} else return DayNightTime.NIGHTTIME
		}
		// If daytime is after nighttime
		else {
			// If now is between daytime and nighttime
			if((
				nowHour > this.nighttime.hour
				|| nowHour === this.nighttime.hour && nowMinute >= this.nighttime.minute
			) || (
				nowHour < this.daytime.hour
				|| nowHour === this.daytime.hour && nowMinute < this.daytime.minute
			)) {
				return DayNightTime.NIGHTTIME
			} else return DayNightTime.DAYTIME
		}
	}

	startTimeout(): NodeJS.Timeout {
		// Count milliseconds until next day/night
		const now = new Date()
		const nextDay = new Date()
		nextDay.setUTCHours(
			this.daytime.hour,
			this.daytime.minute,
			0, 0
		)
		const nextNight = new Date()
		nextNight.setUTCHours(
			this.nighttime.hour,
			this.nighttime.minute,
			0, 0
		)
	
		// If it's day now, set timeout for night
		if(this.getCurrentTime() === DayNightTime.DAYTIME) {
			// Check whether next night is today, if not, set it to tomorrow
			if(nextNight.getTime() < now.getTime()) {
				nextNight.setDate(nextNight.getDate() + 1)
			}
	
			Console.info(`Setting timeout until nighttime for '${this.guild.name}' (${this.guild.id}), ${Math.floor((nextNight.getTime() - now.getTime()) / 1000)}s left`)
			const timeout = setTimeout(async () => {
				// Change guild icon if needed
				if(this.nighttimeGuildIconUrl) {
					await this.guild.setIcon(this.nighttimeGuildIconUrl)
				}
				this.channelNames.forEach(async (channelName) => {
					const channel = await this.guild.channels.fetch(channelName.id)
					if(!channel) {
						Console.failure(`Couldn't fetch channel (${channelName.id}) version while changing guild '${this.guild.name}' (${this.guild.id}) appearance to nighttime version`)
						return
					}
					if(!channel.permissionsFor(this.guild.members.me!).has('ManageChannels')) {
						Console.failure(`Couldn't change '${channel.name}' (${channel.id}) channel name while changing '${this.guild.name}' (${this.guild.id}) guild appearance to nighttime version, missing permissions`)
						return
					}
					if(channel.name === channelName.nighttimeName) return
					const oldName = channel.name
					await channel.setName(channelName.nighttimeName)
					Console.success(`Changed '${oldName}' (${channel.id}) channel name to '${channelName.nighttimeName}' while changing '${this.guild.name}' (${this.guild.id}) guild appearance to nighttime version`)
				})
				this.startTimeout()
			}, nextNight.getTime() - now.getTime())
			this.timeout = timeout
			return timeout
		} else {
			// Check whether next day is today, if not, set it to tomorrow
			if(nextDay.getTime() < now.getTime()) {
				nextDay.setDate(nextDay.getDate() + 1)
			}
	
			Console.info(`Setting timeout until daytime for '${this.guild.name}' (${this.guild.id}), ${Math.floor((nextDay.getTime() - now.getTime()) / 1000)}s left`)
			const timeout = setTimeout(async () => {
				if(this.daytimeGuildIconUrl) {
					await this.guild.setIcon(this.daytimeGuildIconUrl)
				}
				this.channelNames.forEach(async (channelName) => {
					const channel = await this.guild.channels.fetch(channelName.id)
					if(!channel) {
						Console.failure(`Couldn't fetch channel (${channelName.id}) version while changing guild '${this.guild.name}' (${this.guild.id}) appearance to daytime version`)
						return
					}
					if(!channel.permissionsFor(this.guild.members.me!).has('ManageChannels')) {
						Console.failure(`Couldn't change '${channel.name}' (${channel.id}) channel name while changing '${this.guild.name}' (${this.guild.id}) guild appearance to daytime version, missing permissions`)
						return
					}
					if(channel.name === channelName.daytimeName) return
					const oldName = channel.name
					await channel.setName(channelName.daytimeName)
					Console.success(`Changed '${oldName}' (${channel.id}) channel name to '${channelName.daytimeName}' while changing '${this.guild.name}' (${this.guild.id}) guild appearance to daytime version`)
				})
				this.startTimeout()
			}, nextDay.getTime() - now.getTime())
			this.timeout = timeout
			return timeout
		}
	}

	async setDaytime(hour: number, minute: number) {
		await this.modify({ daytime: { hour, minute } })
		this.daytime = { hour, minute }
		if(this.timeout) {
			clearTimeout(this.timeout)
			this.startTimeout()
		}
	}

	async setNighttime(hour: number, minute: number) {
		await this.modify({ nighttime: { hour, minute } })
		this.nighttime = { hour, minute }
		if(this.timeout) {
			clearTimeout(this.timeout)
			this.startTimeout()
		}
	}

	async setGuildIconsUrls(dayIconUrl: string | null, nightIconUrl: string | null) {
		await this.modify({
			daytimeGuildIconUrl: dayIconUrl,
			nighttimeGuildIconUrl: nightIconUrl
		})
		this.daytimeGuildIconUrl = dayIconUrl
		this.nighttimeGuildIconUrl = nightIconUrl
	}

	async setChannelNames(channeId: Snowflake, daytimeName: string | null, nighttimeName: string | null) {
		if(!daytimeName && !nighttimeName) {
			await this.modify({
				channelNames: this.channelNames.filter((channelName) => channelName.id !== channeId)
			})
			return
		}

		await this.modify({
			channelNames: [
				...this.channelNames.filter((channelName) => channelName.id !== channeId),
				{
					id: channeId,
					daytimeName: daytimeName,
					nighttimeName: nighttimeName
				}
			]
		})

		this.channelNames.push({
			id: channeId,
			daytimeName: daytimeName!,
			nighttimeName: nighttimeName!
		})
	}

	exportConfig(): object {
		return {}
	}
}