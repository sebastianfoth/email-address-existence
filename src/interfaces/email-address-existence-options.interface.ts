export interface EmailAddressExistenceOptions {
    sender: string;
    recipient: string;
    timeout: number;
    portTelnet?: number;
    debug?: boolean;
}
