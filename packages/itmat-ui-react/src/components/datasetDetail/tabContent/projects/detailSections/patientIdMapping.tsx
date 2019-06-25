import React, { useState } from 'react';
import { LoadingBalls } from '../../../../reusable/loadingBalls';
import { GET_PROJECT_PATIENT_MAPPING } from '../../../../../graphql/projects';
import { Query } from 'react-apollo';

export const PatientIdMappingSection: React.FunctionComponent<{ projectId: string }> = ({ projectId }) => {
    const [clickedFetch, setClickedFetch] = useState(false);
    const [currentProjectId, setCurrentProjectId] = useState(projectId);

    if (projectId !== currentProjectId) {
        setClickedFetch(false);
        setCurrentProjectId(projectId);
    }

    if (!clickedFetch) return <button onClick={() => setClickedFetch(true)}>Fetch mapping</button>;
    return <Query query={GET_PROJECT_PATIENT_MAPPING} variables={{ projectId }}>
    {({ data, loading, error }) => {
        if (loading) return <LoadingBalls/>;
        if (error) return <p>{error.toString()}</p>;
        if (!data || !data.getProject || !data.getProject.patientMapping) return <p>'Cannot fetch data'</p>;
        return <textarea>{JSON.stringify(data.getProject.patientMapping)}</textarea>;
    }}
    </Query>;
};