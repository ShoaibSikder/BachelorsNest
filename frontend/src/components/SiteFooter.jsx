import footerHtml from "./site-footer.html?raw";
import "../footer.css";

export default function SiteFooter() {
  // The same repository-owned fragment is inlined into the crawlable homepage.
  return <div dangerouslySetInnerHTML={{ __html: footerHtml }} />;
}
