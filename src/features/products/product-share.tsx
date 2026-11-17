"use client";

import { useId, useRef, useState, useSyncExternalStore } from "react";
import { Copy, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const subscribe = () => () => {};
const client = () => true;
const server = () => false;
export function ProductShare({ name }: { name: string }) {
  const ready = useSyncExternalStore(subscribe, client, server);
  const nativeShare = useSyncExternalStore(
    subscribe,
    () => typeof navigator.share === "function",
    server,
  );
  const [status, setStatus] = useState("");
  const [manualUrl, setManualUrl] = useState("");
  const manualInput = useRef<HTMLInputElement>(null);
  const manualId = useId();
  const revealManual = () => {
    setManualUrl(window.location.href);
    setStatus("Copy this page address using your browser or the field below.");
  };
  if (!ready) return null;
  return (
    <div className="product-share" aria-label="Share this product">
      <p className="m-0 font-semibold">Share this product</p>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          className="rounded-full"
          onClick={async () => {
            if (!navigator.clipboard?.writeText) {
              revealManual();
              return;
            }
            try {
              await navigator.clipboard.writeText(window.location.href);
              setManualUrl("");
              setStatus("Link copied.");
            } catch {
              revealManual();
            }
          }}
        >
          <Copy aria-hidden="true" />
          Copy link
        </Button>
        {nativeShare && (
          <Button
            variant="outline"
            className="rounded-full"
            onClick={async () => {
              try {
                await navigator.share({
                  title: name,
                  url: window.location.href,
                });
                setStatus("Sharing completed.");
              } catch (error) {
                if (
                  error &&
                  typeof error === "object" &&
                  "name" in error &&
                  error.name === "AbortError"
                )
                  setStatus("");
                else
                  setStatus("Sharing is unavailable. Use Copy link instead.");
              }
            }}
          >
            <Share2 aria-hidden="true" />
            Share
          </Button>
        )}
      </div>
      <p
        role="status"
        aria-live="polite"
        className="m-0 text-sm text-muted-foreground"
      >
        {status}
      </p>
      {manualUrl && (
        <div className="grid gap-2 text-sm">
          <label htmlFor={manualId}>Page address</label>
          <input
            id={manualId}
            ref={manualInput}
            type="text"
            value={manualUrl}
            readOnly
            className="touch-target w-full min-w-0 rounded-control border border-input p-2"
            onFocus={(event) => event.currentTarget.select()}
          />
          <Button
            variant="outline"
            className="justify-self-start"
            onClick={() => {
              manualInput.current?.focus();
              manualInput.current?.select();
            }}
          >
            Select link
          </Button>
        </div>
      )}
    </div>
  );
}
