import { useEffect, useRef, useState } from 'react'
import CelebrationPage from './CelebrationPage.jsx'

const PUMP_LEVELS = [15, 20, 25, 0]
const FILL_LEVELS = [34, 66, 108, 0]
const HEART_BURST_LOTTIE_SRC =
  'https://lottie.host/7ff54620-bc78-4933-9bf1-1d5e027f8272/6wB7uHpBKD.lottie'
const HEART_BURST_REVEAL_DELAY = 1600
const BURST_PARTICLES = Array.from({ length: 20 }, (_, index) => {
  const angle = (Math.PI * 2 * index) / 20
  const distance = 90 + (index % 5) * 18

  return {
    id: index,
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance,
    delay: (index % 4) * 0.03,
  }
})

function LiquidHeartPage() {
  const [counter, setCounter] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isBursting, setIsBursting] = useState(false)
  const [showLetter, setShowLetter] = useState(false)
  const [depth, setDepth] = useState(0)
  const [curveLevel, setCurveLevel] = useState(-10)
  const [curveScale, setCurveScale] = useState(0.5)
  const [tankLevel, setTankLevel] = useState(0)
  const timeoutsRef = useRef([])
  const isFull = tankLevel >= 100
  const copyText = isFull
    ? '한 번 더 누르면 터질 것 같아요!!'
    : tankLevel >= 66
      ? '거의 다 채웠어요!'
      : tankLevel > 0
        ? '더 채울 수 있을 것 같아요!'
        : '하트를 눌러 채워보세요'

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId))
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || customElements.get('dotlottie-wc')) {
      return
    }

    const existingScript = document.querySelector('script[data-dotlottie-wc]')

    if (existingScript) {
      return
    }

    const script = document.createElement('script')
    script.type = 'module'
    script.src = 'https://unpkg.com/@lottiefiles/dotlottie-wc@latest/dist/dotlottie-wc.js'
    script.setAttribute('data-dotlottie-wc', 'true')
    document.body.appendChild(script)
  }, [])

  const pumpHeart = () => {
    if (isAnimating || isBursting || showLetter) {
      return
    }

    if (isFull) {
      setIsBursting(true)

      const letterTimeout = window.setTimeout(() => {
        setShowLetter(true)
      }, HEART_BURST_REVEAL_DELAY)

      timeoutsRef.current.push(letterTimeout)
      return
    }

    const nextDepth = PUMP_LEVELS[counter]
    const nextFillLevel = FILL_LEVELS[counter]
    const nextCounter = (counter + 1) % PUMP_LEVELS.length

    setIsAnimating(true)
    setDepth(nextDepth)
    setCurveLevel(counter === 3 ? -10 : nextFillLevel)
    setCurveScale(1)
    setTankLevel(counter === 3 ? 0 : nextFillLevel)
    setCounter(nextCounter)

    const reverseTimeout = window.setTimeout(() => {
      setCurveScale(0.5)
      setDepth(0)
    }, 600)

    const releaseTimeout = window.setTimeout(() => {
      setIsAnimating(false)
    }, 1100)

    timeoutsRef.current.push(reverseTimeout, releaseTimeout)
  }

  return (
    <main className="liquid-page">
      {showLetter ? (
        <CelebrationPage />
      ) : (
        <div className="liquid-container">
          <button
            type="button"
            className={`heart-wrap${isBursting ? ' is-bursting' : ''}${isFull && !isBursting ? ' is-full' : ''}`}
            onClick={pumpHeart}
          >
            {isBursting ? (
              <>
                <div className="burst-particles" aria-hidden="true">
                  {BURST_PARTICLES.map((particle) => (
                    <span
                      key={particle.id}
                      className="burst-particle"
                      style={{
                        '--tx': `${particle.x}px`,
                        '--ty': `${particle.y}px`,
                        '--delay': `${particle.delay}s`,
                      }}
                    />
                  ))}
                </div>
                <div className="burst-lottie" aria-hidden="true">
                  <dotlottie-wc
                    src={HEART_BURST_LOTTIE_SRC}
                    autoplay
                    style={{ width: '360px', height: '360px' }}
                  />
                </div>
              </>
            ) : null}
            <div
              className="liquid-heart"
              style={{ transform: `translateZ(${depth}px)` }}
            >
              <div className="tank" style={{ height: `${Math.max(tankLevel, 0)}%` }} />
              <svg
                className="curve"
                viewBox="0 24 150 28"
                preserveAspectRatio="none"
                shapeRendering="auto"
                style={{
                  bottom:
                    curveLevel < 0
                      ? `calc(${curveLevel}px - var(--curve-height) * 0.28)`
                      : `calc(${curveLevel}% - var(--curve-height) * 0.42)`,
                  transform: `scaleY(${curveScale})`,
                }}
              >
                <defs>
                  <path
                    id="gentle-wave"
                    d="M-160 44c30 0 58-18 88-18s58 18 88 18 58-18 88-18 58 18 88 18v44h-352z"
                  />
                </defs>
                <g>
                  <use href="#gentle-wave" x="48" y="0" fill="rgba(255, 214, 90, 0.58)" />
                  <use href="#gentle-wave" x="48" y="1" fill="rgba(248, 195, 49, 0.82)" />
                  <use href="#gentle-wave" x="48" y="2" fill="#f5b81f" />
                </g>
              </svg>
            </div>
          </button>
          <p className="liquid-copy">{copyText}</p>
        </div>
      )}

      <svg className="clip-svg" aria-hidden="true" focusable="false">
        <clipPath id="myPath" clipPathUnits="objectBoundingBox">
          <path d="M0.5,0.95 C0.26,0.79,0.08,0.6,0.08,0.34 C0.08,0.16,0.22,0.06,0.36,0.06 C0.45,0.06,0.5,0.14,0.5,0.14 C0.5,0.14,0.55,0.06,0.64,0.06 C0.78,0.06,0.92,0.16,0.92,0.34 C0.92,0.6,0.74,0.79,0.5,0.95 Z" />
        </clipPath>
      </svg>
    </main>
  )
}

export default LiquidHeartPage
