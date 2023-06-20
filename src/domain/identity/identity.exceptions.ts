export class InvalidIdentityValueException extends Error {
	constructor(value: string, identityTypeName: string) {
		super(
			`The value '${value}' isn't valid for creating an identity of type ${identityTypeName}`
		);
	}
}
