import { useEffect, useRef, useState } from 'react'

function createInstagramPaper(id, permalink, title, x, y, rotation, z) {
  return {
    id,
    kind: 'instagram',
    title,
    permalink,
    caption: title,
    x,
    y,
    rotation,
    z,
  }
}

const instagramPosts = [
  'https://www.instagram.com/p/DXzb1JLk8A0/',
  'https://www.instagram.com/p/DXRz3jUk0TG/',
  'https://www.instagram.com/p/DXCeWxQE6PB/',
  'https://www.instagram.com/p/DVU3jQBk5dr/',
  'https://www.instagram.com/p/DUxOQhyk2BC/',
  'https://www.instagram.com/p/DTZdFRek51k/',
  'https://www.instagram.com/p/DTVHV_gE-yR/',
  'https://www.instagram.com/p/DR2KNMCkyoh/',
  'https://www.instagram.com/p/DRVpQIIE2n8/',
  'https://www.instagram.com/p/DQ1maiLkwAn/',
]

export const INSTAGRAM_POST_COUNT = instagramPosts.length

function createStackedInstagramPapers(mode) {
  const baseX = mode === 'mobile' ? 0 : 120
  const baseY = mode === 'mobile' ? -8 : 8
  const xOffsets =
    mode === 'mobile' ? [0, 8, -6, 10, -8, 6, -4, 8, -6, 4] : [0, 18, -14, 22, -18, 16, -10, 14, -12, 10]
  const yOffsets =
    mode === 'mobile' ? [0, 10, 20, 30, 40, 50, 60, 70, 80, 90] : [0, 12, 24, 36, 48, 60, 72, 84, 96, 108]
  const rotations =
    mode === 'mobile' ? [-2, 3, -3, 2, -2, 3, -3, 2, -2, 2] : [-3, 4, -4, 3, -3, 4, -4, 3, -3, 2]

  return instagramPosts.map((permalink, index) =>
    createInstagramPaper(
      `post-${index + 1}`,
      permalink,
      `Instagram Post ${index + 1}`,
      baseX + xOffsets[index],
      baseY + yOffsets[index],
      rotations[index],
      20 - index,
    ),
  )
}

function createChaseInstagramPapers(mode) {
  const baseX = 0
  const baseY = mode === 'mobile' ? -86 : -76
  const xOffsets =
    mode === 'mobile' ? [0, 6, -6, 8, -8, 10, -10, 8, -8, 6] : [0, 10, -10, 14, -14, 18, -18, 14, -14, 10]
  const yOffsets =
    mode === 'mobile' ? [0, 18, 36, 54, 72, 90, 108, 126, 144, 162] : [0, 20, 40, 60, 80, 100, 120, 140, 160, 180]
  const rotations =
    mode === 'mobile' ? [-2, 2, -2, 2, -2, 2, -2, 2, -2, 2] : [-3, 3, -3, 3, -3, 3, -3, 3, -3, 3]

  return instagramPosts.map((permalink, index) =>
    createInstagramPaper(
      `post-${index + 1}`,
      permalink,
      `Instagram Post ${index + 1}`,
      baseX + xOffsets[index],
      baseY + yOffsets[index],
      rotations[index],
      20 - index,
    ),
  )
}

function getPapersForMode(
  mode,
  visibleInstagramCount = INSTAGRAM_POST_COUNT,
  {
    showHeart = true,
    layoutVariant = 'default',
    currentInstagramIndex = null,
  } = {},
) {
  const allInstagramPapers =
    layoutVariant === 'chase'
      ? createChaseInstagramPapers(mode)
      : createStackedInstagramPapers(mode)
  const instagramPapers =
    layoutVariant === 'chase' && currentInstagramIndex !== null
      ? allInstagramPapers
          .slice(currentInstagramIndex, currentInstagramIndex + 1)
          .map((paper) => ({ ...paper, z: 20 }))
      : allInstagramPapers
  const heartPaper =
    mode === 'mobile'
      ? {
          id: 'heart',
          kind: 'heart',
          x: 0,
          y: -170,
          rotation: -6,
          z: 3,
        }
      : {
          id: 'heart',
          kind: 'heart',
          x: -220,
          y: -96,
          rotation: -8,
          z: 3,
        }

  return [
    ...(showHeart ? [heartPaper] : []),
    ...instagramPapers.slice(0, visibleInstagramCount),
  ]
}

