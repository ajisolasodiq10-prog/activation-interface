import { useEffect } from "react";
import { SCHOOL_NAME } from "../config/env.js";

export default function usePageTitle(title) {
  useEffect(() => {
    document.title = SCHOOL_NAME ? `${title} - ${SCHOOL_NAME}` : title;
  }, [title]);
}
