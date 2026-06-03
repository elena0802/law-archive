type AdminNoticeBannerProps = {
  message: string;
};

export function AdminNoticeBanner({ message }: AdminNoticeBannerProps) {
  return (
    <p
      className="text-keep rounded border border-line bg-paper-muted px-5 py-4 text-base leading-7 text-ink"
      role="status"
    >
      {message}
    </p>
  );
}
