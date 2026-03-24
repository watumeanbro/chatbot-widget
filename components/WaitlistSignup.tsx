"use client";

import { useCallback, useMemo, useState } from "react";
import { z } from "zod";

type ApiSuccess = { success: true; count: number };
type ApiError = { error: string };

const EMAIL_SCHEMA = z.string().trim().email();

const COMMON_DOMAIN_TYPOS = new Set([
  "gamil.com",
  "gmial.com",
  "gmal.com",
  "gmail.co",
  "yahooo.com",
  "yaho.com",
  "hotmial.com",
  "outlok.com",
]);

function isTypoEmail(email: string) {
  const atIndex = email.lastIndexOf("@");
  if (atIndex === -1) return false;
  const domain = email.slice(atIndex + 1).toLowerCase();
  return COMMON_DOMAIN_TYPOS.has(domain);
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}

export function WaitlistSignup({
  submitted,
  onSuccess,
}: {
  submitted: boolean;
  onSuccess: (count: number) => void;
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [isInvalid, setIsInvalid] = useState(false);

  const borderClass = useMemo(() => {
    if (!isInvalid) return "border-[#8a95b0]";
    return "border-[#FF4444]";
  }, [isInvalid]);

  const clearErrors = useCallback(() => {
    if (errorText) setErrorText(null);
    if (isInvalid) setIsInvalid(false);
  }, [errorText, isInvalid]);

  const validateClientSide = useCallback((value: string) => {
    const parsed = EMAIL_SCHEMA.safeParse(value);
    if (!parsed.success) return false;
    return !isTypoEmail(parsed.data);
  }, []);

  const submit = useCallback(async () => {
    const nextEmail = email.trim();

    if (!validateClientSide(nextEmail)) {
      setIsInvalid(true);
      setErrorText("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: nextEmail }),
      });

      const data = (await res.json().catch(() => ({}))) as ApiSuccess | ApiError;

      if (res.ok && "success" in data) {
        setEmail("");
        setErrorText(null);
        setIsInvalid(false);
        onSuccess(data.count);
        return;
      }

      if (res.status === 409) {
        setIsInvalid(false);
        setErrorText("You're already on the waitlist!");
        return;
      }

      if ("error" in data && data.error === "Please enter a valid email address.") {
        setIsInvalid(true);
        setErrorText("Please enter a valid email address.");
        return;
      }

      setIsInvalid(false);
      setErrorText("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [email, onSuccess, validateClientSide]);

  if (submitted) {
    return (
      <div className="flex h-[120px] w-full items-center justify-center lg:h-[54px]">
        <span className="text-center text-base font-bold text-white [font-family:'Space_Grotesk-Bold',Helvetica]">
          You&apos;re on the list! 🎉 Check your inbox.
        </span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[605px] lg:relative lg:h-[54px]">
      <form
        className="flex flex-col gap-3 lg:hidden"
        onSubmit={(e) => {
          e.preventDefault();
          void submit();
        }}
      >
        <div
          className={`flex h-[54px] w-full items-center gap-2.5 rounded-[35px] border-[0.3px] border-solid bg-gray-900 px-6 py-2.5 ${borderClass}`}
        >
          <input
            type="email"
            value={email}
            onChange={(e) => {
              if (errorText || isInvalid) clearErrors();
              setEmail(e.target.value);
            }}
            placeholder="you@example.com"
            className="cc-email relative flex w-full items-center border-none bg-transparent text-base font-normal tracking-[0] text-[#8a95b0] outline-none placeholder-[#8a95b0] focus:placeholder-transparent [font-family:'Space_Grotesk-Regular',Helvetica]"
            aria-invalid={isInvalid || undefined}
            disabled={loading}
          />
        </div>

        {errorText ? (
          <p className="px-2 text-sm text-[#FF4444] [font-family:'Space_Grotesk-Regular',Helvetica]">
            {errorText}
          </p>
        ) : null}

        <button
          type="submit"
          className="flex h-[54px] w-full cursor-pointer items-center justify-center gap-2.5 rounded-[35px] bg-[#ffd60a] p-2.5 transition-colors hover:bg-[#e6c109] border-none outline-none"
          disabled={loading}
          aria-busy={loading || undefined}
        >
          {loading ? (
            <span className="flex items-center gap-2 text-[#0a0f1e]">
              <Spinner />
              <span className="text-base font-bold leading-6 tracking-[0] [font-family:'Space_Grotesk-Bold',Helvetica]">
                Get Early Access Free →
              </span>
            </span>
          ) : (
            <p className="relative flex w-fit items-center justify-center whitespace-nowrap text-center text-base font-bold leading-6 tracking-[0] text-[#0a0f1e] [font-family:'Space_Grotesk-Bold',Helvetica]">
              Get Early Access Free →
            </p>
          )}
        </button>
      </form>

      <form
        className="hidden lg:block"
        onSubmit={(e) => {
          e.preventDefault();
          void submit();
        }}
      >
        <button
          type="submit"
          className="absolute left-[365px] top-0 flex h-[54px] w-60 cursor-pointer items-center justify-center gap-2.5 rounded-[35px] bg-[#ffd60a] p-2.5 transition-colors hover:bg-[#e6c109] border-none outline-none"
          disabled={loading}
          aria-busy={loading || undefined}
        >
          {loading ? (
            <span className="flex items-center gap-2 text-[#0a0f1e]">
              <Spinner />
              <span className="text-base font-bold leading-6 tracking-[0] [font-family:'Space_Grotesk-Bold',Helvetica]">
                Get Early Access Free →
              </span>
            </span>
          ) : (
            <p className="relative flex w-fit items-center justify-center whitespace-nowrap text-center text-base font-bold leading-6 tracking-[0] text-[#0a0f1e] [font-family:'Space_Grotesk-Bold',Helvetica]">
              Get Early Access Free →
            </p>
          )}
        </button>

        <div
          className={`absolute left-0 top-0 flex h-[54px] w-[345px] items-center gap-2.5 rounded-[35px] border-[0.3px] border-solid bg-gray-900 px-6 py-2.5 ${borderClass}`}
        >
          <input
            type="email"
            value={email}
            onChange={(e) => {
              if (errorText || isInvalid) clearErrors();
              setEmail(e.target.value);
            }}
            placeholder="you@example.com"
            className="cc-email relative flex w-full items-center border-none bg-transparent text-base font-normal tracking-[0] text-[#8a95b0] outline-none placeholder-[#8a95b0] focus:placeholder-transparent [font-family:'Space_Grotesk-Regular',Helvetica]"
            aria-invalid={isInvalid || undefined}
            disabled={loading}
          />
        </div>

        {errorText ? (
          <p className="absolute left-0 top-[62px] px-2 text-sm text-[#FF4444] [font-family:'Space_Grotesk-Regular',Helvetica]">
            {errorText}
          </p>
        ) : null}
      </form>
    </div>
  );
}
