import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type Props = {
  id: string;
  title: string;
  link?: string;
  children: ReactNode;
  tone?: "orange" | "blue";
};

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 5l7 7-7 7"
      />
    </svg>
  );
}

export default function Section({
  id,
  title,
  link,
  children,
  tone = "orange",
}: Props) {
  return (
    <section className="section" id={id}>
      <div className={`section__head section__head--${tone}`}>
        <h2 className="section__title">{title}</h2>
        {link &&
          (link.startsWith("#") ? (
            <a className="section__link" href={link}>
              View all
              <ArrowIcon />
            </a>
          ) : (
            <Link className="section__link" to={link}>
              View all
              <ArrowIcon />
            </Link>
          ))}
      </div>
      {children}
    </section>
  );
}
