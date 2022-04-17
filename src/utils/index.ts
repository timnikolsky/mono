import { CommandOptionTypes } from '../enums'
import { ApplicationCommandOptionTypes } from 'discord.js/typings/enums'
import { CommandOption } from '@typings/index'
import { ApplicationCommandOptionData } from 'discord.js'
import MonoGuild from '@base/discord.js/Guild'
import { getTranslatorFunction } from '@utils/localization'

export function getRandomInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min)) + min
}

export function convertOptionType(monoOptionType: any): ApplicationCommandOptionTypes {
	// Discord types
	if(monoOptionType === CommandOptionTypes.SUB_COMMAND)
		return ApplicationCommandOptionTypes.SUB_COMMAND

	if(monoOptionType === CommandOptionTypes.SUB_COMMAND_GROUP)
		return ApplicationCommandOptionTypes.SUB_COMMAND_GROUP

	if(monoOptionType === CommandOptionTypes.STRING)
		return ApplicationCommandOptionTypes.STRING

	if(monoOptionType === CommandOptionTypes.INTEGER)
		return ApplicationCommandOptionTypes.INTEGER

	if(monoOptionType === CommandOptionTypes.NUMBER)
		return ApplicationCommandOptionTypes.NUMBER

	if(monoOptionType === CommandOptionTypes.BOOLEAN)
		return ApplicationCommandOptionTypes.BOOLEAN

	if(monoOptionType === CommandOptionTypes.USER)
		return ApplicationCommandOptionTypes.USER

	if(monoOptionType === CommandOptionTypes.CHANNEL)
		return ApplicationCommandOptionTypes.CHANNEL

	if(monoOptionType === CommandOptionTypes.ROLE)
		return ApplicationCommandOptionTypes.ROLE

	// Custom types

	if(monoOptionType === CommandOptionTypes.MESSAGE)
		return ApplicationCommandOptionTypes.STRING

	if(monoOptionType === CommandOptionTypes.EMOJI) {
		return ApplicationCommandOptionTypes.STRING
	}

	if(monoOptionType === CommandOptionTypes.DURATION)
		return ApplicationCommandOptionTypes.NUMBER

	if(monoOptionType === CommandOptionTypes.COMMAND)
		return ApplicationCommandOptionTypes.STRING

	if(monoOptionType === CommandOptionTypes.MODULE)
		return ApplicationCommandOptionTypes.STRING

	if(monoOptionType === CommandOptionTypes.MESSAGE_CONFIG)
		return ApplicationCommandOptionTypes.STRING

	else throw new Error()
}

export function generateOptions(guild: MonoGuild, optionsRaw: CommandOption[], commandsIds: { rootCommandId: string, subCommandId?: string, subSubCommandId?: string }): ApplicationCommandOptionData[] {
	const t = getTranslatorFunction(guild.language, 'commands')
	// @ts-ignore
	return optionsRaw.map(option => {
		const type = convertOptionType(option.type)

		// Command description
		let description
		if(option.type === CommandOptionTypes.SUB_COMMAND) {
			// Subcommand
			if(!commandsIds.subCommandId) {
				description = t(`${commandsIds.rootCommandId}._data.subcommands.${option.id}.description`)
			} else {
				description = t(`${commandsIds.rootCommandId}._data.subcommands.${commandsIds.subCommandId}.subcommands.${option.id}.description`)
			}
		}
		// Option description
		else {
			// Root command option
			if(!commandsIds.subCommandId && !commandsIds.subSubCommandId) {
				description = t(`${commandsIds.rootCommandId}._data.options.${option.id}.description`)
			}
			// Subcommand option
			else if(commandsIds.subCommandId && !commandsIds.subSubCommandId) {
				description = t(`${commandsIds.rootCommandId}._data.subcommands.${commandsIds.subCommandId}.options.${option.id}.description`)
			}
			// Subsubcommand option
			else {
				description = t(`${commandsIds.rootCommandId}._data.subcommands.${commandsIds.subCommandId}.subcommands.${commandsIds.subSubCommandId}.options.${option.id}.description`)
			}
		}

		if(description.length <= 67) {
			if(option.type === CommandOptionTypes.MODULE) {
				description = `${t('common:optionTypes.module')} | ${description}`
			} else if(option.type === CommandOptionTypes.MESSAGE) {
				description = `${t('common:optionTypes.message')} | ${description}`
			} else if(option.type === CommandOptionTypes.EMOJI) {
				description = `${t('common:optionTypes.emoji')} | ${description}`
			} else if(option.type === CommandOptionTypes.DURATION) {
				description = `${t('common:optionTypes.duration')} | ${description}`
			} else if(option.type === CommandOptionTypes.COMMAND) {
				description = `${t('common:optionTypes.command')} | ${description}`
			} else if(option.type === CommandOptionTypes.MESSAGE_CONFIG) {
				description = `${t('common:optionTypes.messageConfig')} | ${description}`
			}
		}

		return {
			type: type,
			name: option.id,
			// TODO: clean
			description,
			options: option.options ? generateOptions(guild, option.options, {
				rootCommandId: commandsIds.rootCommandId,
				subCommandId: commandsIds.subCommandId ?? option.id,
				subSubCommandId: commandsIds.subCommandId ? option.id : undefined
			}) : [],
			required: !!option.required,
			choices:
				option.type === CommandOptionTypes.MODULE
					? Object.keys(guild.modules).map(moduleId => ({
						// @ts-ignore
						name: t(`modules:${guild.modules[moduleId].id}.name`),
						// @ts-ignore
						value: guild.modules[moduleId].id
					})) : (option.choices?.map(choice => ({
						name: choice.id,
						value: choice.value
					})) || []),
			channelTypes: option.channelTypes || null,
			minValue: option.minValue,
			maxValue: option.maxValue
		}
	})
}
