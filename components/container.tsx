type ContainerProps = {
  children: React.ReactNode;
  className?: string;
  size?: "reading" | "wide";
};

export function Container({
  children,
  className = "",
  size = "wide",
}: ContainerProps) {
  const maxWidth =
    size === "reading"
      ? "max-w-reading"
      : "max-w-wide";

  return (
    <div className={`mx-auto w-full px-5 sm:px-8 lg:px-10 ${maxWidth} ${className}`}>
      {children}
    </div>
  );
}
