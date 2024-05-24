/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpRequest } from './core/BaseHttpRequest';
import type { OpenAPIConfig } from './core/OpenAPI';
import { FetchHttpRequest } from './core/FetchHttpRequest';
import { AuthService } from './services/AuthService';
import { CodeService } from './services/CodeService';
import { EmailService } from './services/EmailService';
import { MgmtService } from './services/MgmtService';
import { PasskeysService } from './services/PasskeysService';
import { PhoneService } from './services/PhoneService';
import { RegService } from './services/RegService';
import { TxService } from './services/TxService';
import { VersionService } from './services/VersionService';
type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;
export class LoginIDService {
    public readonly auth: AuthService;
    public readonly code: CodeService;
    public readonly email: EmailService;
    public readonly mgmt: MgmtService;
    public readonly passkeys: PasskeysService;
    public readonly phone: PhoneService;
    public readonly reg: RegService;
    public readonly tx: TxService;
    public readonly version: VersionService;
    public readonly request: BaseHttpRequest;
    constructor(config?: Partial<OpenAPIConfig>, HttpRequest: HttpRequestConstructor = FetchHttpRequest) {
        this.request = new HttpRequest({
            BASE: config?.BASE ?? 'https://api.loginid.io/fido2/v2',
            VERSION: config?.VERSION ?? '2.0',
            WITH_CREDENTIALS: config?.WITH_CREDENTIALS ?? false,
            CREDENTIALS: config?.CREDENTIALS ?? 'include',
            TOKEN: config?.TOKEN,
            USERNAME: config?.USERNAME,
            PASSWORD: config?.PASSWORD,
            HEADERS: config?.HEADERS,
            ENCODE_PATH: config?.ENCODE_PATH,
        });
        this.auth = new AuthService(this.request);
        this.code = new CodeService(this.request);
        this.email = new EmailService(this.request);
        this.mgmt = new MgmtService(this.request);
        this.passkeys = new PasskeysService(this.request);
        this.phone = new PhoneService(this.request);
        this.reg = new RegService(this.request);
        this.tx = new TxService(this.request);
        this.version = new VersionService(this.request);
    }
}

