import React, { useState, useEffect } from "react";
import "./index.less";
import ProcessContainer from "containers/ProcessContainer/ProcessContainer";
import { Tabs } from "antd";
import { PushpinTwoTone } from "@ant-design/icons";
import { RootState } from "core/store";
import { connect } from "react-redux";
import { removeProcessAction } from "core/services/kgm/process/process.service";
import Dashboard from "components/Dashboard";

type OwnProps = {
  tabs: any;
  currentPaneIndex: number;
  currentProcess: string;
  setCurrentTab: Function;
  setSplitTab: Function;
};

const mapStateToProps = (state: RootState) => {
  return {};
};

const mapDispatchToProps = {
  removeProcess: removeProcessAction,
};

type Props = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps &
  OwnProps;

const getProcessDetails = (process: any) => {
  const { constructOutputData } = process;
  if (!constructOutputData || !constructOutputData.uiResource) return;
  const { detailedObjects, uiResource } = constructOutputData;
  const { presentations } = uiResource;
  const { presentationRuleMap, entityLevelMap } = presentations;
  const presentation = presentationRuleMap[entityLevelMap[0]][0];
  const { uiSettings } = presentation;

  return { detailedObjects, presentations, uiSettings, presentation };
};

const { TabPane } = Tabs;

const TabsContainer = ({
  tabs,
  currentPaneIndex,
  currentProcess,
  setSplitTab,
  setCurrentTab,
  removeProcess,
}: Props) => {
  const [panes, setPanes] = useState(Array<JSX.Element>());

  useEffect(() => {
    const tabPanes: Array<JSX.Element> = [];

    const getTabHeader = (processKey: any, formName: string) => {
      let pinBtn = (
        <div className="tab_pin" onClick={() => setSplitTab(processKey)}>
          <PushpinTwoTone />
        </div>
      );
      if (currentPaneIndex === 1 && tabs.length < 2) {
        pinBtn = <></>;
      }
      return (
        <div className="tab_header">
          {formName}
          {pinBtn}
        </div>
      );
    };

    tabs.forEach((tab: any, i: number) => {
      const { process, processKey } = tab;
      const processDetails = getProcessDetails(process);
      let isClosable = true;
      let tabHeader = <></>;
      let processContainer = <></>;
      if (processDetails) {
        const { presentation } = processDetails;
        tabHeader = getTabHeader(processKey, presentation.formName);
        processContainer = (
          <ProcessContainer process={process} processKey={processKey} />
        );
      } else {
        switch (processKey) {
          case "dashboard":
            tabHeader = <>Dashboard</>;
            processContainer = <Dashboard>Dashboard</Dashboard>;
            isClosable = false;
            break;
        }
      }
      const pane = (
        <TabPane tab={tabHeader} key={processKey} closable={isClosable}>
          {processContainer}
        </TabPane>
      );
      tabPanes.push(pane);
    });
    setPanes(tabPanes);
  }, [tabs, setSplitTab, currentPaneIndex]);

  const onEdit = (targetKey: any, action: string) => {
    if (action === "remove") {
      removeProcess({ processKey: targetKey });
    }
  };

  return (
    <Tabs
      onChange={(activeKey: string) => setCurrentTab(activeKey)}
      hideAdd={true}
      animated={true}
      activeKey={currentProcess}
      onEdit={onEdit}
      type={
        panes.length > 1 || currentPaneIndex === 2 ? "editable-card" : "card"
      }
    >
      {panes}
    </Tabs>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(TabsContainer);
