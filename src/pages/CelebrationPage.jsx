import { useEffect, useRef, useState } from 'react'
import LoveNotesBoard, { INSTAGRAM_POST_COUNT } from './LoveNotesBoard.jsx'

const DOG_FETCH_LOTTIE_SRC =
  'https://lottie.host/d5276957-ebfc-4e5c-bc34-e2d1e626d174/n1UOqclfHy.lottie'
const RUNNING_DOG_LOTTIE_SRC =
  'https://lottie.host/3dd3c1ec-40f3-4b82-ba68-80efa2c09c77/vhiToPZ9sQ.lottie'
const DOG_FETCH_REVEAL_DELAY = 2200
const CHASE_RUN_DURATION = 2200
const CHASE_RESTART_DELAY = 320

function CelebrationPage() {
  const [clickCount, setClickCount] = useState(0)
  const [scene, setScene] = useState('envelope')
  const [currentInstagramIndex, setCurrentInstagramIndex] = useState(0)
  const [isShowingChaseCard, setIsShowingChaseCard] = useState(false)
  const [chaseRunCycle, setChaseRunCycle] = useState(0)
  const timeoutRef = useRef([])

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
      timeoutRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId))
    }
  }, [])

  const registerTimeout = (callback, delay) => {
    const timeoutId = window.setTimeout(callback, delay)
    timeoutRef.current.push(timeoutId)
  }

  const startChaseSequence = () => {
    setScene('chasing')
    setCurrentInstagramIndex(0)
    setIsShowingChaseCard(false)
    setChaseRunCycle(1)
    registerTimeout(() => {
      setIsShowingChaseCard(true)
    }, CHASE_RUN_DURATION)
  }

  const handleChaseCardClose = () => {
    if (scene !== 'chasing' || !isShowingChaseCard) {
      return
    }

    if (currentInstagramIndex >= INSTAGRAM_POST_COUNT - 1) {
      setScene('revealed')
      return
    }

    const nextIndex = currentInstagramIndex + 1
    setCurrentInstagramIndex(nextIndex)
    setIsShowingChaseCard(false)

    registerTimeout(() => {
      setChaseRunCycle((current) => current + 1)
    }, CHASE_RESTART_DELAY)

    registerTimeout(() => {
      setIsShowingChaseCard(true)
    }, CHASE_RESTART_DELAY + CHASE_RUN_DURATION)
  }

  const handleLetterClick = () => {
    if (scene !== 'envelope') {
      return
    }

    if (clickCount < 1) {
      setClickCount((current) => current + 1)
      return
    }

    setScene('fetching')
    registerTimeout(() => {
      setScene('lost')
    }, DOG_FETCH_REVEAL_DELAY)
  }

  const handleLostLetterScreenClick = () => {
    if (scene === 'lost') {
      setScene('prompt')
      return
    }

    if (scene === 'prompt') {
      startChaseSequence()
    }
  }

  const isOpened = clickCount >= 1
  const isFetchingLetter = scene === 'fetching'
  const showLostLetterMessage = scene === 'lost' || scene === 'prompt'
  const isChasing = scene === 'chasing'
  const isLoveRevealed = scene === 'revealed'
  const chaseVisibleInstagramCount = isShowingChaseCard ? 1 : 0

  return (
    <div
      className={`letter-page${isLoveRevealed ? ' love-revealed' : ''}${isFetchingLetter ? ' is-fetching' : ''}`}
    >
      {isChasing || isLoveRevealed ? (
        <LoveNotesBoard
          visibleInstagramCount={isLoveRevealed ? INSTAGRAM_POST_COUNT : chaseVisibleInstagramCount}
          isDropSequence={isChasing && isShowingChaseCard}
          showHeart={!isChasing}
          layoutVariant={isChasing ? 'chase' : 'default'}
          isInteractive={!isChasing}
          currentInstagramIndex={isChasing ? currentInstagramIndex : null}
          onInstagramClose={handleChaseCardClose}
        />
      ) : null}

      {showLostLetterMessage ? (
        <button
          type="button"
          className="lost-letter-screen"
          onClick={handleLostLetterScreenClick}
        >
          <p className="liquid-copy lost-letter-copy">
            {scene === 'prompt' ? '서둘러서 쫒아요!!' : '이런! 편지지를 가져갔어요!'}
          </p>
        </button>
      ) : null}

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

      {isChasing ? (
        <div className="chase-overlay" aria-hidden="true">
          {!isShowingChaseCard ? (
            <div key={chaseRunCycle} className="chase-running-dog">
              <div className="chase-running-dog-inner">
                <dotlottie-wc
                  src={RUNNING_DOG_LOTTIE_SRC}
                  autoplay
                  loop
                  style={{ width: '320px', height: '320px' }}
                />
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {scene === 'envelope' || isFetchingLetter ? (
        <button
          type="button"
          className={`letter-image${isOpened || isFetchingLetter ? ' opened' : ''}${isFetchingLetter ? ' is-fetching' : ''}`}
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
      ) : null}

      {scene === 'envelope' ? (
        <p className="liquid-copy letter-prompt">
          {isOpened ? '편지지를 꺼내볼까요?' : '우와! 편지네요!? 확인해볼까요?'}
        </p>
      ) : null}
    </div>
  )
}

export default CelebrationPage
