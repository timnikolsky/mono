import { CommandOption, MiddlewareContext } from '@typings/index'
import { CommandOptionTypes, MiddlewareResult } from '../enums'
import { CommandInteractionOption, Emoji, GuildTextBasedChannel } from 'discord.js'
import { ErrorEmbed } from '@base/Embed'
import { getTranslatorFunction } from '@utils/localization'
import MonoGuild from '@base/discord.js/Guild'

// TODO: try to make this code less messy

export default async function (context: MiddlewareContext) {
	const options = context.interaction.options
	const { commandOptions } = context

	try {
		for (const discordOption of options.data) {

			if (!['SUB_COMMAND', 'SUB_COMMAND_GROUP'].includes(discordOption.type))
				commandOptions[snakeCaseToCamelCase(discordOption.name)] = await convertOption(context, discordOption)

			if (discordOption.options) {
				for (const discordSubOption of discordOption.options) {
					if (!['SUB_COMMAND', 'SUB_COMMAND_GROUP'].includes(discordSubOption.type))
						commandOptions[snakeCaseToCamelCase(discordSubOption.name)] = await convertOption(context, discordSubOption)

					if (discordSubOption.options) {
						for (const discordSubSubOption of discordSubOption.options) {
							if (!['SUB_COMMAND', 'SUB_COMMAND_GROUP'].includes(discordSubSubOption.type))
								commandOptions[snakeCaseToCamelCase(discordSubSubOption.name)] = await convertOption(context, discordSubSubOption)
						}
					}
				}
			}
		}
	}
	// In case
	catch (e) {
		return MiddlewareResult.BREAK
	}

	return MiddlewareResult.NEXT
}

async function convertOption(context: MiddlewareContext, discordOption: CommandInteractionOption) {
	const t = getTranslatorFunction((context.interaction.guild! as MonoGuild).language)
	// TODO: Refactor
	const customOptionType = (context.command.options.map(option => findCommandOptionObject(discordOption.name, option)).find(entry => Boolean(entry))).type as CommandOptionTypes
	switch (customOptionType) {
		case CommandOptionTypes.USER:
			return discordOption.user
		case CommandOptionTypes.ROLE:
			return discordOption.role
		case CommandOptionTypes.CHANNEL:
			return discordOption.channel
		case CommandOptionTypes.EMOJI:
			if (!/((?<!\\)<:[^:]+:(\d+)>)|\p{Emoji_Presentation}|\p{Extended_Pictographic}/gmu.test(discordOption.value as string)) {
				await context.interaction.reply({ embeds: [new ErrorEmbed(t('common:alertMessages.wrongEmoji'))] })
				throw new Error()
			}
			if (!discordOption.value) return

			let emoji
			// If emoji is standard
			if(/\p{Emoji_Presentation}|\p{Extended_Pictographic}/gmu.test(discordOption.value as string)) {
				// @ts-ignore
				emoji = new Emoji(context.interaction.client, {
					name: (discordOption.value as string).match(/\p{Emoji_Presentation}|\p{Extended_Pictographic}/gmu)![0]
				})
			}
			// If emoji is custom
			else {
				emoji = context.interaction.client.emojis.cache.get((discordOption.value as string).match(/\d+/g)![0])
			}
			if (!emoji) {
				await context.interaction.reply({ embeds: [new ErrorEmbed(t('common:alertMessages.wrongEmoji'))] })
				throw new Error()
			}
			return emoji
		case CommandOptionTypes.MESSAGE:
			if (!/(https:\/\/)?(canary\.)?discord(app)?.com\/channels\/\d{18,19}\/\d{18,19}\/\d{18,19}/.test(discordOption.value as string)) {
				await context.interaction.reply({ embeds: [new ErrorEmbed('Use message link')] })
				throw new Error()
			}
			const channel = (await context.interaction.client.channels.fetch((discordOption.value as string).match(/\d{18,19}/g)![1])) as GuildTextBasedChannel
			const message = await channel?.messages.fetch((discordOption.value as string).match(/\d{18,19}/g)![2])
			if (!channel || !message) {
				await context.interaction.reply({ embeds: [new ErrorEmbed('Unable to find that message')] })
				throw new Error()
			}
			return message
		default:
			return discordOption.value
	}
}

function findCommandOptionObject(id: string, currentNode: CommandOption): any {
	let i, currentChild, result

	if (id === currentNode.id) {
		return currentNode
	} else {
		for (i = 0; currentNode.options && i < currentNode.options.length; i += 1) {
			currentChild = currentNode.options[i]

			// Search in the current child
			result = findCommandOptionObject(id, currentChild)

			if (result) {
				return result;
			}
		}

		// The node has not been found, and we have no more options
		return false
	}
}

function snakeCaseToCamelCase(str: string) {
	return str.toLowerCase().replace(
		/([-_][a-z])/g,
		group => group
			.toUpperCase()
			.replace('-', '')
	)
}
