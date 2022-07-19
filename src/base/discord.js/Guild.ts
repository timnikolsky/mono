import { ApplicationCommandType, ChatInputApplicationCommandData, Guild } from 'discord.js'
import { RawGuildData } from 'discord.js/typings/rawDataTypes'
import Mono from '@base/Mono'
import { TFunction } from 'i18next'
import { generateOptions } from '@utils/index'
import { GuildModules } from '@typings/index'
import Console from '@utils/console'
import { getTranslatorFunction } from '@utils/localization'
import { Command } from '@base/Command'

export default class MonoGuild extends Guild {
	// public modules: { [x: string]: Module }
	client!: Mono
	modules!: GuildModules
	modulesRaw!: object

	private customData: any = null

	constructor(client: Mono, data: RawGuildData) {
		super(client, data)
	}

	public get loaded() {
		return Boolean(this.customData)
	}

	public async fetchCustomData() {
		this.customData = await this.client.database.guild.upsert({
			where: {
				id: this.id
			},
			create: {
				id: this.id
			},
			update: {}
		})
		this.modulesRaw = this.customData.modules
		this.modules = {
			moderation: new this.client.modules.moderation(this, this.customData.modules.moderation),
			// starboard: new this.client.modules.starboard(this, this.customData.modules.starboard),
			roles: new this.client.modules.roles(this, this.customData.modules.roles),
			privateRooms: new this.client.modules.privateRooms(this, this.customData.modules.privateRooms)
		}
		Console.info(`Fetched '${this.name}' guild custom data`)
	}

	public getTranslator(): TFunction {
		return this.client.locales[this.language || 'en']
	}

	public generateCommands(): ChatInputApplicationCommandData[] {
		const t = getTranslatorFunction(this.language)
		let generatedCommands = this.client.commands
			.map((CommandClass) => {
				let command = new CommandClass(this)
				if(command.disabledGlobally) return
				if(command.module && !this.modules[command.module].enabled) return

				return {
					name: command.id,
					description: t(`commands:${command.id}._data.description`),
					type: ApplicationCommandType.ChatInput,
					options: generateOptions(this, command.options, {
						rootCommandId: command.id
					}),
				} as ChatInputApplicationCommandData
			})
		// Remove empty entries from array
		generatedCommands = generatedCommands.filter(Boolean)

		// @ts-expect-error
		return generatedCommands
	}

	public async uploadCommands() {
		try {
			await this.commands.set(this.generateCommands())
			Console.info(`Uploaded slash command to guild '${this.name}'`)
			return true
		} catch(e) {
			Console.error(`Couldn't upload slash commands to guild '${this.name}'`)
			console.log(e)
			return false
		}
	}

	// Custom Data

	public get language(): string {
		return this.customData.language
	}
	public async setLanguage(language: string) {
		this.customData.language = language
		await this.client.database.guild.update({
			where: {
				id: this.id
			},
			data: { language }
		})
	}
}
