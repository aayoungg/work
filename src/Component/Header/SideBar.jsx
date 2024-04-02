/* eslint-disable */
import styled from "styled-components";
import { NavLink, useLocation } from "react-router-dom";
import { ReactComponent as DownIcon } from "assets/icon/system/arrow-down-s-line.svg";
import homeIcon from "assets/icon/system/home-line.svg";
import employeeIcon from "assets/icon/system/employee-line.svg";
import calendarIcon from "assets/icon/social/calendar.svg";
import userIcon from "assets/icon/social/user.svg";
import vacationIcon from "assets/icon/social/vacation-line.svg";
import { getCookie } from "Cookie/cookie";
import {
  adminMenu,
  teamLeaderMenu,
  TeamMemberMenu,
} from "constants/UIConstants";

const SideBarWrap = styled.div`
  width: 230px;
  height: calc(100vh - 80px);
  border-right: 1px solid #e7e7e7;
  padding: 0 20px 0 20px;
  flex: 0 0 230px;
`;

const SideMenu = styled.ul`
  width: 100%;
  padding-top: 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;

  ul {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 6px 0;
  }

  .menu,
  .sub-menu {
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    align-items: center;
    height: 38px;
    border-radius: 3px;

    &.active {
      background: var(--sub-color);
      color: var(--main-color);
    }

    &.on {
      .down-icon {
        transform: rotate(180deg);
      }
    }
  }

  .menu {
    padding: 0 10px;
    gap: 10px;
    border-radius: 3px;
  }

  .sub-menu {
    padding: 0 0 0 44px;
  }

  .icon {
    background-color: currentColor;
    -webkit-mask-size: 24px;
    width: 24px;
    height: 24px;
    -webkit-mask-repeat: no-repeat;

    &.home {
      mask-image: url(${homeIcon});
    }

    &.mypage {
      mask-image: url(${userIcon});
    }

    &.schedule {
      mask-image: url(${calendarIcon});
    }

    &.employee {
      mask-image: url(${employeeIcon});
    }

    &.vacation {
      mask-image: url(${vacationIcon});
    }
  }

  .down-icon {
    margin-left: auto;
    color: var(--gray8);
    transition: 0.2s;
  }

  .sub {
    ul {
      display: none;
    }

    .on + ul {
      display: flex;
    }

    &:hover {
      ul {
        display: flex;
      }

      .menu {
        .down-icon {
          transform: rotate(180deg);
        }
      }
    }
  }
`;

export default function SideBar({}) {
  const location = useLocation();
  const user = getCookie("logindata");

  const isSubActive = (subMenu) => {
    return subMenu.find((item) => item.link === location.pathname);
  };

  const Menu =
    user.data.rankName === "관리자"
      ? adminMenu
      : user.data.rankName === "팀장"
      ? teamLeaderMenu
      : TeamMemberMenu;

  return (
    <>
      <SideBarWrap>
        <SideMenu>
          {Menu.map((item, index) => {
            return (
              <li key={`side-menu-${index}`}>
                {!item.subMenu || !item.subMenu.length ? (
                  <NavLink to={item.link} className={`menu`}>
                    <div className={`icon ${item.icon}`}></div>
                    {item.title}
                  </NavLink>
                ) : (
                  <div className={`sub`}>
                    <p
                      className={`menu ${
                        isSubActive(item.subMenu) ? "on" : ""
                      }`}
                    >
                      <span className={`icon ${item.icon}`}></span>
                      {item.title}
                      <DownIcon width={24} className={"down-icon"}></DownIcon>
                    </p>
                    <ul>
                      {item.subMenu.map((sub, idx) => {
                        return (
                          <li key={`sub-menu-${idx}`}>
                            <NavLink to={sub.link} className={`sub-menu`}>
                              {sub.title}
                            </NavLink>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </li>
            );
          })}
        </SideMenu>
        <ul>
          <li></li>
        </ul>
      </SideBarWrap>
    </>
  );
}
