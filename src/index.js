import React from "react";
import ReactDOM from "react-dom";
import ToggleableSidebar, { SidebarToggleConsumer } from "./ToggleableSidebar";

ReactDOM.render(
  <div>
    <p>In one React tree there is the sidebar.</p>
    <ToggleableSidebar />
  </div>,
  document.getElementById("sidebar-root")
);

ReactDOM.render(
  <div>
    <p>
      In the reports view, there is an ng-react button that is mounted inside of
      its own React root. The SidebarToggleConsumer will affect the sidebar
      that's mounted in any React root.
    </p>
    <SidebarToggleConsumer>
      {({ isSidebarOpen, toggleSidebar }) => (
        <div>
          <p>The sidebar is {isSidebarOpen ? "OPEN" : "closed"}</p>
          <p>
            <button onClick={toggleSidebar}>Button in Reports</button>
          </p>
        </div>
      )}
    </SidebarToggleConsumer>
  </div>,
  document.getElementById("reports-root")
);

ReactDOM.render(
  <div>
    <p>
      Somewhere else in the app there might be another React root. It also
      renders when the state of the sidebar changes.
    </p>
    <SidebarToggleConsumer>
      {({ isSidebarOpen, toggleSidebar }) => (
        <div>
          <p>The sidebar is {isSidebarOpen ? "OPEN" : "closed"}</p>
          <p>
            <button onClick={toggleSidebar}>Button Somewhere Else</button>
          </p>
        </div>
      )}
    </SidebarToggleConsumer>
  </div>,
  document.getElementById("other-root")
);
