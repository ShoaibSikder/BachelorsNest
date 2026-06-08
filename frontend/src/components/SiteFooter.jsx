import { createElement } from "react";
import {
  Facebook,
  Github,
  Instagram,
  Linkedin,
  Mail,
  Globe,
} from "lucide-react";

const socialLinks = [
  {
    label: "GitHub",
    value: "github.com/ShoaibSikder",
    href: "https://github.com/ShoaibSikder",
    tone: "slate",
    Icon: Github,
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/md-shoaib-sikder-232abb3b3",
    href: "https://www.linkedin.com/in/md-shoaib-sikder-232abb3b3/",
    tone: "blue",
    Icon: Linkedin,
  },
  {
    label: "Instagram",
    value: "instagram.com/shoaibsikder0",
    href: "https://www.instagram.com/shoaibsikder0",
    tone: "pink",
    Icon: Instagram,
  },
  {
    label: "Portfolio",
    value: "shoaibsikderportfolio.vercel.app",
    href: "https://shoaibsikderportfolio.vercel.app/",
    tone: "cyan",
    Icon: Globe,
  },
  {
    label: "Facebook",
    value: "facebook.com/shoaib.sikder.35",
    href: "https://www.facebook.com/shoaib.sikder.35",
    tone: "blue",
    Icon: Facebook,
  },
  {
    label: "Email",
    value: "shoaibsikder0@gmail.com",
    href: "mailto:shoaibsikder0@gmail.com",
    tone: "cyan",
    Icon: Mail,
  },
];

const toneClasses = {
  slate:
    "text-slate-600 hover:border-slate-400 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:bg-slate-800 dark:hover:text-white",
  blue:
    "text-blue-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 dark:text-blue-300 dark:hover:border-blue-500 dark:hover:bg-blue-950/60 dark:hover:text-blue-200",
  pink:
    "text-pink-600 hover:border-pink-300 hover:bg-pink-50 hover:text-pink-700 dark:text-pink-300 dark:hover:border-pink-500 dark:hover:bg-pink-950/60 dark:hover:text-pink-200",
  cyan:
    "text-cyan-600 hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700 dark:text-cyan-300 dark:hover:border-cyan-500 dark:hover:bg-cyan-950/60 dark:hover:text-cyan-200",
};

const footerLinkClasses =
  "inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white transition dark:border-slate-700 dark:bg-slate-900";

const SiteFooter = () => {
  return (
    <footer className="mt-6 rounded-2xl border border-slate-200 bg-white/90 px-4 py-4 text-center text-sm text-slate-600 shadow-lg shadow-slate-200/60 dark:border-slate-700 dark:bg-gray-800/95 dark:text-slate-300 dark:shadow-black/20">
      <p className="text-slate-600 dark:text-slate-400">
        Copyright &copy; 2026 by{" "}
        <a
          href="https://shoaibsikderportfolio.vercel.app/"
          target="_blank"
          rel="noreferrer"
          className="font-medium text-blue-600 hover:text-indigo-600 dark:text-blue-300 dark:hover:text-indigo-300"
        >
          @shoaibsikder
        </a>{" "}
        | All Rights Reserved.
      </p>

      <div className="mt-2 flex flex-wrap items-center justify-center gap-2.5">
        {socialLinks.map(({ label, value, href, tone, Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
            title={value}
            className={`${footerLinkClasses} ${toneClasses[tone]}`}
          >
            {createElement(Icon, { size: 18 })}
          </a>
        ))}
      </div>
    </footer>
  );
};

export default SiteFooter;
