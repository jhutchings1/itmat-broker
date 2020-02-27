import { db } from '../database/database';
import { JobHandler } from './jobHandlerInterface';
import { IQueryEntry } from 'itmat-commons/dist/models/query';
import { IProject } from 'itmat-commons/dist/models/study';
import { Logger } from 'itmat-utils';
import { pipelineGenerator } from '../query/pipeLineGenerator';

export class QUERY_Handler extends JobHandler {
    private _instance?: QUERY_Handler;

    public async getInstance() {
        if (!this._instance) {
            this._instance = new QUERY_Handler();
        }
        return this._instance;
    }

    public async execute(document: IQueryEntry): Promise<void> {
        const { id } = document;
        const pipeline = pipelineGenerator.buildPipeline(document.data);
        try {
            const result = await db.collections!.data_collection.aggregate(pipeline).toArray();

            /* if the query is on a project, then we need to map the results m_eid */
            if (document.projectId) {
                const project: IProject = await db.collections!.projects_collection.findOne({ id: document.projectId })!;
                if (project === null || project === undefined) {
                    await db.collections!.queries_collection.findOneAndUpdate({ id }, { $set: {
                        error: 'Project does not exist or has been deleted.',
                        status: 'error'
                    }});
                    return;
                }
                const mapping = project.patientMapping;
                result.forEach((el) => {
                    if (el.m_eid === undefined) { return; }
                    el.m_eid = mapping[el.m_eid];
                });
            }

            await db.collections!.queries_collection.findOneAndUpdate({ id }, { $set: {
                'data.queryResult': JSON.stringify(result),
                'status': 'finished'
            }});
            return;
        } catch (e) {
            /* log */
            Logger.error(e.toString());

            /* update query status */
            await db.collections!.queries_collection.findOneAndUpdate({ id }, { $set: {
                error: e.toString(),
                status: 'error'
            }});
            return;
        }
    }
}
