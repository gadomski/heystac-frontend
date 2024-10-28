import Link from "next/link";

export default function Navbar() {
  return (
    <div className="mx-auto w-screen h-12 flex items-center px-8 shadow">
      <Link href="/">
        <span className="font-bold">heystac</span>
      </Link>
    </div>
  );
}
