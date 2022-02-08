import React, { useState, useEffect } from 'react';
import './index.less';
import { RootState } from 'core/store';
import { selectProcessState, selectSplitPane, setSplitAction, setCurrentPaneKeyAction } from 'core/services/kgm/process/process.service';
import { connect } from 'react-redux';
import Split from 'react-split'
import TabsContainer from 'containers/TabsContainer/TabsContainer';

type OwnProps = {
};

const mapStateToProps = (state: RootState) => {
    return {
        processState: selectProcessState(state),
        splitPanes: selectSplitPane(state)
    }
}

const mapDispatchToProps = {
    splitPaneAction: setSplitAction.request,
    setCurrentPaneKey: setCurrentPaneKeyAction
}

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & OwnProps;

const SplitPane = ({ processState, splitPanes, splitPaneAction, setCurrentPaneKey }: Props) => {
    const [firstPanetabs, setFirstPanetabs] = useState([]);
    const [secondPanetabs, setSecondPanetabs] = useState([]);
    const [firstPaneCurrentTab, setFirstPaneCurrentTab] = useState("");
    const [secondPaneCurrentTab, setSecondPaneCurrentTab] = useState("");

    useEffect(() => {
        const { FirstPane, SecondPane } = splitPanes;
        const firstCurrentTab = FirstPane.currentTab;
        const secondCurrentTab = SecondPane.currentTab;
        setFirstPaneCurrentTab(firstCurrentTab);
        setSecondPaneCurrentTab(secondCurrentTab);
        const fPaneTabs: any = [];
        const sPaneTabs: any = [];
        FirstPane.tabs.forEach((tab: any) => {
            const process = processState[tab];
            process && fPaneTabs.push({ processKey: tab, process });
        });
        SecondPane.tabs.forEach((tab: any) => {
            const process = processState[tab];
            process && sPaneTabs.push({ processKey: tab, process });
        });
        setFirstPanetabs(fPaneTabs);
        setSecondPanetabs(sPaneTabs);
    }, [processState, splitPanes]);

    const setFirstCurrentPaneKey = (processKey: string) => {
        setCurrentPaneKey({ processKey, paneNumber: 1 });
        setFirstPaneCurrentTab(processKey);
    }

    const setSecondCurrentPaneKey = (processKey: string) => {
        setCurrentPaneKey({ processKey, paneNumber: 2 });
        setSecondPaneCurrentTab(processKey);
    }

    const setSplitTab = (processKey: string) => {
        splitPaneAction({ processKey, action: "add" });
    }

    const removeSplitTab = (processKey: string) => {
        splitPaneAction({ processKey, action: "remove" });
    }

    const splitSizes = secondPanetabs.length ? [50, 50] : [100, 0];
    const className = "flex container " + (secondPanetabs.length ? "second-pane" : "no-second-pane");
    return (
        <Split className={className} sizes={splitSizes}>
            <div className="firstPane" style={{}}>
                <TabsContainer tabs={firstPanetabs} currentPaneIndex={1} currentProcess={firstPaneCurrentTab} setCurrentTab={setFirstCurrentPaneKey} setSplitTab={setSplitTab} />
            </div>
            <div className="secondPane">
                <TabsContainer tabs={secondPanetabs} currentPaneIndex={2} currentProcess={secondPaneCurrentTab} setCurrentTab={setSecondCurrentPaneKey} setSplitTab={removeSplitTab} />
            </div>
        </Split>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(SplitPane);
