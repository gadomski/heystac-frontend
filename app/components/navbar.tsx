import { Box } from "@chakra-ui/react";
import Link from "next/link";

export default function Navbar() {
  return (
    <Box className="mx-auto w-screen h-12 flex items-center px-8 shadow red-400">
      <Link href="/">
        <Box color="primary" className="font-bold">
          heystac
        </Box>
      </Link>
    </Box>
  );
}
