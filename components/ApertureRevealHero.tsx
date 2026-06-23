'use client'

/**
 * ApertureRevealHero — on-load entrance hero with scroll-lock.
 * The picture is painted full-viewport and CSS-scaled DOWN from its centre to a
 * small rest size. A single GSAP timeline opens a centre letterbox aperture,
 * settles the photo from a slow push-in, auto-expands to full-bleed, fades in an
 * ink scrim, then rises the H1 in letter-by-letter. The hero hosts the page-wide
 * Lenis instance and LOCKS scroll from first paint, releasing it on timeline
 * complete. Optional crossfade carousel. Reduced motion = static full-bleed hero.
 */
import gsap from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import Image from 'next/image'
import { useEffect, useLayoutEffect, useRef } from 'react'

import 'lenis/dist/lenis.css'

import styles from './ApertureRevealHero.module.css'

const useIso = typeof window !== 'undefined' ? useLayoutEffect : useEffect

export type HeroImage = { src: string; alt?: string }

type ApertureRevealHeroProps = {
  /** The single H1 — revealed inside the picture once it has grown. */
  title?: string
  /** 1–3 images. Same set feeds the entrance Ken-Burns AND the crossfade carousel. */
  images?: HeroImage[]
  /** Crossfade interval (ms) when more than one image. */
  carouselMs?: number
}

const PLACEHOLDER: HeroImage[] = [{ src: 'https://picsum.photos/1920/1080', alt: '' }]

export function ApertureRevealHero({
  title = 'Your Headline Here',
  images = PLACEHOLDER,
  carouselMs = 3200,
}: ApertureRevealHeroProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const figureRef = useRef<HTMLDivElement>(null)
  const scrimRef = useRef<HTMLDivElement>(null)
  const headline2Ref = useRef<HTMLHeadingElement>(null)
  // Shared so the entrance timeline can release the scroll lock when it finishes.
  const lenisRef = useRef<Lenis | null>(null)

  // ── Page smooth-scroll HOST + scroll lock ─────────────────────────────────
  useIso(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.registerPlugin(ScrollTrigger)
    const lenis = new Lenis()
    lenisRef.current = lenis
    // Lock scroll from first paint; the entrance timeline calls lenis.start() on
    // complete (below). Lenis.stop() blocks wheel + touch scrolling.
    lenis.stop()
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  // ── On-load entrance (no-preference only) ─────────────────────────────────
  useIso(() => {
    gsap.registerPlugin(CustomEase)
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const fig = figureRef.current
      const section = sectionRef.current
      // Safety: if the entrance can't run, never leave scroll locked.
      if (!fig || !section) {
        lenisRef.current?.start()
        return
      }
      const letters = headline2Ref.current?.querySelectorAll<HTMLElement>('[data-l]')
      const slides = fig.querySelectorAll<HTMLElement>('img')

      const readRest = () =>
        parseFloat(getComputedStyle(section).getPropertyValue('--rest-scale')) || 0.22
      const reveal = CustomEase.create('heroReveal', 'M0,0 C0.22,1 0.36,1 1,1')

      gsap.set(fig, {
        opacity: 0,
        clipPath: 'inset(50% 0% 50% 0%)',
        scale: readRest(),
        transformOrigin: 'center center',
      })
      gsap.set(slides, { scale: 1.18, transformOrigin: 'center center' })
      gsap.set(scrimRef.current, { opacity: 0 })
      if (letters?.length) gsap.set(letters, { opacity: 0, yPercent: 120 })

      // Release the scroll lock once the whole entrance has played out.
      const tl = gsap.timeline({ delay: 0.15, onComplete: () => lenisRef.current?.start() })

      // (1) container enters: midline letterbox slit opens to full frame + fades in,
      //     while the photo settles from a slow push-in.
      tl.to(fig, { opacity: 1, duration: 0.6, ease: 'none' }, 0)
        .to(fig, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: reveal }, 0)
        .to(slides, { scale: 1, duration: 2.4, ease: reveal }, 0)
        // (2) auto-expand from rest size to full-bleed (scale → 1)
        .to(fig, { scale: 1, duration: 1.6, ease: 'power2.inOut' }, 0.6)
        // (3) ink scrim fades in as the picture grows
        .to(scrimRef.current, { opacity: 1, duration: 0.5, ease: 'none' }, 1.3)

      // (4) H1 rises in letter-by-letter
      if (letters?.length) {
        tl.to(
          letters,
          { opacity: 1, yPercent: 0, ease: 'power3.out', duration: 0.5, stagger: { amount: 0.4 } },
          1.5,
        )
      }

      return () => {
        tl.kill()
      }
    })

    return () => mm.revert()
  }, [])

  // ── Image carousel crossfade (DOM-driven, no React state) ─────────────────
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const fig = figureRef.current
    if (!fig) return
    const imgs = Array.from(fig.querySelectorAll<HTMLElement>('img'))
    if (imgs.length < 2) return
    let cur = 0
    const id = setInterval(() => {
      const next = (cur + 1) % imgs.length
      imgs[cur]?.classList.remove(styles.slideActive)
      imgs[next]?.classList.add(styles.slideActive)
      cur = next
    }, carouselMs)
    return () => clearInterval(id)
  }, [carouselMs])

  return (
    <section ref={sectionRef} className={styles.hero}>
      {/* Two soft accent blobs — top-left + bottom-right corners. */}
      <div className={styles.blobs} aria-hidden="true" />

      {/* Carousel/picture container: painted full-viewport (crisp), scaled DOWN from
          centre to rest size, then animated to full-bleed. Scrim + H1 live INSIDE it. */}
      <div ref={figureRef} className={styles.figure}>
        {images.map((img, i) => (
          <Image
            key={img.src}
            src={img.src}
            alt={img.alt ?? ''}
            fill
            sizes="100vw"
            priority={i === 0}
            className={`${styles.slide} ${i === 0 ? styles.slideActive : ''}`}
          />
        ))}

        <div ref={scrimRef} className={styles.scrim} aria-hidden="true" />

        <div className={styles.headlineWrap}>
          <h1 ref={headline2Ref} className={styles.heading} aria-label={title}>
            {title.split(/(\s+)/).map((token, ti) =>
              /\s+/.test(token) ? (
                ' '
              ) : (
                <span key={`w-${ti}`} className={styles.word} aria-hidden="true">
                  {Array.from(token).map((ch, ci) => (
                    <span key={ci} className={styles.letter} data-l>
                      {ch}
                    </span>
                  ))}
                </span>
              ),
            )}
          </h1>
        </div>
      </div>
    </section>
  )
}
