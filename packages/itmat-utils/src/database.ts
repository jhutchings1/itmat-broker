import * as mongodb from 'mongodb';
import { CustomError } from './error';
import { Logger } from './logger';

export interface IDatabaseBaseConfig<Collections> {
    mongo_url: string;
    database: string;
    collections: Collections;
}

export interface IDatabase {
    collections?: any;
    connect: (config: any) => Promise<void>;
    db: mongodb.Db;
    client: mongodb.MongoClient;
    isConnected: () => boolean;
    closeConnection: () => Promise<void>;
}

export class Database<Collections> implements IDatabase {

    get db(): mongodb.Db {
        return this.localClient!.db(this.config!.database);
    }

    get client(): mongodb.MongoClient {
        return this.localClient!;
    }
    public collections?: Collections;
    private localClient?: mongodb.MongoClient;
    private config?: IDatabaseBaseConfig<{ [name in keyof Collections]: string }>;

    public async connect(config: IDatabaseBaseConfig<{ [name in keyof Collections]: string }>): Promise<void> {
        this.localClient = new mongodb.MongoClient(config.mongo_url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        this.config = config;
        if (!this.isConnected()) {
            Logger.log('Connecting to the database..');
            /* any error throw here will be caught by the server */
            await this.localClient.connect();
            Logger.log('Connected to database.');

            Logger.log('Performing basic checks..');
            await this.checkAllCollectionsArePresent();
            Logger.log('Done basic checks.');

            this.assignCollections();

            Logger.log('Finished with database initialisation.');
        } else {
            Logger.warn('Called connect function on an already connected database instance.');
        }
    }

    public isConnected(): boolean {
        return this.localClient!.isConnected();
    }

    public async closeConnection(): Promise<void> {
        try {
            await this.localClient!.close();
        } catch (e) {
            Logger.error(new CustomError('Cannot close Mongo connection', e));
        }
    }

    private assignCollections(): void {
        const collections: Collections = Object.entries(this.config!.collections).reduce((a, e) => {
            a[e[0]] = this.db.collection(e[1] as string);
            return a;
        }, {} as Collections);
        this.collections = collections;
    }

    private async checkAllCollectionsArePresent(): Promise<void> {
        const collectionList: string[] = (await this.db.listCollections({}).toArray()).map((el) => el.name);
        for (const each of Object.values(this.config!.collections)) {
            if (!collectionList.includes(each as string)) {
                throw new CustomError(`Collection ${each} does not exist.`);
            }
        }
    }
}
