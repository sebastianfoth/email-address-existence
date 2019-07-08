import { EmailAddressExistenceOptions } from '../interfaces';
import { EmailValidationStatus } from '../enums';
import { promisify } from 'util';

export class EmailAddressExistenceService {
  private dns = require('dns');
  private net = require('net');

  /**
   * Tries to validate if the specific email address exists on the specified mail server
   *
   * @param options EmailAddressExistenceOptions
   */
  public async validate(options: EmailAddressExistenceOptions): Promise<EmailValidationStatus> {
    const domain = this.extractDomain(options.recipient);
    const relevantMailServer = await this.getRelevantMailServer(domain);
    return await this.doesMailAddressExistAtMailServer(relevantMailServer, options);
  }

  /**
   * Extracts the Domain of a given Email Address
   * @TODO Testable util method
   *
   * @param recipient
   */
  private extractDomain(recipient: string) {
    const split = recipient.split('@');
    return split[split.length - 1];
  }

  /**
   * Resolves the MX entries of the identified server and returns the relevant mail server
   *
   * @param domain
   */
  private async getRelevantMailServer(domain: string) {
    const resolveMx = promisify(this.dns.resolveMx);
    const addressesMx = await resolveMx(domain);

    const sortedAddressesMx = addressesMx.sort((a, b) => a.priority - b.priority);
    return sortedAddressesMx[0].exchange;
  }

  /**
   * Returns if the Email Address is registered at the relevant mail server.
   *
   * @param exchange
   * @param options
   */
  private async doesMailAddressExistAtMailServer(exchange: string, options: EmailAddressExistenceOptions): Promise<EmailValidationStatus> {
    return new Promise((resolve, reject) => {
      const TELNET_PORT = 25;
      const EOL = '\r\n';

      const conn = this.net.createConnection(TELNET_PORT, exchange);
      conn.setTimeout(options.timeout != null ? options.timeout : 5000);
      conn.on('error', (error) => reject(error));
      conn.on('timeout', () => reject(EmailValidationStatus.TIMEOUT));
      conn.on('connect', () => {

        conn.write('HELO hi' + EOL);
        conn.write(`MAIL FROM: <${options.sender}>` + EOL);
        conn.write(`RCPT TO: <${options.recipient}>` + EOL);
        conn.write('QUIT' + EOL);

        /* */
        conn.on('data', data => {

          const response = data.toString().trim();
          if (options.debug) {
            console.log('Line', response);
          }

          const lines = response.split(EOL);

          for (const line of lines) {
            /* */
            if (line.trim().startsWith('550')) {
              return resolve(EmailValidationStatus.NOT_FOUND);
            }

            /* */
            if (line.trim().startsWith('553')) {
              return resolve(EmailValidationStatus.INVALID_SYNTAX);
            }

            /* */
            if (line.trim().startsWith('554')) {
              return resolve(EmailValidationStatus.BLOCKED_BY_PROVIDER);
            }
          }

        });

        /* */
        conn.on('end', () => resolve(EmailValidationStatus.MAY_EXISTS));

      });
    });
  }

}
