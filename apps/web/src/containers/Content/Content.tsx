import React, { useEffect } from 'react';
import { Layout } from 'antd';
import './Content.less';
import { connect } from 'react-redux';
import { getUserActions } from 'core/services/kgm/role.service';
import { getOnLoadActions } from 'core/services/kgm/kgm.service';
import SpitPane from 'containers/SplitPane/SplitPane';

const mapDispatchToProps = {
    getUser: getUserActions.request,
    getOnLoad: getOnLoadActions.request
}

type Props = typeof mapDispatchToProps;


const Content = ({ getOnLoad, getUser }: Props) => {
    useEffect(() => {
        getUser({});
        getOnLoad({});
    }, [getOnLoad, getUser])

    return (
        <Layout.Content className="main_content" style={{  }}>
            <SpitPane />
        </Layout.Content>
    );
};

export default connect(null, mapDispatchToProps)(Content);