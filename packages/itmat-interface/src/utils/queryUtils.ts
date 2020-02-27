import { IQueryInput, enumCohortSelectionOp, enumEquationOp } from "itmat-commons/dist/models/query";

export function parseQueryStringIntoTree(inputstring: string): { error?: string, parsedInput: IQueryInput } {
    // TO_DO
    return ({
        error: undefined,
        parsedInput: {
            queryString: inputstring,
            data_requested: [ '31.0.0',  '102.0.1', '102.0.2'],
            cohort: [
                [
                    {
                        field: '102.0',
                        value: '> 1',
                        op: enumCohortSelectionOp.count
                    },
                    {
                        field: '31.0.0',
                        value: 'Male',
                        op: enumCohortSelectionOp['=']
                    }
                ],
                [
                    {
                        field: '31.0.0',
                        value: 'Female',
                        op: enumCohortSelectionOp['=']
                    },
                    {
                        field: '102.0.1',
                        value: '',
                        op: enumCohortSelectionOp.exists
                    }
                ]
            ],
            new_fields: [
                {
                        name: 'BMI',
                        value: {
                            left: {
                                left: '12143.0.0',
                                right: '',
                                op: enumEquationOp.field
                            },
                            right: {
                                left: '12144.0.0',
                                right: '2',
                                op: enumEquationOp['^']
                            },
                            op: enumEquationOp['/']
                        },
                        op: 'derived'
                }
            ]
        }
    });
}

export function checkAndSanitiseQuery(input: IQueryInput): string | null {
    // TO_DO
    return null; // return error
}
