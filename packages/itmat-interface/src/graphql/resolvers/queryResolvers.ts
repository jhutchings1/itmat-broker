import { IQueryEntry } from 'itmat-commons/dist/models/query';
import { queryCore } from '../core/queryCore';
import uuid from 'uuid/v4';
import { Models } from 'itmat-commons';
import { db } from '../../database/database';
import { ApolloError } from 'apollo-server-core';
import { errorCodes } from '../errors';
import { parseQueryStringIntoTree, checkAndSanitiseQuery } from '../../utils/queryUtils';


export const queryResolvers = {
    Query: {
        // getQueries: async(parent: object, args: { studyId: string, projectId: string }, context: any, info: any): Promise<IQueryEntry[]> => {

        // },

        getQueryById: async (parent: object, args: { queryId: string }, context: any, info: any): Promise<IQueryEntry> => {
            const queryId = args.queryId;
            /* check permission */

            /* check if the client wants the result */
            const entry = await queryCore.getOneQuery_throwErrorIfNotExists(queryId, false);
            return entry;


        }
    },
    Mutation: {
        createQuery: async(parent: object, args: { queryString: string, returnFieldSelection?: string[], studyId: string, projectId?: string }, context: any, info: any): Promise<IQueryEntry> => {
            const requester: Models.UserModels.IUser = context.req.user;

            /* check privileges */


            const { error: parsingError, parsedInput } = parseQueryStringIntoTree(args.queryString);
            if (parsingError !== undefined) {
                throw new ApolloError(errorCodes.CLIENT_MALFORMED_INPUT);
            }

            const queryError = checkAndSanitiseQuery(parsedInput);

            const job: IQueryEntry = {
                id: uuid(),
                jobType: 'QUERY',
                studyId: args.studyId,
                requester: requester.id,
                requestTime: new Date().valueOf(),
                receivedFiles: [],
                error: null,
                status: 'QUEUED',
                cancelled: false,
                data: {
                    ...parsedInput
                }
            };

            const result = await db.collections!.queries_collection.insertOne(job);
            if (result.result.ok !== 1) {
                throw new ApolloError(errorCodes.DATABASE_ERROR);
            }
            return job;
        }
    },
    Subscription: {}
};
