import { inject, injectable } from "inversify";
import { LoggerService } from "./LoggerService";

const AWS = require('aws-sdk');

@injectable()
export class StorageService {
    aws: any;

    constructor(@inject('LoggerService') private logger: LoggerService) {
        this.aws = new AWS.S3({
            endpoint: process.env.YANDEX_STORAGE_URL,
            accessKeyId: process.env.YANDEX_STORAGE_ACCESS,
            secretAccessKey: process.env.YANDEX_STORAGE_SECRET,
            httpOptions: {
                timeout: 10000,
                connectTimeout: 10000
            },
        });
    }

    public async upload(filename: string, mimetype: string, body: string | Buffer): Promise<string> {
        try {
            // const params = {
            //     Bucket: 'jdl-bucket',
            //     Key: `game/${new Date().getTime()}-${filename}`,
            //     Body: body,
            //     ContentType: mimetype,
            // };

            // const startDate = new Date().getTime();

            // const result: any = await new Promise((resolve, reject) => {
            //     this.aws.upload(params, (err: any, data: any) => {
            //         if (err) {
            //             return reject(err);
            //         }

            //         return resolve(data);
            //     });
            // });

            // const endDate = new Date().getTime();

            // this.logger.info(`Uploaded file ${filename}, took ${(endDate - startDate) / 1000} seconds`);

            // return result.Location;

            return 'https://this-is-your-future-attachment_url';
        } catch (err) {
            this.logger.error(err);

            throw err;
        }
    }
}
