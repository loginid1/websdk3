/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpRequest } from './core/BaseHttpRequest';
import type { OpenAPIConfig } from './core/OpenAPI';
import { FetchHttpRequest } from './core/FetchHttpRequest';
import { AuthService } from './services/AuthService';
import { PasskeysService } from './services/PasskeysService';
import { RegService } from './services/RegService';
import { TxService } from './services/TxService';
type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;
export class LoginIDService {
    public readonly auth: AuthService;
    public readonly passkeys: PasskeysService;
    public readonly reg: RegService;
    public readonly tx: TxService;
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
        this.passkeys = new PasskeysService(this.request);
        this.reg = new RegService(this.request);
        this.tx = new TxService(this.request);
    }
}

