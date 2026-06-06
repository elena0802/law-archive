export function AdminFieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p className="text-keep mt-2 text-sm leading-6 text-accent" role="alert">
      {message}
    </p>
  );
}
