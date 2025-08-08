import * as React from "react"

export function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Rotating conic gradient (ChatGPT-like) */}
      <div className="gradient-conic" />

      {/* Floating radial orbs */}
      <div className="orb orb-top-right" />
      <div className="orb orb-bottom-left" />

      {/* Subtle grid overlay */}
      <div className="grid-overlay" />
    </div>
  )
}
