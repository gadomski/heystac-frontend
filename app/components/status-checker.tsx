"use client";

import { Button, Spinner } from "@chakra-ui/react";
import { ReactElement, useState } from "react";
import { IconBad, IconOk } from "./icons";

type Status = {
  colorPallete: string;
  ok?: boolean;
  icon?: ReactElement;
  message: string;
};

export default function StatusChecker({ href }: { href: string }) {
  const [status, setStatus] = useState<Status>({
    colorPallete: "grey",
    ok: undefined,
    icon: undefined,
    message: "Check status",
  });

  const checkStatus = async () => {
    setStatus({
      colorPallete: "grey",
      ok: undefined,
      icon: <Spinner></Spinner>,
      message: "fetching...",
    });
    const start = performance.now();
    let response;
    try {
      response = await fetch(href);
    } catch (error) {
      setStatus({
        colorPallete: "red",
        ok: false,
        icon: <IconBad></IconBad>,
        message: String(error),
      });
      return;
    }
    const end = performance.now();
    if (response.ok) {
      setStatus({
        colorPallete: "green",
        ok: true,
        icon: <IconOk></IconOk>,
        message: "OK in " + (end - start) + " ms",
      });
    } else {
      const text = await response.text();
      setStatus({
        colorPallete: "red",
        ok: false,
        icon: <IconBad></IconBad>,
        message: "ERROR: " + text,
      });
    }
  };

  return (
    <Button
      variant="surface"
      onClick={checkStatus}
      colorPalette={status?.colorPallete}
    >
      {status.icon} {status.message}
    </Button>
  );
}