function getInitialPapers(
  visibleInstagramCount = INSTAGRAM_POST_COUNT,
  options = {},
) {
  if (typeof window !== 'undefined' && window.innerWidth <= 768) {
    return getPapersForMode('mobile', visibleInstagramCount, options)
  }

  return getPapersForMode('desktop', visibleInstagramCount, options)
}

function mergePapers(current, next) {
  return next.map((paper) => {
    const existing = current.find((item) => item.id === paper.id)

    return existing
      ? {
          ...paper,
          x: existing.x,
          y: existing.y,
          rotation: existing.rotation,
          z: existing.z,
        }
      : paper
  })
}

function LoveNotesBoard({
  visibleInstagramCount = INSTAGRAM_POST_COUNT,
  isDropSequence = false,
  showHeart = true,
  layoutVariant = 'default',
  isInteractive = true,
  currentInstagramIndex = null,
  onInstagramClose,
}) {
  const [papers, setPapers] = useState(() =>
    getInitialPapers(visibleInstagramCount, { showHeart, layoutVariant, currentInstagramIndex }),
  )
  const [isMusicOn, setIsMusicOn] = useState(false)
  const nextZRef = useRef(20)
  const dragRef = useRef(null)
  const audioRef = useRef(null)
  const layoutModeRef = useRef(typeof window !== 'undefined' && window.innerWidth <= 768 ? 'mobile' : 'desktop')

  useEffect(() => {
    const handleResize = () => {
      const nextMode = window.innerWidth <= 768 ? 'mobile' : 'desktop'

      if (nextMode === layoutModeRef.current) {
        return
      }

      layoutModeRef.current = nextMode
      setPapers((current) =>
        mergePapers(
          current,
          getPapersForMode(nextMode, visibleInstagramCount, {
            showHeart,
            layoutVariant,
            currentInstagramIndex,
          }),
        ),
      )
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [currentInstagramIndex, layoutVariant, showHeart, visibleInstagramCount])

  useEffect(() => {
    setPapers((current) =>
      mergePapers(
        current,
        getPapersForMode(layoutModeRef.current, visibleInstagramCount, {
          showHeart,
          layoutVariant,
          currentInstagramIndex,
        }),
      ),
    )
  }, [currentInstagramIndex, layoutVariant, showHeart, visibleInstagramCount])

  useEffect(() => {
    const existingScript = document.querySelector('script[data-instgrm-script]')

    if (!existingScript) {
      const script = document.createElement('script')
      script.async = true
      script.src = 'https://www.instagram.com/embed.js'
      script.setAttribute('data-instgrm-script', 'true')
      script.onload = () => {
        window.instgrm?.Embeds?.process()
      }
      document.body.appendChild(script)
      return
    }

    window.instgrm?.Embeds?.process()
  }, [papers])

  const beginDrag = (event, id) => {
    if (!isInteractive) {
      return
    }

    if (event.button !== 0) {
      return
    }

    event.preventDefault()
    const paper = papers.find((item) => item.id === id)

    if (!paper) {
      return
    }

    const newZ = nextZRef.current
    nextZRef.current += 1

    setPapers((current) =>
      current.map((item) => (item.id === id ? { ...item, z: newZ } : item)),
    )

    dragRef.current = {
      id,
      startX: event.clientX,
      startY: event.clientY,
      originX: paper.x,
      originY: paper.y,
    }
  }

  const handlePointerMove = (event) => {
    if (!isInteractive) {
      return
    }

    if (!dragRef.current) {
      return
    }

    const { id, startX, startY, originX, originY } = dragRef.current
    const deltaX = event.clientX - startX
    const deltaY = event.clientY - startY

    setPapers((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, x: originX + deltaX, y: originY + deltaY }
          : item,
      ),
    )
  }

  const stopDrag = () => {
    dragRef.current = null
  }

  const closePaper = (event, id) => {
    event.stopPropagation()
    event.preventDefault()

    if (layoutVariant === 'chase' && onInstagramClose) {
      onInstagramClose(id)
      return
    }

    if (!isInteractive) {
      return
    }

    setPapers((current) => current.filter((item) => item.id !== id))
  }

  const rotatePaper = (event, id) => {
    if (!isInteractive) {
      return
    }

    event.preventDefault()

    const newZ = nextZRef.current
    nextZRef.current += 1

    setPapers((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, rotation: item.rotation + 15, z: newZ }
          : item,
      ),
    )
  }

  const toggleMusic = async () => {
    if (!audioRef.current) {
      return
    }

    if (isMusicOn) {
      audioRef.current.pause()
      setIsMusicOn(false)
      return
    }

    try {
      await audioRef.current.play()
      setIsMusicOn(true)
    } catch {
      setIsMusicOn(false)
    }
  }

  return (
    <div
      className={`notes-board${layoutVariant === 'chase' ? ' is-chasing' : ''}`}
      onPointerMove={handlePointerMove}
      onPointerUp={stopDrag}
      onPointerLeave={stopDrag}
    >
      <div className="notes-floating-hearts" aria-hidden="true">
        <div className="notes-shape-heart heart1" />
        <div className="notes-shape-heart heart2" />
        <div className="notes-shape-heart heart3" />
        <div className="notes-shape-heart heart4" />
        <div className="notes-shape-heart heart5" />
      </div>

      {papers.map((paper) => (
        <button
          key={paper.id}
          type="button"
          className={`note-paper note-${paper.kind}${isDropSequence && paper.kind === 'instagram' ? ' is-dropping' : ''}`}
          style={{
            transform: `translate(-50%, -50%) translate(${paper.x}px, ${paper.y}px) rotate(${paper.rotation}deg)`,
            zIndex: paper.z,
          }}
          onPointerDown={(event) => beginDrag(event, paper.id)}
          onContextMenu={(event) => rotatePaper(event, paper.id)}
        >
          {paper.kind === 'instagram' ? (
            <button
              type="button"
              className="note-close-button"
              onClick={(event) => closePaper(event, paper.id)}
              onPointerDown={(event) => event.stopPropagation()}
              aria-label="Close Instagram card"
            >
              ×
            </button>
          ) : null}

          {paper.kind === 'heart' ? (
            <div className="note-heart-content">
              <div className="note-main-heart">♥</div>
              <p className="note-heart-text">닫거나 치우면서 보기</p>
            </div>
          ) : (
            <>
              <div className="note-paper-header">
                <span className="note-pin">
                  {paper.kind === 'special' ? '★' : '📌'}
                </span>
                <span className={`note-paper-title${paper.kind === 'special' ? ' special' : ''}`}>
                  {paper.title}
                </span>
              </div>

              {paper.kind === 'image' ? (
                <>
                  <p className="note-handwriting">{paper.lines[0]}</p>
                  <p className="note-handwriting note-highlight">{paper.lines[1]}</p>
                  <div className="note-image-frame">
                    <img src={paper.image} alt={paper.title} />
                    <span className="note-image-badge">♥</span>
                  </div>
                </>
              ) : null}

              {paper.kind === 'instagram' ? (
                <div className="note-instagram-embed">
                  <blockquote
                    className="instagram-media"
                    data-instgrm-captioned=""
                    data-instgrm-permalink={`${paper.permalink}?utm_source=ig_embed&utm_campaign=loading`}
                    data-instgrm-version="14"
                  >
                    <a
                      href={`${paper.permalink}?utm_source=ig_embed&utm_campaign=loading`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {paper.caption}
                    </a>
                  </blockquote>
                </div>
              ) : null}

              {paper.kind === 'special' ? (
                <>
                  <p className="note-handwriting-large">{paper.lines[0]}</p>
                  <p className="note-handwriting-large note-highlight">{paper.lines[1]}</p>
                  <div className="note-decorative-border" />
                </>
              ) : null}

              {paper.kind === 'compliment' ? (
                <>
                  <p className="note-handwriting">{paper.lines[0]}</p>
                  <p className="note-handwriting">{paper.lines[1]}</p>
                  <p className="note-handwriting note-love-text">{paper.lines[2]}</p>
                  <div className="note-stickers">
                    <span>⭐</span>
                    <span>💫</span>
                    <span>✨</span>
                  </div>
                </>
              ) : null}

              {paper.kind === 'instruction' ? (
                <>
                  <p className="note-handwriting">💡 {paper.lines[0]}</p>
                  <p className="note-handwriting">{paper.lines[1]}</p>
                  <div className="note-demo-cursor">➜</div>
                </>
              ) : null}
            </>
          )}
        </button>
      ))}

      {isInteractive ? (
        <>
          <button type="button" className="notes-music-toggle" onClick={toggleMusic}>
            {isMusicOn ? '♫' : '♪'}
          </button>

          <audio ref={audioRef} loop>
            <source
              src="https://alsocreative.github.io/love-notes-interactive/assets/music.mp3"
              type="audio/mpeg"
            />
          </audio>
        </>
      ) : null}
    </div>
  )
}

export default LoveNotesBoard
