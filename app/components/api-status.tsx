"use client";

import { getLinkHref } from "@actions";
import { Status, StatusValue } from "@components/status";
import { Link } from "@stac-types";
import { useEffect, useState } from "react";

export default function ApiStatus({ link }: { link: Link }) {
  const [value, setValue] = useState("info" as StatusValue);
  const [label, setLabel] = useState("checking API status...");

  useEffect(() => {
    const getApiStatus = async () => {
      const check = await getLinkHref(link);
      if (check.isSuccess) {
        setValue("success");
      } else {
        setValue("error");
      }
      setLabel(check.label);
    };
    getApiStatus();
  });

  return <Status value={value}>{label}</Status>;
}
