/**
 * Enum which contains the Email Validation Status
 *
 * NOT_FOUND - Email Address does not exist on the mail server
 * INVALID_SYNTAX - Invalid Email Address
 * BLOCKED_BY_PROVIDER - Call is blocked by the specific mail provider
 * TIMEOUT - Timeout during connect
 * MAY_EXISTS - Email Address might exists
 */
export enum EmailValidationStatus {
  'NOT_FOUND',
  'INVALID_SYNTAX',
  'BLOCKED_BY_PROVIDER',
  'TIMEOUT',
  'MAY_EXISTS',
}
