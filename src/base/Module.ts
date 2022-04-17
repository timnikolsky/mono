import { ModuleData } from '@typings/index'
import Mono from '@base/Mono'
import MonoGuild from '@base/discord.js/Guild'
import merge from 'deepmerge'
import Console from '@utils/console'
import chalk from 'chalk'

export default class Module {
	id!: string
	client: Mono
	guild!: MonoGuild
	enabledDefault: boolean

	enabled!: boolean

	constructor(guild: MonoGuild, moduleData: ModuleData) {
		this.guild = guild
		this.client = guild.client
		this.enabledDefault = moduleData.enabledDefault
	}

	// Created just for typing
	exportConfig(): object {
		return {}
	}

	async modify(input: object) {
		const guildModulesConfig = this.guild.modulesRaw
		const result = merge(guildModulesConfig, { [this.id]: input })
		await this.client.database.guild.update({
			data: {
				// @ts-ignore
				modules: result
			},
			where: {
				id: this.guild.id
			}
		})
	}

	async setEnabled(enabled: boolean): Promise<void> {
		await this.modify({ enabled })
		this.enabled = enabled
		Console.info(`${chalk.bold(this.id.charAt(0).toUpperCase() + this.id.slice(1))} module has been ${enabled ? 'enabled' : 'disabled'} in guild ${chalk.bold(this.guild.name)} (${this.guild.id})`)
	}
}
