import React, { ReactNode, useState, useEffect } from "react";
import { Layout, Menu } from "antd";
import _ from "lodash";
import "./SideNav.less";

import dashboardIcon from "assets/images/icons/dashboard.png";
import masterDataIcon from "assets/images/icons/masterdata.png";
import reportsIcon from "assets/images/icons/reports.png";
import data_migrationIcon from "assets/images/icons/data_migration.png";
import { selectUser, logoActions } from "core/services/auth";
import { RootState } from "core/store";
import { connect } from "react-redux";
import { DashboardResponse } from "core/types/Dashboard";
import { FolderFilled } from "@ant-design/icons";
import { selectDashboard } from "core/services/kgm/presentation.service";
import {
  callProcessActions,
  createStartRequest,
  generateGUID,
  createLoadRequest,
  callStaticProcessActions,
} from "core/services/kgm/process/process.service";
import { selectUserContext } from "core/services/kgm/role.service";
import api from "core/services/api";
import dataService from "core/data.service";
import dmsService from "core/services/kgm/dmsService";
import { GetUserResponse } from "core/services/ApiTypes";

const { Sider } = Layout;
const { SubMenu } = Menu;

type OwnProps = {
  collapsed: boolean;
};

const mapStateToProps = (state: RootState) => {
  return {
    user: selectUser(state),
    dashboard: selectDashboard(state),
    userContext: selectUserContext(state),
  };
};

const mapDispatchToProps = {
  callProcess: callProcessActions.request,
  callStaticProcess: callStaticProcessActions.request,
  setLogo: logoActions.success,
};

type Props = ReturnType<typeof mapStateToProps> &
  OwnProps &
  typeof mapDispatchToProps;

const IconNode = (icon: string) => (
  <img src={icon} alt="" className="menuGroupImage" />
);

const adminMenuItems = (user: string) => {
  const masterData = (
    <Menu.Item key="masterData" icon={IconNode(masterDataIcon)}>
      <span className="menu-item-text">Master Data</span>
    </Menu.Item>
  );
  const reports = (
    <Menu.Item key="reports" icon={IconNode(reportsIcon)}>
      <span className="menu-item-text">Reports</span>
    </Menu.Item>
  );
  const data_migration = (
    <Menu.Item key="dataMigration" icon={IconNode(data_migrationIcon)}>
      <span className="menu-item-text">Data Migration</span>
    </Menu.Item>
  );

  const menuItems = [masterData, reports, data_migration];
  return user === "admin" ? menuItems : null;
};

const menuItems = (navigation: any, enableFavorites: boolean) => {
  const items = Array<ReactNode>();
  _.forEach(navigation.menuItems, (item: any, index: number) => {
    const menuItem = getItem(item, enableFavorites, index);
    items.push(menuItem);
  });
  return items;
};

const processItem = (item: any, enableFavorites: boolean, index: number) => {
  // let isFavorite = item.favourite || false;
  // let favoriteIcon = <></>;
  // if (enableFavorites) {
  //     favoriteIcon = <></>; //TODO add favorite
  // }
  return (
    <Menu.Item
      key={item.event?.process + index}
      style={{
        whiteSpace: "normal",
        height: "auto",
        lineHeight: "30px",
        margin: "10px 0px",
      }}
      className="menu-item"
    >
      <span>
        <span>{item.name}</span>
      </span>
    </Menu.Item>
  );
};

const groupItem = (item: any, enableFavorites: boolean) => {
  const submenus: any = [];
  item.subMenus.forEach((submenuItem: any, index: number) => {
    const submenu = getItem(submenuItem, enableFavorites, index);
    submenus.push(submenu);
  });
  let folderIcon = <FolderFilled />;
  if (item.img) {
    folderIcon = (
      <img
        alt={item.name}
        src={item.img}
        style={{ width: "32px", height: "32px", marginRight: "1em" }}
      />
    );
  }
  return (
    <SubMenu
      key={item.name.replace(/' '/g, "")}
      className="submenu-folder"
      icon={folderIcon}
      title={item.name}
    >
      {submenus}
    </SubMenu>
  );
};

const getItem = (item: any, enableFavorites: boolean, index: number) => {
  if (item.type === "process") {
    return processItem(item, enableFavorites, index);
  }
  if (item.type === "group") {
    return groupItem(item, enableFavorites);
  }
};

