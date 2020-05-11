import { Database } from 'itmat-utils';
import { Collection } from 'mongodb';

export const db = new Database<{
    jobs_collection: Collection,
    UKB_coding_collection: Collection,
    files_collection: Collection,
    field_dictionary_collection: Collection,
    data_collection: Collection,
    projects_collection: Collection,
    queries_collection: Collection,
    studies_collection: Collection
}>();
