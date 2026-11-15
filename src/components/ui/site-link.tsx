import NextLink from "next/link";
import type { ComponentProps } from "react";
// Keep initial marketing pages lean: load another route when the visitor follows it.
export function SiteLink(props: ComponentProps<typeof NextLink>) {
  return <NextLink {...props} prefetch={false} />;
}
