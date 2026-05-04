import { useEffect, useRef, useState } from 'react'
import LoveNotesBoard from './LoveNotesBoard.jsx'

const DOG_FETCH_LOTTIE_SRC =
  'https://lottie.host/d5276957-ebfc-4e5c-bc34-e2d1e626d174/n1UOqclfHy.lottie'
const DOG_FETCH_REVEAL_DELAY = 2200

function CelebrationPage() {
  const [clickCount, setClickCount] = useState(0)
  const [isFetchingLetter, setIsFetchingLetter] = useState(false)
  const [isLoveRevealed, setIsLoveRevealed] = useState(false)
  const timeoutRef = useRef(null)

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

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handleLetterClick = () => {
    if (isFetchingLetter || isLoveRevealed) {
      return
    }

    if (clickCount < 1) {
      setClickCount((current) => current + 1)
      return
    }

    setIsFetchingLetter(true)
    timeoutRef.current = window.setTimeout(() => {
      setIsLoveRevealed(true)
    }, DOG_FETCH_REVEAL_DELAY)
  }

  const isOpened = clickCount >= 1

  return (
    <div
      className={`letter-page${isLoveRevealed ? ' love-revealed' : ''}${isFetchingLetter ? ' is-fetching' : ''}`}
    >
      {isLoveRevealed ? <LoveNotesBoard /> : null}

      {isFetchingLetter ? (
        <div className="letter-fetch-overlay" aria-hidden="true">
          <div className="letter-fetch-lottie">
            <dotlottie-wc
              src={DOG_FETCH_LOTTIE_SRC}
              autoplay
              style={{ width: '340px', height: '340px' }}
            />
          </div>
        </div>
      ) : null}

      <button
        type="button"
        className={`letter-image${isOpened ? ' opened' : ''}`}
        onClick={handleLetterClick}
        aria-label="Open love letter"
      >
        <div className="animated-mail">
          <div className="back-fold" />
          <div className="letter">
            <div className="letter-border" />
            <div className="letter-title" />
            <div className="letter-context" />
            <div className="letter-stamp">
              <div className="letter-stamp-inner" />
            </div>
          </div>
          <div className="top-fold" />
          <div className="body-fold" />
          <div className="left-fold" />
        </div>
        <div className="letter-shadow" />
      </button>
    </div>
  )
}

export default CelebrationPage
