import Link from "next/link";

export default function NotFound() {
  return (
    <div className="not-found">
      <strong>404</strong>
      <h1>This path resolves to nothing.</h1>
      <p>
        Return to the <Link href="/">home directory</Link>.
      </p>
    </div>
  );
}
