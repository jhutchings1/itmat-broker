import { Database } from 'itmat-utils';
import { Collection } from 'mongodb';

export const db = new Database<{
    users_collection: Collection,
    data_collection: Collection,
    jobs_collection: Collection,
    studies_collection: Collection,
    projects_collection: Collection,
    queries_collection: Collection,
    field_dictionary_collection: Collection,
    roles_collection: Collection,
    files_collection: Collection,
    log_collection: Collection
}>();
