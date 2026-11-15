import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { previewNoticeContent } from "@/content/preview-notice";
import { site } from "@/content/site";

function PreviewNotice() {
  if (!site.preview) return null;

  return (
    <div data-surface="yellow" className="border-b border-input">
      <div className="layout-container py-4">
        <Alert
          role="note"
          aria-label={previewNoticeContent.title}
          className="rounded-[var(--radius-control)] border-primary-border bg-background p-4 text-base text-foreground"
        >
          <AlertTitle className="type-control-strong font-semibold">
            {previewNoticeContent.title}
          </AlertTitle>
          <AlertDescription className="text-base leading-[1.6] font-normal text-foreground">
            <p className="text-measure m-0">
              {previewNoticeContent.description}
            </p>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}

export { PreviewNotice };
