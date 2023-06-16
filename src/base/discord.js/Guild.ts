import { ApplicationCommandType, ChatInputApplicationCommandData, Guild, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import { RawGuildData } from 'discord.js/typings/rawDataTypes'
import Mono from '@base/Mono'
import { TFunction } from 'i18next'
import { generateOptions } from '@utils/index'
import { GuildModules, MonoCommand } from '@typings/index'
import Console from '@utils/console'
import { getTranslatorFunction } from '@utils/localization'
import { Command } from '@base/Command'
import { dayNight } from '@modules/index'

export default class MonoGuild extends Guild {
	client!: Mono
	modules!: GuildModules
	modulesRaw!: object
	initializedCommands?: MonoCommand[]

	areCommandsGenerated = false
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
			privateRooms: new this.client.modules.privateRooms(this, this.customData.modules.privateRooms),
			dayNight: new this.client.modules.dayNight(this, this.customData.modules.dayNight)
		}
		Console.info(`Fetched '${this.name}' guild custom data`)
	}

	public getTranslator(): TFunction {
		return this.client.locales[this.language || 'en']
	}

	public generateCommands(): ChatInputApplicationCommandData[] {
		const t = getTranslatorFunction(this.language)

		this.initializedCommands = this.client.commands
			.map(command => new command(this))
			.filter(command => !command.disabledGlobally && (!command.module || this.modules[command.module].enabled))

		let generatedCommands = this.initializedCommands
			.map((command) => {
				return <ChatInputApplicationCommandData>{
					name: command.id,
					description: t(`commands:${command.id}._data.description`),
					type: ApplicationCommandType.ChatInput,
					options: generateOptions(this, command.options, {
						rootCommandId: command.id
					}),
					defaultMemberPermissions: command.userPermissionsRequired?.reduce((acc, permission) => {
						return acc | permission
					}).toString()
				}
			})
		// Remove empty entries from array
		generatedCommands = generatedCommands.filter(Boolean)
    
		this.areCommandsGenerated = true

		return generatedCommands
	}

	// Throw an error instead of returning boolean
	public async uploadCommands() {
		try {
			const generatedCommands = this.generateCommands()

			// For some reason, our Discord.js doesn't allow us to set defaultMemberPermissions field, so we have to do it manually
			await this.client.rest.put(`/applications/${this.client.user!.id}/guilds/${this.id}/commands`, {
				body: generatedCommands.map(command => ({
					name: command.name,
					description: command.description,
					type: command.type,
					options: command.options,
					// @ts-expect-error
					default_member_permissions: command.defaultMemberPermissions
				})),
				headers: {
					'Authorization': `Bot ${process.env.DISCORD_TOKEN}`
				}
			})
			Console.info(`Uploaded slash command to guild '${this.name}'`)
			return true
		} catch(e) {
			Console.error(`Couldn't upload slash commands to guild '${this.name}'`)
			console.log(e)
			return false
		}
	}

	public get isDev(): boolean {
		return this.client.config.devGuildsIds.includes(this.id)
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
