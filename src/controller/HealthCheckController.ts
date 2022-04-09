import { interfaces, controller, httpGet, httpPost, requestBody } from 'inversify-express-utils';
import { ApiOperationGet, ApiOperationPost, ApiPath } from 'swagger-express-ts';

@ApiPath({
    path: "/health-check",
    name: "Health-check",
    security: { 'Api-Key': [] }
})
@controller('/health-check')
export class HealthCheckController implements interfaces.Controller {
    @ApiOperationGet({
        path: '/get',
        responses: {},
    })
    @httpGet('/get')
    private async getCheck(): Promise<object> {
        return { status: 'OK' };
    }

    @ApiOperationPost({
        path: '/post',
        parameters: {},
        responses: {}
    })
    @httpPost('/post')
    private async postCheck(@requestBody() body: any): Promise<object> {
        return {
            status: 'OK',
            body
        };
    }
}
