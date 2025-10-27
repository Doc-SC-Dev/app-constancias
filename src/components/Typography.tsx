import type { ReactNode } from "react";

type TypegraphyProps = {
  children: ReactNode;
  variant?:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "p"
    | "blockquote"
    | "inline-code"
    | "large"
    | "small"
    | "muted";
};

export function Typography({ children, variant }: TypegraphyProps) {
  switch (variant) {
    case "h1":
      return (
        <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
          {children}
        </h1>
      );
    case "h2":
      return (
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          {children}
        </h2>
      );
    case "h3":
      return (
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          {children}
        </h3>
      );
    case "h4":
      return (
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          {children}
        </h4>
      );
    case "p":
      return <p className="leading-7 [&:not(:first-child)]:mt-6">{children}</p>;
    case "blockquote":
      return (
        <blockquote className="mt-6 border-l-2 pl-6 italic">
          {children}
        </blockquote>
      );
    case "inline-code":
      return (
        <code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
          {children}
        </code>
      );
    case "large":
      return <div className="text-lg font-semibold">{children}</div>;
    case "small":
      return (
        <small className="text-sm leading-none font-medium">{children}</small>
      );
    case "muted":
      return <p className="text-muted-foreground text-sm">{children}</p>;
    default:
      return <p className="leading-7 [&:not(:first-child)]:mt-6">{children}</p>;
  }
}
