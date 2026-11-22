import { Brand, ThemeButton } from "../components/Brand";
import SiteFooter from "../components/SiteFooter";

export default function AuthLayout({ title, children }) {
  return <><main className="bn-auth"><header className="bn-authbar"><a href="/" aria-label="BachelorsNest homepage"><Brand/></a><ThemeButton/></header>
    <div className="bn-authbody"><figure className="bn-photo">
      <img src="/apartment-interior.jpg" alt="Bright apartment living room with a sofa and natural light"/>
      <figcaption><img src="/bachelorsnest-icon.svg" width="24" height="24" alt=""/> BachelorsNest</figcaption>
    </figure><section className="bn-account"><h1>{title}</h1>{children}</section></div>
  </main><SiteFooter/></>;
}
