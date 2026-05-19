import { useEffect, useRef, useState } from 'react'

import { PawPrint } from 'lucide-react'
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

  const anniversaryLetterPaper =
    mode === 'mobile'
      ? {
          id: 'anniversary-letter',
          kind: 'anniversaryLetter',
          x: 0,
          y: -170,
          rotation: -6,
          z: 3,
        }
      : {
          id: 'anniversary-letter',
          kind: 'anniversaryLetter',
          x: -220,
          y: -96,
          rotation: -8,
          z: 3,
        }

  return [
    ...(showHeart ? [anniversaryLetterPaper] : []),
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

function AnniversaryLetterPage({ onClose }) {
  return (
    <section className="anniversary-letter-page" aria-label="200일 기념 편지">
      <div className="anniversary-letter-bg-hearts" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>

     

      <article className="anniversary-letter-sheet">
        <div className="letter-border" />

        <div className="anniversary-letter-sheet-header">
          
          <h1>200일 기념 편지!!</h1>
          
        </div>

        <div className="anniversary-letter-body">
          <p>사라 안뇽! 나 동동이야! <br />강아지가 편지지 훔쳐가서 놀랐지</p>
          <p>
           그거 알아?<br />
우리 만난 지 벌써 200일이야!!<br />

처음 만났을 때 크게 손 흔들던 것도 생각나고, 같이 빵 나눠 먹었던 것도 생각나.<br />
어느새 손도 잡고, 뽀뽀도 하고, <br />시간이 진짜 빠르게 지나간 것 같아.<br />
그만큼 사라랑 보낸 하루하루가 <br />나한테는 다 너무 소중하고 행복했어.<br />
서로 장난치고 웃었던 날도,<br /> 산책하며 진지한 대화 했던 날도, <br />괜히 삐졌다가 금방 풀었던 날도 <br />전부 다 우리다운 추억인 것 같아. <br />

그래서 인스타에 올린 우리 추억들을 모아봤어! <br />
사라랑 함께한 순간들이 이렇게 많이 쌓였다는 게 너무 좋아!! <br />앞으로 더 많이 쌓아가고 싶어!!!<br />
내가 부족할 때도 있었을 텐데 예쁘게 봐주고, <br />하루하루를 더 특별하게 만들어줘서 고마워.<br />
앞으로도 지금처럼 장난도 많이 치고, <br />서로 챙겨주고, <br />가끔 아웅다웅 하더라도 <br />금방 풀면서 오래오래 예쁘게 만나자.<br />
200일 동안 너무너무 행복했어<br /> 많이많이 사랑해
          </p>
          
        </div>

        <div className="anniversary-letter-footer">
          <span>From. 동동</span>
         <div className="anniversary-letter-stamp cursor-pointer" aria-label="강아지 발바닥 도장">
  <PawPrint
  size={40}
  strokeWidth={2.6}
  color="rgba(216, 166, 33, 0.72)"
  fill="rgba(216, 166, 33, 0.72)"
/>
</div>
        </div>
      </article>
    </section>
  )
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
  const [isAnniversaryLetterOpen, setIsAnniversaryLetterOpen] = useState(false)

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

    if (paper.kind === 'anniversaryLetter') {
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

    const paper = papers.find((item) => item.id === id)

    if (paper?.kind === 'anniversaryLetter') {
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

  const openAnniversaryLetter = (event) => {
    event.stopPropagation()
    event.preventDefault()
    setIsAnniversaryLetterOpen(true)
  }

  const handleAnniversaryLetterKeyDown = (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return
    }

    openAnniversaryLetter(event)
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
    <>
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
            onClick={
              paper.kind === 'anniversaryLetter'
                ? openAnniversaryLetter
                : handlePaperClick
            }
            onKeyDown={
              paper.kind === 'anniversaryLetter'
                ? handleAnniversaryLetterKeyDown
                : undefined
            }
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

            {paper.kind === 'anniversaryLetter' ? (
              <div className="note-anniversary-letter-wrap">
                <div className="letter note-anniversary-letter-paper">
                  <div className="letter-border" />
                  <div className="letter-title" />
                  <div className="letter-context" />
                  <div className="letter-stamp">
                    <div className="letter-stamp-inner" />
                  </div>

                 
                </div>
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

      {isAnniversaryLetterOpen ? (
        <AnniversaryLetterPage
          onClose={() => setIsAnniversaryLetterOpen(false)}
        />
      ) : null}
    </>
  )
}

export default LoveNotesBoard