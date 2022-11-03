export enum CommandOptionTypes {
	SUB_COMMAND,
	SUB_COMMAND_GROUP,
	STRING,
	INTEGER,
	NUMBER,
	BOOLEAN,
	USER,
	CHANNEL,
	MESSAGE,
	ROLE,
	EMOJI,
	DURATION,
	COMMAND,
	MODULE,
	MESSAGE_CONFIG
}

export enum MiddlewareResult {
	BREAK,
	NEXT
}

export enum ReactionRolesMessageMode {
	STANDARD,
	UNIQUE,
	ADD_ONLY,
	REMOVE_ONLY
}

export enum CommandCategory {
	GENERAL = 'general',
	PREFERENCES = 'preferences',
	INFORMATION = 'information',
	MODERATION = 'moderation',
	ROLES = 'roles',
	PRIVATE_ROOMS = 'privateRooms',
	STAFF = 'staff'
}