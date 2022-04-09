import { interfaces, controller, httpGet, httpPost, requestBody } from 'inversify-express-utils';

@controller('/health-check')
export class HealthCheckController implements interfaces.Controller {
    @httpGet('/get')
    private async getCheck(): Promise<object> {
        return { status: 'OK' };
    }

    @httpPost('/post')
    private async postCheck(@requestBody() body: any): Promise<object> {
        return {
            status: 'OK',
            body
        };
    }

    @httpGet('/get-error')
    private async getError(): Promise<object> {
        throw new Error("Expected error");
    }
}
