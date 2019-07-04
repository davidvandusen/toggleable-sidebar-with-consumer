import React from "react";

// This ref acts as the window between the consumer components and the sidebar components.
// The limitation of having only one ref instead of making it configurable is that there can only be
// one client books status sidebar on the page at the same time. I think we'll live.
const sidebarRef = React.createRef();

// This event target allows the sidebar to tell the consumers that its internal state has changed
// and they can render their children with the new state.
const eventBus = new EventTarget();

// This exported consumer can be wrapped around any component in any React root. It's aware of both
// the ref to the sidebar and the event bus. These could be configurable - provided by a context
// provider - but that felt like overkill in this case. It's also possible to make the ref and the
// event bus the same object.
export class SidebarToggleConsumer extends React.Component {
  // A bound wrapper around forceUpdate so that it can be added and removed from the event bus
  handleUpdate = () => this.forceUpdate();

  componentDidMount = () => eventBus.addEventListener("update", this.handleUpdate);

  componentWillUnmount = () => eventBus.removeEventListener("update", this.handleUpdate);

  render = () =>
    this.props.children({
      // If the ref points to a mounted component, isSidebarOpen is the return value from the getter
      // otherwise it's null - indicating that there's no sidebar to "be open"
      isSidebarOpen: sidebarRef.current && sidebarRef.current.isSidebarOpen(),
      // If the ref points to a mounted component, toggleSidebar calls its public toggleSidebar
      // method otherwise its a noop
      toggleSidebar: sidebarRef.current ? sidebarRef.current.toggleSidebar : () => {},
    });
}

// This is the stateful sidebar container component. Its state is whether the sidebar is open and
// it provides a public method for toggling the sidebar state and a getter for reading the current
// sidebar state.
class ToggleableSidebarContainer extends React.Component {
  state = { isSidebarOpen: false };

  isSidebarOpen = () => this.state.isSidebarOpen;

  toggleSidebar = () =>
    this.setState(
      // First, flip the state, causing this component's children to update in response to the
      // state change
      { isSidebarOpen: !this.state.isSidebarOpen },
      // Then, dispatch the update event, telling listeners that the state has changed. This is done
      // here instead of componentDidUpdate because the state is independent of props, so if this
      // component updates due to props changes, there's no need to dispatch this update event.
      // Instead, it only triggers when the isSidebarOpen state changes, and the only place that
      // happens is here. Technically some logic could be put into componentDidUpdate that compares
      // isSidebarOpen from the previous and current state and dispatches where appropriate, but
      // this is simpler, has better locality, and is more traceable.
      () => eventBus.dispatchEvent(new Event("update"))
    );

  render = () => <p>{this.state.isSidebarOpen ? 'THIS SIDEBAR!' : 'What sidebar?'}</p>;
}

// In order to insulate the rest of the program from having to deal with this global sidebar ref,
// just assign the ref to the sidebar container in this file. To the outside world, it's just a
// plain old component.
const ToggleableSidebar = () => <ToggleableSidebarContainer ref={sidebarRef} />;

export default ToggleableSidebar;
