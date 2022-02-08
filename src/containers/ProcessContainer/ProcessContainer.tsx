import React, { } from 'react';
import { connect } from 'react-redux';
import './index.less';
import KgmList from 'containers/List/List';
import { RootState } from 'core/store';

type OwnProps = {
    process: any,
    processKey: string
};

const mapStateToProps = (state: RootState) => {
    return {
    }
}

type Props = ReturnType<typeof mapStateToProps> & OwnProps;


const getProcessDetails = (process: any) => {
    const { constructOutputData } = process;
    const { uiResource } = constructOutputData;
    const { uiTemplate } = uiResource;
    let node: any = null
    switch (uiTemplate) {
        case "list":
            node = <KgmList process={process} />
            break;
        default:
            break;
    }
    return node;
}

const ProcessContainer = ({ process, processKey }: Props) => {
    const className = 'tab ' + processKey;
    return (
        <div className={className}>{getProcessDetails(process)}</div>
    );
};

export default connect(mapStateToProps)(ProcessContainer);
