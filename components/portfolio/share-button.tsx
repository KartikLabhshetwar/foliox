"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { FaShare, FaCopy, FaCheck, FaSpinner } from "react-icons/fa"

interface ShareButtonProps {
  username: string
}

export function ShareButton({ username }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)
  const [open, setOpen] = useState(false)
  const [canShare, setCanShare] = useState(false)
  const [portfolioUrl, setPortfolioUrl] = useState(`/${username}`)
  const [customSlug, setCustomSlug] = useState("")
  const [isChecking, setIsChecking] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [availabilityStatus, setAvailabilityStatus] = useState<"idle" | "available" | "taken" | "checking">("idle")
  const [registeredSlug, setRegisteredSlug] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const baseUrl = window.location.origin
      if (registeredSlug) {
        setPortfolioUrl(`${baseUrl}/${registeredSlug}`)
      } else {
        setPortfolioUrl(`${baseUrl}/${username}`)
      }
      setCanShare(typeof navigator !== 'undefined' && 'share' in navigator)
    }
  }, [username, registeredSlug])

  const checkAvailability = useCallback(async (slug: string) => {
    if (!slug || slug.length < 3) {
      setAvailabilityStatus("idle")
      setValidationError(null)
      return
    }

    setIsChecking(true)
    setValidationError(null)

    try {
      const response = await fetch('/api/custom-url/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      })

      const data = await response.json()

      if (response.ok) {
        if (data.available) {
          setAvailabilityStatus("available")
          setValidationError(null)
        } else {
          setAvailabilityStatus("taken")
          setValidationError(data.error || "This custom URL is already taken. Please choose another one.")
        }
      } else {
        setAvailabilityStatus("taken")
        setValidationError(data.error || "Invalid custom URL format")
      }
    } catch {
      setAvailabilityStatus("idle")
      setValidationError("Failed to check availability. Please try again.")
    } finally {
      setIsChecking(false)
    }
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (customSlug.trim()) {
        checkAvailability(customSlug.trim())
      } else {
        setAvailabilityStatus("idle")
        setValidationError(null)
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [customSlug, checkAvailability])

  const handleRegister = async () => {
    if (!customSlug.trim() || availabilityStatus !== "available") {
      return
    }

    setIsRegistering(true)
    setValidationError(null)

    try {
      const response = await fetch('/api/custom-url/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customSlug: customSlug.trim(),
          githubUsername: username,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setRegisteredSlug(data.customSlug)
        setValidationError(null)
        setAvailabilityStatus("idle")
      } else {
        setValidationError(data.error || "Failed to register custom URL. Please try again.")
        if (data.error?.includes("already taken")) {
          setAvailabilityStatus("taken")
        }
      }
    } catch {
      setValidationError("Failed to register custom URL. Please try again.")
    } finally {
      setIsRegistering(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(portfolioUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${username}'s Portfolio`,
          text: `Check out ${username}'s developer portfolio`,
          url: portfolioUrl,
        })
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Failed to share:', err)
        }
      }
    } else {
      handleCopy()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <FaShare className="h-4 w-4" />
          <span className="hidden sm:inline">Share</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Share Portfolio</DialogTitle>
          <DialogDescription>
            Create a custom URL or share your portfolio using the link below.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {!registeredSlug && (
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Create Custom URL (Optional)</label>
                <div className="flex gap-2">
                  <div className="flex-1 flex items-center border border-input rounded-md bg-background overflow-hidden focus-within:ring-1 focus-within:ring-ring">
                    <span className="px-3 text-sm text-muted-foreground whitespace-nowrap border-r border-input bg-muted/50 py-2">
                      {typeof window !== 'undefined' ? new URL(window.location.href).origin : ''}/
                    </span>
                    <Input
                      value={customSlug}
                      onChange={(e) => {
                        const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
                        setCustomSlug(value)
                      }}
                      placeholder="your-custom-url"
                      className="border-0 rounded-none focus-visible:ring-0 font-mono text-sm flex-1"
                      disabled={isRegistering}
                    />
                  </div>
                  <Button
                    onClick={handleRegister}
                    disabled={availabilityStatus !== "available" || isRegistering || !customSlug.trim()}
                    className="shrink-0"
                  >
                    {isRegistering ? (
                      <FaSpinner className="h-4 w-4 animate-spin" />
                    ) : (
                      "Create"
                    )}
                  </Button>
                </div>
              </div>
              {isChecking && (
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <FaSpinner className="h-3 w-3 animate-spin" />
                  Checking availability...
                </p>
              )}
              {!isChecking && availabilityStatus === "available" && (
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1.5">
                  <FaCheck className="h-3 w-3" />
                  This URL is available!
                </p>
              )}
              {!isChecking && availabilityStatus === "taken" && (
                <p className="text-xs text-destructive flex items-center gap-1.5">
                  <span>✗</span>
                  {validationError || "This URL is already taken"}
                </p>
              )}
              {validationError && availabilityStatus !== "taken" && availabilityStatus !== "available" && (
                <p className="text-xs text-destructive">{validationError}</p>
              )}
            </div>
          )}
          {registeredSlug && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-sm text-green-700 dark:text-green-300 flex items-start gap-2">
                <FaCheck className="h-4 w-4 mt-0.5 shrink-0" />
                <span>
                  Custom URL created successfully! Your portfolio is now available at{" "}
                  <span className="font-mono font-semibold">/{registeredSlug}</span>
                </span>
              </p>
            </div>
          )}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Your Portfolio URL</label>
            <div className="flex gap-2">
              <Input
                value={portfolioUrl}
                readOnly
                className="font-mono text-sm bg-muted/50"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopy}
                className="shrink-0"
                title="Copy URL"
              >
                {copied ? (
                  <FaCheck className="h-4 w-4 text-green-600" />
                ) : (
                  <FaCopy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            {canShare && (
              <Button onClick={handleShare} className="flex-1 gap-2">
                <FaShare className="h-4 w-4" />
                Share
              </Button>
            )}
            <Button
              variant={canShare ? "outline" : "default"}
              onClick={handleCopy}
              className="flex-1 gap-2"
            >
              {copied ? (
                <>
                  <FaCheck className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <FaCopy className="h-4 w-4" />
                  Copy Link
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center pt-2">
            Anyone with this link can view your portfolio
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
