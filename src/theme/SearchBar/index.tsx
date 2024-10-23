import React, { useState } from "react";
import SearchBar from "@theme-original/SearchBar";
import type SearchBarType from "@theme/SearchBar";
import type { WrapperProps } from "@docusaurus/types";

type Props = WrapperProps<typeof SearchBarType>;

export default function SearchBarWrapper(props: Props): JSX.Element {
  const [isChatting, setIsChatting] = useState(false);
  return (
    <>
      <SearchBar {...props} />
      <button type="button" onClick={() => setIsChatting(true)}>
        chat
      </button>
    </>
  );
}
