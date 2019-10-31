import { ApolloError } from 'apollo-server-express';
import { Models, permissions } from 'itmat-commons';
import { IFile } from 'itmat-commons/dist/models/file';
import { Logger } from 'itmat-utils';
import uuid from 'uuid/v4';
import { db } from '../../database/database';
import { objStore } from '../../objStore/objStore';
import { permissionCore } from '../core/permissionCore';
import { errorCodes } from '../errors';
import { IGenericResponse, makeGenericReponse } from '../responses';


export const fileResolvers = {
    Query: {
    },
    Mutation: {
        uploadFile: async (parent: object, args: { fileLength?: number, studyId: string, file: Promise<{ stream: NodeJS.ReadableStream, filename: string }>, description: string }, context: any, info: any): Promise<IFile> => {
            const requester: Models.UserModels.IUser = context.req.user;

            const hasPermission = await permissionCore.userHasTheNeccessaryPermission(
                [permissions.specific_study.specific_study_file_management],
                requester,
                args.studyId
            );
            if (!hasPermission) { throw new ApolloError(errorCodes.NO_PERMISSION_ERROR); }

            const file = await args.file;

            return new Promise<IFile>(async (resolve, reject) => {
                const fileUri = uuid();
                /* if the client cancelled the request mid-stream it will throw an error */
                file.stream.on('error', (e) => {
                    Logger.error(e);
                    reject(new ApolloError(errorCodes.FILE_STREAM_ERROR));
                });

                file.stream.on('end', async () => {
                    const fileEntry: IFile = {
                        id: uuid(),
                        fileName: file.filename,
                        studyId: args.studyId,
                        fileSize: args.fileLength || undefined,
                        description: args.description,
                        uploadedBy: requester.id,
                        uri: fileUri,
                        deleted: false
                    };

                    const insertResult = await db.collections!.files_collection.insertOne(fileEntry);
                    if (insertResult.result.ok === 1) {
                        resolve(fileEntry);
                    } else {
                        throw new ApolloError(errorCodes.DATABASE_ERROR);
                    }
                });

                try {
                    await objStore.uploadFile(file.stream, args.studyId, fileUri);
                } catch (e) {
                    Logger.error(errorCodes.FILE_STREAM_ERROR);
                }
            });
        },
        deleteFile: async (parent: object, args: { studyId: string, fileId: string }, context: any, info: any): Promise<IGenericResponse> => {
            const requester: Models.UserModels.IUser = context.req.user;

            const hasPermission = await permissionCore.userHasTheNeccessaryPermission(
                [permissions.specific_study.specific_study_file_management],
                requester,
                args.studyId
            );
            if (!hasPermission) { throw new ApolloError(errorCodes.NO_PERMISSION_ERROR); }

            const updateResult = await db.collections!.files_collection.updateOne({ deleted: false, id: args.fileId }, { $set: { deleted: true } });
            if (updateResult.result.ok === 1) {
                return makeGenericReponse();
            } else {
                throw new ApolloError(errorCodes.DATABASE_ERROR);
            }
        }
    },
    Subscription: {}
};