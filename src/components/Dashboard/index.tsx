import React, { ReactNode } from 'react';
import { RootState } from 'core/store';
import { connect } from 'react-redux';

type OwnProps = {
    children: ReactNode
};

const mapDispatchToProps = {
};

const mapStateToProps = (state: RootState) => {
    return {
    }
}

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & OwnProps;

const Dashboard = ({ children }: Props) => {
    return (
        <>
            {children}
        </>
    );
}


export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);