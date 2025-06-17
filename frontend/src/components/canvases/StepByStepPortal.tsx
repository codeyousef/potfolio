import React from 'react'

interface StepByStepPortalProps {
  language?: 'en' | 'ar'
}

const StepByStepPortal: React.FC<StepByStepPortalProps> = ({ language = 'en' }) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: '#000000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}
    >
      {/* Realistic 3D Glass Frame */}
      <div
        style={{
          width: '600px',
          height: '400px',
          position: 'relative',
          transform: 'perspective(2000px) rotateX(8deg) rotateY(-2deg)',
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Glass Front Surface */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `
              radial-gradient(ellipse at 30% 30%, 
                rgba(255, 255, 255, 0.4) 0%,
                rgba(255, 255, 255, 0.1) 30%,
                rgba(255, 255, 255, 0.05) 60%,
                transparent 100%
              ),
              linear-gradient(135deg,
                transparent 0%,
                rgba(255, 255, 255, 0.1) 25%,
                rgba(255, 255, 255, 0.05) 50%,
                transparent 75%
              )
            `,
            borderRadius: '12px',
            backdropFilter: 'blur(20px) brightness(1.1) contrast(1.2)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderTopColor: 'rgba(255, 255, 255, 0.6)',
            borderLeftColor: 'rgba(255, 255, 255, 0.4)',
            borderRightColor: 'rgba(255, 255, 255, 0.1)',
            borderBottomColor: 'rgba(255, 255, 255, 0.1)',
            boxShadow: `
              0 25px 45px rgba(0, 0, 0, 0.4),
              0 8px 20px rgba(0, 0, 0, 0.3),
              0 2px 6px rgba(0, 0, 0, 0.2),
              inset 0 2px 1px rgba(255, 255, 255, 0.8),
              inset 0 -2px 1px rgba(0, 0, 0, 0.1),
              inset 2px 0 1px rgba(255, 255, 255, 0.4),
              inset -2px 0 1px rgba(0, 0, 0, 0.05)
            `,
            overflow: 'hidden'
          }}
        >
          {/* Fresnel reflection effect */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '60%',
              background: `
                linear-gradient(180deg,
                  rgba(255, 255, 255, 0.3) 0%,
                  rgba(255, 255, 255, 0.15) 30%,
                  rgba(255, 255, 255, 0.08) 60%,
                  transparent 100%
                )
              `,
              borderRadius: '12px 12px 0 0',
              transform: 'skewY(-2deg)',
              transformOrigin: 'top left'
            }}
          />
          
          {/* Caustic light patterns */}
          <div
            style={{
              position: 'absolute',
              top: '20%',
              left: '15%',
              width: '200px',
              height: '100px',
              background: `
                radial-gradient(ellipse,
                  rgba(255, 255, 255, 0.4) 0%,
                  rgba(255, 255, 255, 0.2) 40%,
                  transparent 70%
                )
              `,
              borderRadius: '50%',
              filter: 'blur(8px)',
              transform: 'rotate(-15deg) scale(1.2, 0.6)',
              opacity: 0.6
            }}
          />
          
          {/* Secondary reflection */}
          <div
            style={{
              position: 'absolute',
              bottom: '10%',
              right: '20%',
              width: '120px',
              height: '80px',
              background: `
                radial-gradient(ellipse,
                  rgba(255, 255, 255, 0.3) 0%,
                  rgba(255, 255, 255, 0.1) 50%,
                  transparent 80%
                )
              `,
              borderRadius: '50%',
              filter: 'blur(6px)',
              transform: 'rotate(25deg) scale(0.8, 1.4)',
              opacity: 0.4
            }}
          />
        </div>

        {/* Glass Thickness - Top */}
        <div
          style={{
            position: 'absolute',
            top: '-40px',
            left: '2px',
            right: '2px',
            height: '40px',
            background: `
              linear-gradient(180deg,
                rgba(255, 255, 255, 0.15) 0%,
                rgba(255, 255, 255, 0.1) 30%,
                rgba(255, 255, 255, 0.08) 60%,
                rgba(255, 255, 255, 0.05) 100%
              )
            `,
            borderRadius: '12px 12px 2px 2px',
            transform: 'rotateX(85deg)',
            transformOrigin: 'bottom center',
            backdropFilter: 'blur(15px) brightness(1.05)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderBottom: 'none',
            boxShadow: `
              0 6px 20px rgba(0, 0, 0, 0.25),
              inset 0 2px 0 rgba(255, 255, 255, 0.5),
              inset 0 -1px 0 rgba(0, 0, 0, 0.1)
            `
          }}
        />

        {/* Glass Thickness - Right */}
        <div
          style={{
            position: 'absolute',
            right: '-40px',
            top: '2px',
            bottom: '2px',
            width: '40px',
            background: `
              linear-gradient(270deg,
                rgba(255, 255, 255, 0.12) 0%,
                rgba(255, 255, 255, 0.08) 30%,
                rgba(255, 255, 255, 0.06) 60%,
                rgba(255, 255, 255, 0.04) 100%
              )
            `,
            borderRadius: '2px 12px 12px 2px',
            transform: 'rotateY(-85deg)',
            transformOrigin: 'left center',
            backdropFilter: 'blur(15px) brightness(0.95)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderLeft: 'none',
            boxShadow: `
              -6px 0 20px rgba(0, 0, 0, 0.3),
              inset -2px 0 0 rgba(255, 255, 255, 0.3),
              inset 1px 0 0 rgba(0, 0, 0, 0.1)
            `
          }}
        />

        {/* Glass Thickness - Bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: '-40px',
            left: '2px',
            right: '2px',
            height: '40px',
            background: `
              linear-gradient(0deg,
                rgba(255, 255, 255, 0.08) 0%,
                rgba(255, 255, 255, 0.06) 30%,
                rgba(255, 255, 255, 0.05) 60%,
                rgba(255, 255, 255, 0.04) 100%
              )
            `,
            borderRadius: '2px 2px 12px 12px',
            transform: 'rotateX(-85deg)',
            transformOrigin: 'top center',
            backdropFilter: 'blur(15px) brightness(0.9)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderTop: 'none',
            boxShadow: `
              0 -6px 20px rgba(0, 0, 0, 0.35),
              inset 0 -2px 0 rgba(255, 255, 255, 0.2),
              inset 0 1px 0 rgba(0, 0, 0, 0.15)
            `
          }}
        />

        {/* Glass Thickness - Left */}
        <div
          style={{
            position: 'absolute',
            left: '-40px',
            top: '2px',
            bottom: '2px',
            width: '40px',
            background: `
              linear-gradient(90deg,
                rgba(255, 255, 255, 0.1) 0%,
                rgba(255, 255, 255, 0.07) 30%,
                rgba(255, 255, 255, 0.05) 60%,
                rgba(255, 255, 255, 0.04) 100%
              )
            `,
            borderRadius: '12px 2px 2px 12px',
            transform: 'rotateY(85deg)',
            transformOrigin: 'right center',
            backdropFilter: 'blur(15px) brightness(1.02)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            borderRight: 'none',
            boxShadow: `
              6px 0 20px rgba(0, 0, 0, 0.25),
              inset 2px 0 0 rgba(255, 255, 255, 0.4),
              inset -1px 0 0 rgba(0, 0, 0, 0.08)
            `
          }}
        />

        {/* Interior space - completely transparent */}
        <div
          style={{
            position: 'absolute',
            top: '60px',
            left: '60px',
            right: '60px',
            bottom: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '16px',
            textAlign: 'center',
            fontWeight: '400',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
            background: 'transparent'
          }}
        >
          Step 1: Realistic Glass Frame
        </div>
      </div>

      {/* Exit Control */}
      <button
        onClick={() => window.location.href = window.location.pathname}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          padding: '10px 20px',
          background: 'rgba(255,107,107,0.2)',
          border: '1px solid rgba(255,107,107,0.5)',
          borderRadius: '20px',
          color: '#FFFFFF',
          fontSize: '14px',
          cursor: 'pointer',
          backdropFilter: 'blur(10px)'
        }}
      >
        ← Exit
      </button>
    </div>
  )
}

export default StepByStepPortal