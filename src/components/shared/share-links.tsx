"use client";
import { useState } from "react";
import { Copy, Share2 } from "lucide-react";
export function ShareLinks({ title }: { title: string }) {
  const [message, setMessage] = useState("");
  async function share() {
    try {
      if (navigator.share)
        await navigator.share({ title, url: window.location.href });
      else {
        await navigator.clipboard.writeText(window.location.href);
        setMessage("Article link copied.");
      }
    } catch {
      setMessage(
        "Sharing was cancelled or is unavailable. You can copy the address from your browser.",
      );
    }
  }
  return (
    <div className="article-share">
      <button className="button button-outline" onClick={share}>
        <Share2 size={15} />
        Share article
      </button>
      <button
        className="button button-text"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(window.location.href);
            setMessage("Article link copied.");
          } catch {
            setMessage(
              "Copy the address from your browser to share this article.",
            );
          }
        }}
      >
        <Copy size={14} />
        Copy link
      </button>
      <p role="status" className="small-note">
        {message}
      </p>
    </div>
  );
}
