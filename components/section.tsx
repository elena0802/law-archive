import { Container } from "@/components/container";

type SectionProps = {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  size?: "reading" | "wide";
};

export function Section({
  children,
  className = "",
  containerClassName = "",
  size = "wide",
}: SectionProps) {
  return (
    <section className={`py-section ${className}`}>
      <Container className={containerClassName} size={size}>
        {children}
      </Container>
    </section>
  );
}
