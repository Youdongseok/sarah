import { useState } from 'react'
import LoveNotesBoard from './LoveNotesBoard.jsx'

function CelebrationPage() {
  const [clickCount, setClickCount] = useState(0)

  const handleLetterClick = () => {
    if (clickCount < 2) {
      setClickCount((current) => current + 1)
    }
  }

  const isOpened = clickCount >= 1
  const isLoveRevealed = clickCount >= 2

  return (
    <div className={`letter-page${isLoveRevealed ? ' love-revealed' : ''}`}>
      {isLoveRevealed ? <LoveNotesBoard /> : null}

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
