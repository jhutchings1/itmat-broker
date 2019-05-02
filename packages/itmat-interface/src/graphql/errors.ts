import { ApolloError } from 'apollo-server-express';

interface IErrorForClient {
    errors: {
        error: string,
        detail: string,
        error_type_ref: string,
        error_id: string
    }[]
};

export function formatGraphqlErrorForClient(err: ApolloError) {
    
};

export enum errorCodes {
    DATABASE_ERROR = 'DATABASE_ERROR',
    CLIENT_MALFORMED_INPUT = 'CLIENT_MALFORMED_INPUT',
    CLIENT_ACTION_ON_NON_EXISTENT_ENTRY = 'CLIENT_ACTION_ON_NON_EXISTENT_ENTRY',
    AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
    NO_PERMISSION_ERROR = 'NO_PERMISSION_ERROR',
    FILE_STREAM_ERROR = 'FILE_STREAM_ERROR'
};