// TEST QUERY example
//
let query_test = {
    id : '474b9676-8b2c-4983-9dbe-a6ba84370288',
    queryString : '{"31.0.0":"Male"}',
    study : null,
    requester : 'admin',
    status : 'PROCESSING',
    error : null,
    cancelled : false,
    lastClaimed : 1542288352356.0,
    queryResult : {},
    data_requested: [ '31.0.0',  '102.0.1', '102.0.2'],
    cohort: [
        [{ field: '102.0',
        value: '> 1',
        op: 'count'},
        { field: '31.0.0',
            value: 'Male',
            op: '='}],
        [{ field: '31.0.0',
            value: 'Female',
            op: '='},
            { field: '102.0.1',
            value: '',
            op: 'exists'}]
    ],
    new_fields: [
        {
                name: 'BMI',
                value: {
                    left: {
                        left: '12143.0.0',
                        right: '',
                        op: 'field'
                    },
                    right: {
                        left: '12144.0.0',
                        right: '2',
                        op: '^'
                    },
                    op: '/'
                },
                op: 'derived'
        }
    ]
};
