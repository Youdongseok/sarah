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

function createInstagramPaperList(mode, variant) {
  const isMobile = mode === 'mobile'

  const baseX = variant === 'chase' ? 0 : isMobile ? 0 : 120

  const baseY =
    variant === 'chase'
      ? isMobile
        ? -92
        : -88
      : isMobile
        ? -8
        : 8

  const xOffsets =
    variant === 'chase'
      ? isMobile
        ? [0, 10, -10, 12, -12, 14, -14, 12, -12, 8]
        : [0, 18, -18, 24, -24, 30, -30, 24, -24, 16]
      : isMobile
        ? [0, 8, -6, 10, -8, 6, -4, 8, -6, 4]
        : [0, 18, -14, 22, -18, 16, -10, 14, -12, 10]

  const yOffsets =
    variant === 'chase'
      ? isMobile
        ? [0, 22, 44, 66, 88, 110, 132, 154, 176, 198]
        : [0, 26, 52, 78, 104, 130, 156, 182, 208, 234]
      : isMobile
        ? [0, 10, 20, 30, 40, 50, 60, 70, 80, 90]
        : [0, 12, 24, 36, 48, 60, 72, 84, 96, 108]

  const rotations =
    variant === 'chase'
      ? isMobile
        ? [-1.5, 1.5, -1.5, 1.5, -1.5, 1.5, -1.5, 1.5, -1.5, 1.5]
        : [-2.5, 2.5, -2.5, 2.5, -2.5, 2.5, -2.5, 2.5, -2.5, 2.5]
      : isMobile
        ? [-2, 3, -3, 2, -2, 3, -3, 2, -2, 2]
        : [-3, 4, -4, 3, -3, 4, -4, 3, -3, 2]

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
  const allInstagramPapers = createInstagramPaperList(
    mode,
    layoutVariant === 'chase' ? 'chase' : 'default',
  )

  const instagramPapers =
    layoutVariant === 'chase' && currentInstagramIndex !== null
      ? allInstagramPapers
          .slice(
            currentInstagramIndex,
            currentInstagramIndex + visibleInstagramCount,
          )
          .map((paper, index) => ({
            ...paper,
            z: 20 - index,
          }))
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
  hiddenPaperIds = [],
  isDropSequence = false,
  showHeart = true,
  layoutVariant = 'default',
  isInteractive = true,
  currentInstagramIndex = null,
  onInstagramClose,
}) {
  const [papers, setPapers] = useState(() =>
    getInitialPapers(visibleInstagramCount, {
      showHeart,
      layoutVariant,
      currentInstagramIndex,
    }),
  )

  const nextZRef = useRef(20)
  const dragRef = useRef(null)
  const layoutModeRef = useRef(
    typeof window !== 'undefined' && window.innerWidth <= 768
      ? 'mobile'
      : 'desktop',
  )

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
    if (visibleInstagramCount <= 0) {
      return undefined
    }

    let timeoutId

    const processInstagramEmbeds = () => {
      timeoutId = window.setTimeout(() => {
        window.instgrm?.Embeds?.process()
      }, 120)
    }

    const existingScript = document.querySelector('script[data-instgrm-script]')

    if (!existingScript) {
      const script = document.createElement('script')
      script.async = true
      script.defer = true
      script.src = 'https://www.instagram.com/embed.js'
      script.setAttribute('data-instgrm-script', 'true')
      script.onload = processInstagramEmbeds
      document.body.appendChild(script)

      return () => {
        if (timeoutId) {
          window.clearTimeout(timeoutId)
        }
      }
    }

    processInstagramEmbeds()

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId)
      }
    }
  }, [visibleInstagramCount, currentInstagramIndex, layoutVariant])

  const beginDrag = (event, id) => {
    if (!isInteractive) {
      return
    }

    if (event.button !== 0) {
      return
    }

    const paper = papers.find((item) => item.id === id)

    if (!paper) {
      return
    }

    event.preventDefault()
    event.stopPropagation()

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

  const visiblePapers = papers.filter(
    (paper) => !hiddenPaperIds.includes(paper.id),
  )

  const visibleInstagramPapers = visiblePapers.filter(
    (paper) => paper.kind === 'instagram',
  )

  const closeTopInstagramPaper = (event) => {
    if (layoutVariant !== 'chase') {
      return
    }

    if (!onInstagramClose) {
      return
    }

    if (visibleInstagramPapers.length <= 0) {
      return
    }

    const topPaper = [...visibleInstagramPapers].sort((a, b) => b.z - a.z)[0]

    closePaper(event, topPaper.id)
  }

  const handleBoardClick = (event) => {
    const clickedInsidePaper = event.target.closest('.note-paper')

    if (clickedInsidePaper) {
      return
    }

    closeTopInstagramPaper(event)
  }

  const handlePaperClick = (event) => {
    event.stopPropagation()
  }

  return (
    <div
      className={`notes-board${layoutVariant === 'chase' ? ' is-chasing' : ''}`}
      onClick={handleBoardClick}
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

      {visiblePapers.map((paper) => (
        <div
          key={paper.id}
          role="button"
          tabIndex={0}
          className={`note-paper note-${paper.kind}${
            isDropSequence && paper.kind === 'instagram' ? ' is-dropping' : ''
          }`}
          style={{
            transform: `translate(-50%, -50%) translate(${paper.x}px, ${paper.y}px) rotate(${paper.rotation}deg)`,
            zIndex: paper.z,
          }}
          onClick={handlePaperClick}
          onPointerDown={(event) => beginDrag(event, paper.id)}
          onContextMenu={(event) => rotatePaper(event, paper.id)}
        >
          {paper.kind === 'instagram' ? (
            <button
              type="button"
              className="note-instagram-close-button"
              onClick={(event) => closePaper(event, paper.id)}
              onPointerDown={(event) => event.stopPropagation()}
              aria-label="인스타그램 카드 닫기"
            >
              닫기
            </button>
          ) : null}

          {paper.kind === 'heart' ? (
            <div className="note-heart-content">
              <div className="note-main-heart">♥</div>
              <p className="note-heart-text">닫거나 치우면서 보기</p>
            </div>
          ) : (
            <>
              {paper.kind !== 'instagram' ? (
                <div className="note-paper-header">
                  <span className="note-pin">
                    {paper.kind === 'special' ? '★' : '📌'}
                  </span>
                  <span
                    className={`note-paper-title${
                      paper.kind === 'special' ? ' special' : ''
                    }`}
                  >
                    {paper.title}
                  </span>
                </div>
              ) : null}

              {paper.kind === 'image' ? (
                <>
                  <p className="note-handwriting">{paper.lines[0]}</p>
                  <p className="note-handwriting note-highlight">
                    {paper.lines[1]}
                  </p>
                  <div className="note-image-frame">
                    <img src={paper.image} alt={paper.title} />
                    <span className="note-image-badge">♥</span>
                  </div>
                </>
              ) : null}

              {paper.kind === 'instagram' ? (
                <div className="note-instagram-embed">
                  <blockquote
                    key={paper.permalink}
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
                  <p className="note-handwriting-large note-highlight">
                    {paper.lines[1]}
                  </p>
                  <div className="note-decorative-border" />
                </>
              ) : null}

              {paper.kind === 'compliment' ? (
                <>
                  <p className="note-handwriting">{paper.lines[0]}</p>
                  <p className="note-handwriting">{paper.lines[1]}</p>
                  <p className="note-handwriting note-love-text">
                    {paper.lines[2]}
                  </p>
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
        </div>
      ))}
    </div>
  )
}

export default LoveNotesBoard