const getOrgLogo = (
  userContext: GetUserResponse,
  process: string,
  setLogo: Function
) => {
  const localGUID = generateGUID();
  const request = createStartRequest(process);
  request.inputData.detailedObjects["UserInput"] = [
    {
      userId: userContext.userId,
      id: "temp_" + Math.random().toString(36).slice(2),
    },
  ];
  request.guid = localGUID;
  request.inputData.properties.guid = localGUID;
  api.process(request).then((response: any) => {
    const { data } = response;
    const requestOnLoad = createLoadRequest(process);
    requestOnLoad.guid = localGUID;
    requestOnLoad.inputData.properties.guid = localGUID;

    if (
      !_.isEmpty(data.constructOutputData) &&
      data.constructOutputData.uiResource &&
      data.constructOutputData.uiResource.presentations
    ) {
      const presentations = data.constructOutputData.uiResource.presentations;
      const pRuleMap = presentations.presentationRuleMap;
      const entityId = presentations.entityLevelMap[0];
      requestOnLoad.uiEvent.uiEventValue =
        pRuleMap[entityId][0].presentationId + "_onLoad";
    }
    api.process(requestOnLoad).then((processResponse: any) => {
      const resData = processResponse.data;
      if (
        resData.constructOutputData &&
        resData.constructOutputData.detailedObjects &&
        resData.constructOutputData.detailedObjects.Organization &&
        resData.constructOutputData.detailedObjects.Organization.length &&
        resData.constructOutputData.detailedObjects.Organization[0].logo
      ) {
        const requestObj = {
          docId:
            resData.constructOutputData.detailedObjects.Organization[0].logo.split(
              ":"
            )[0],
        };
        dmsService.viewDocument(requestObj).then(function (response: any) {
          var imageUrl =
            dataService.BASE_URL +
            "dms/viewDocument?docId=" +
            processResponse.constructOutputData.detailedObjects.Organization[0].logo.split(
              ":"
            )[0];
          setLogo(imageUrl);
        });
      }
    });
  });
};

const SideNav = ({
  collapsed,
  user,
  dashboard,
  userContext,
  callProcess,
  callStaticProcess,
  setLogo,
}: Props) => {
  const [enableFavorites, setenableFavorites] = useState(false);

  const onMenuItemSelected = (event: any) => {
    const { key } = event;
    const staticProcesses = [
      "dashboard",
      "masterData",
      "reports",
      "dataMigration",
    ];
    if (staticProcesses.indexOf(key) > -1) {
      callStaticProcess({ processName: key });
    } else {
      const request = createStartRequest(key);
      callProcess({ request, isUserTriggered: true });
    }
  };

  const [navigation, setNavigation] = useState({});
  useEffect(() => {
    const setDashBoardData = (dashboard: DashboardResponse) => {
      let navigation: any = {};
      let masterDataGlobal = {};
      if (dashboard && dashboard.container) {
        dashboard.container.forEach((obj) => {
          switch (obj.panelType) {
            case "leftPanel":
              navigation = obj.menuPanel;
              break;
            case "masterDataGlobal":
              masterDataGlobal = obj.menuPanel;
              break;
            case "background":
              if (obj.menuPanel) {
                const organizationProcess = _.find(
                  obj.menuPanel.menuItems,
                  function (obj: any) {
                    return obj.name === "organization_logo";
                  }
                );
                if (organizationProcess) {
                  getOrgLogo(
                    userContext,
                    organizationProcess.event.process,
                    setLogo
                  );
                }
              }
              break;
            default:
              break;
          }
        });
      }
      return { navigation, masterDataGlobal };
    };
    if (dashboard && dashboard.enableFavorites) {
      setenableFavorites(dashboard.enableFavorites);
    }
    const { navigation } = setDashBoardData(dashboard);
    setNavigation(navigation);
    callStaticProcess({ processName: "dashboard" });
  }, [dashboard, userContext, setLogo, callStaticProcess]);

  return (
    <Sider
      breakpoint="lg"
      collapsed={collapsed}
      width={230}
      className="kgm-sidenav"
    >
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["dashboard"]}
        onClick={(e: any) => onMenuItemSelected(e)}
      >
        <Menu.Item
          key="dashboard"
          icon={IconNode(dashboardIcon)}
          className="menu-item"
        >
          <span className="menu-item-text">Dashboard</span>
        </Menu.Item>
        {menuItems(navigation, enableFavorites)}
        {adminMenuItems(user)}
      </Menu>
    </Sider>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(SideNav);
