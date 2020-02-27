import { ApolloError } from 'apollo-server-core';
import { IQueryEntry } from 'itmat-commons/dist/models/query';
import uuidv4 from 'uuid/v4';
import { db } from '../../database/database';
import { errorCodes } from '../errors';

export class QueryCore {
    public async getOneQuery_throwErrorIfNotExists(queryId: string, onlyResult: boolean): Promise<IQueryEntry> {
        const queryEntry: IQueryEntry = await db.collections!.queries_collection.findOne({ id: queryId }, { projection: onlyResult ? { queryResult: 1 } : { _id: 0, claimedBy: 0 } })!;

        if (queryEntry === null || queryEntry === undefined) {
            throw new ApolloError('Query does not exist.', errorCodes.CLIENT_ACTION_ON_NON_EXISTENT_ENTRY);
        }
        return queryEntry;
    }

    public async getUsersQuery_NoResult(userId: string): Promise<IQueryEntry[]> {
        return db.collections!.queries_collection.find({ requester: userId }, { projection: { _id: 0, claimedBy: 0, queryResult: 0 } }).toArray();

    }

}

export const queryCore = Object.freeze(new QueryCore());
