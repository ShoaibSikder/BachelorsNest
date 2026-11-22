import { useContext, useState, useRef } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Compass, Heart, Inbox, Bell, MessagesSquare, LayoutDashboard, Building2, Plus, Users, Shield, Settings, ChartColumn, Menu, X, LogOut, Search, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { Brand, ThemeButton } from "../components/Brand";
import SiteFooter from "../components/SiteFooter";
import { getMediaUrl } from "../config";

const menus = {
  bachelor: [["Discover", "", Compass], ["Saved places", "saved", Heart], ["My requests", "requests", Inbox], ["Messages", "chats", MessagesSquare], ["Notifications", "notifications", Bell]],
  owner: [["Overview", "", LayoutDashboard], ["My properties", "properties", Building2], ["Add property", "properties/add", Plus], ["Requests", "requests", Inbox], ["Messages", "chats", MessagesSquare], ["Notifications", "notifications", Bell]],
  admin: [["Overview", "reports", ChartColumn], ["People", "users", Users], ["Properties", "properties", Building2], ["Requests", "requests", Inbox], ["Notifications", "notifications", Bell], ["Security", "security", Shield], ["Settings", "settings", Settings]],
};

export default function Workspace({ role }) {
  const { user, logout } = useContext(AuthContext);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dialog = useRef(null);
  const [collapsed, setCollapsed] = useState(false);
  const [searchText, setSearchText] = useState("");
  const root = "/" + role;
  const entries = menus[role];
  const roleName = { bachelor: "Bachelor", owner: "Owner", admin: "Admin" }[role];
  const route = (suffix) => suffix ? root + "/" + suffix : root;
  function signOut() { logout(); navigate("/login", { replace: true }); }
  function navLinks(mobile = false) {
    return entries.map(([label, suffix, Icon]) => <NavLink key={label} end to={route(suffix)} title={label}
      onClick={() => mobile && dialog.current.close()} className={({ isActive }) => "bn-navlink" + (isActive ? " selected" : "")}>
      <Icon size={19} /><span>{label}</span></NavLink>);
  }
  return <div className={"bn-shell" + (collapsed ? " compact" : "")}>
    <a className="bn-skip" href="#content">Skip to content</a>
    <aside className="bn-rail"><Link to={root} aria-label="BachelorsNest home"><Brand /></Link>
      <nav aria-label="Workspace navigation">{navLinks()}</nav>
      <div className="bn-railfoot"><button onClick={() => setCollapsed(!collapsed)} title={collapsed ? "Expand sidebar" : "Collapse sidebar"}>{collapsed ? <PanelLeftOpen size={19}/> : <PanelLeftClose size={19}/>}<span>Collapse sidebar</span></button>
      <button onClick={signOut} title="Sign out"><LogOut size={19}/><span>Sign out</span></button></div>
    </aside>
    <dialog className="bn-drawer" ref={dialog} onClick={e => { if (e.target === dialog.current) dialog.current.close(); }}>
      <div><div className="bn-row"><Brand/><button className="bn-icon" aria-label="Close navigation" onClick={() => dialog.current.close()}><X/></button></div>
      <nav aria-label="Mobile navigation">{navLinks(true)}</nav><button onClick={signOut} className="bn-navlink"><LogOut size={19}/>Sign out</button></div>
    </dialog>
    <div className="bn-work"><header className="bn-bar"><div className="bn-row"><button className="bn-icon bn-mobile" aria-label="Open navigation" onClick={() => dialog.current.showModal()}><Menu size={22}/></button>
      <span className="bn-mobile"><Brand/></span><span className="bn-desktop">{roleName} workspace</span></div>
      <div className="bn-row"><ThemeButton/><Link className="bn-avatar" to={root + "/profile"} aria-label="Open profile" title={user?.username || "Profile"}>{user?.profile_image ? <img src={getMediaUrl(user.profile_image)} alt=""/> : user?.username?.slice(0,1).toUpperCase() || "U"}</Link></div>
    </header>
    <main className="bn-content" id="content" tabIndex={-1}>
      {role === "bachelor" && pathname === root && <label className="bn-search"><Search size={18}/><input aria-label="Search properties" type="search" placeholder="Search by location, property or owner" value={searchText} onChange={e=>setSearchText(e.target.value)}/></label>}
      <Outlet context={{ searchText }}/>
    </main><SiteFooter/></div>
  </div>;
}
