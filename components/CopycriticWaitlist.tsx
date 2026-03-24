"use client";

import { useEffect, useState } from "react";
import { CallToActionSection } from "./CallToActionSection";
import { FeatureHighlightsSection } from "./FeatureHighlightsSection";
import { NavigationBarSection } from "./NavigationBarSection";
import { ScoreSummarySection } from "./ScoreSummarySection";
import { SecondaryCallToActionSection } from "./SecondaryCallToActionSection";

const WAITLIST_SUBMITTED_KEY = "copycritic.waitlist.submitted";

export const CopycriticWaitlist = () => {
  const [waitlistCount, setWaitlistCount] = useState<number>(0);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    let cancelled = false;

    // If the user already joined, keep the success state across refreshes.
    try {
      const stored = window.localStorage.getItem(WAITLIST_SUBMITTED_KEY);
      if (stored === "true") setSubmitted(true);
    } catch {
      // ignore (storage can be blocked in some environments)
    }

    const loadCount = async () => {
      try {
        const res = await fetch("/api/waitlist", { method: "GET" });
        const data = (await res.json().catch(() => ({}))) as { count?: number };
        if (!cancelled && typeof data.count === "number") {
          setWaitlistCount(data.count);
        }
      } catch {
        // if count fails, keep the current value and don't break the UI
      }
    };

    void loadCount();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="relative flex h-auto flex-col items-center gap-[72px] overflow-hidden bg-[#0a0f1e] px-5 pb-24 pt-[41px] sm:px-8 lg:h-[2789px] lg:gap-[149px] lg:pl-[86px] lg:pr-[84px] lg:pb-[512px]">
      <div className="absolute left-[-251px] top-[-141px] h-[594px] w-[623px] [background:radial-gradient(50%_50%_at_50%_50%,rgba(255,214,10,0.08)_0%,rgba(255,214,10,0)_70%)]" />

      <div className="absolute left-[1045px] top-[1216px] hidden h-[594px] w-[623px] [background:radial-gradient(50%_50%_at_50%_50%,rgba(255,214,10,0.08)_0%,rgba(255,214,10,0)_70%)] lg:block" />

      <div className="absolute left-[624px] top-[2038px] hidden h-[594px] w-[623px] [background:radial-gradient(50%_50%_at_50%_50%,rgba(255,214,10,0.08)_0%,rgba(255,214,10,0)_70%)] lg:block" />

      <div className="absolute left-[-177px] top-[1598px] hidden h-[594px] w-[623px] [background:radial-gradient(50%_50%_at_50%_50%,rgba(255,214,10,0.08)_0%,rgba(255,214,10,0)_70%)] lg:block" />

      <div className="absolute left-[746px] top-[205px] hidden h-[594px] w-[623px] [background:radial-gradient(50%_50%_at_50%_50%,rgba(255,214,10,0.08)_0%,rgba(255,214,10,0)_70%)] lg:block" />

      <NavigationBarSection />

      <div className="absolute left-[-228px] top-[599px] hidden h-[594px] w-[623px] [background:radial-gradient(50%_50%_at_50%_50%,rgba(255,214,10,0.08)_0%,rgba(255,214,10,0)_70%)] lg:block" />

      <ScoreSummarySection
        waitlistCount={waitlistCount}
        submitted={submitted}
        onSuccess={(count) => {
          setWaitlistCount(count);
          setSubmitted(true);
          try {
            window.localStorage.setItem(WAITLIST_SUBMITTED_KEY, "true");
          } catch {
            // ignore
          }
        }}
      />
      <FeatureHighlightsSection />
      <SecondaryCallToActionSection
        submitted={submitted}
        onSuccess={(count) => {
          setWaitlistCount(count);
          setSubmitted(true);
          try {
            window.localStorage.setItem(WAITLIST_SUBMITTED_KEY, "true");
          } catch {
            // ignore
          }
        }}
      />
      <CallToActionSection />
    </div>
  );
};
