import { CommandOption, MiddlewareContext } from '@typings/index'
import { CommandOptionTypes, MiddlewareResult } from '../enums'
import { ApplicationCommandOptionType, CommandInteractionOption, Emoji, GuildTextBasedChannel } from 'discord.js'
import { ErrorEmbed } from '@base/Embed'
import { getTranslatorFunction } from '@utils/localization'
import MonoGuild from '@base/discord.js/Guild'

const surrogateEmojiRegex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?(?:\u200d(?:[^\ud800-\udfff]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?)*/g

// TODO: try to make this code less messy

export default async function (context: MiddlewareContext) {
	const options = context.interaction.options
	const { commandOptions } = context

	try {
		for (const discordOption of options.data) {
			if (![ApplicationCommandOptionType.Subcommand, ApplicationCommandOptionType.SubcommandGroup].includes(discordOption.type))
				commandOptions[snakeCaseToCamelCase(discordOption.name)] = await convertOption(context, discordOption)

			if (discordOption.options) {
				for (const discordSubOption of discordOption.options) {
					if (![ApplicationCommandOptionType.Subcommand, ApplicationCommandOptionType.SubcommandGroup].includes(discordSubOption.type))
						commandOptions[snakeCaseToCamelCase(discordSubOption.name)] = await convertOption(context, discordSubOption)

					if (discordSubOption.options) {
						for (const discordSubSubOption of discordSubOption.options) {
							if (![ApplicationCommandOptionType.Subcommand, ApplicationCommandOptionType.SubcommandGroup].includes(discordSubSubOption.type))
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
				// @ts-expect-error
				emoji = new Emoji(context.interaction.client, {
					name: (discordOption.value as string).match(surrogateEmojiRegex)![0]
				})
			}
			// If emoji is custom
			else {
				const optionNumbers = (discordOption.value as string).match(/\d+/g) ?? ['1']
				emoji = context.interaction.client.emojis.cache.get(optionNumbers[optionNumbers.length - 1])
			}
			if (!emoji) {
				await context.interaction.reply({ embeds: [new ErrorEmbed(t('common:alertMessages.wrongEmoji'))] })
				throw new Error()
			}
			return emoji
		case CommandOptionTypes.MESSAGE:
			if (!/(https:\/\/)?(canary\.)?discord(app)?.com\/channels\/\d{18,19}\/\d{18,19}\/\d{18,19}/.test(discordOption.value as string)) {
				await context.interaction.reply({ embeds: [new ErrorEmbed(t('common:alertMessages.useMessageLink'))] })
				throw new Error()
			}
			const channel = (await context.interaction.client.channels.fetch((discordOption.value as string).match(/\d{18,19}/g)![1])) as GuildTextBasedChannel
			const message = await channel?.messages.fetch((discordOption.value as string).match(/\d{18,19}/g)![2])
			if (!channel || !message) {
				await context.interaction.reply({ embeds: [new ErrorEmbed(t('common:alertMessages.messageNotFound'))] })
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
