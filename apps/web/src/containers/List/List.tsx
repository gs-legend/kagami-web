import React from "react";

type Props = {
    process: any
};

const getProcessDetails = (process: any) => {
    const { constructOutputData } = process;
    const { detailedObjects, uiResource } = constructOutputData;
    const { presentations } = uiResource;
    const { presentationRuleMap, entityLevelMap } = presentations;
    const presentation = presentationRuleMap[entityLevelMap[0]][0];
    const { uiSettings } = presentation;

    return { detailedObjects, presentations, uiSettings, presentation }
}

const KgmList = ({ process }: Props) => {
    const processDetails = getProcessDetails(process);
    return (
        <div className="ist">{processDetails.presentation.headerName}</div>
    );
};

export default KgmList;
