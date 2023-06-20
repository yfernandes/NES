// TODO: Find another solution to replace @tokilabs/lang
import { Exception } from "@tokilabs/lang";

/**
 * Base class for domain exceptions
 *
 * No utility here, except that you can differentiate this exceptions
 * from unexpected errors by using instanceof operator.
 *
 */
export class DomainException extends Exception {}
