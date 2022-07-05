import { injectable, inject } from "inversify";
import { getConnection, getRepository, Repository } from "typeorm";

import { LoggerService } from ".";
import { User } from "../model";
import {
    PaginationRequest,
    ProfileSummariesDataSchema,
    transformToProfileSummarySchema
} from "../schema";

@injectable()
export class SearchService {
    private userRepository: Repository<User>;

    constructor(@inject('LoggerService') private logger: LoggerService) {
        this.userRepository = getRepository(User);
    }

    public async getPopular(payload: PaginationRequest): Promise<ProfileSummariesDataSchema> {
        const filterQuery = getConnection()
            .createQueryBuilder()
            .select('sub_query.*')
            .from((subQuery) => {
                return subQuery
                    .select('user.id', 'user_id')
                    .addSelect('(count(follower.id))::int', 'followers_count')
                    .from(User, 'user')
                    .leftJoin('user.followers', 'follower')
                    .where('user.deletedAt is null')
                    .andWhere('follower.deletedAt is null')
                    .groupBy('user.id')
                    .orderBy('followers_count', 'DESC')
                    .addOrderBy('user.id', 'DESC');
            }, 'sub_query')
            .skip(payload.count * (payload.page - 1))
            .take(payload.count)
            .getQuery();

        const users = await this.userRepository
            .createQueryBuilder('user')
            .innerJoin(`(${filterQuery})`, 'filtered_user', 'filtered_user.user_id = user.id')
            .orderBy('filtered_user.followers_count', 'DESC')
            .addOrderBy('user.id', 'DESC')
            .getMany();

        return { profiles: users.map((u) => transformToProfileSummarySchema(u)) };
    }
}
