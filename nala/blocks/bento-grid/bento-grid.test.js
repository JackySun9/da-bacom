import { expect, test } from '@playwright/test';
import { features } from './bento-grid.spec.js';
import BentoGrid from './bento-grid.page.js';

const miloLibs = process.env.MILO_LIBS || '';
const findFeature = (name) => features.find((f) => f.name === name);

const buildUrl = (baseURL, path) => {
  if (!miloLibs) return `${baseURL}${path}`;
  const sep = path.includes('?') ? '&' : '?';
  return `${baseURL}${path}${sep}${miloLibs.replace(/^[?&]/, '')}`;
};

test.describe('BACOM Bento Grid Block Test Suite', () => {
  test(`${findFeature('@bento-grid-structure').name} ${findFeature('@bento-grid-structure').tags}`, async ({ page, baseURL }) => {
    const feature = findFeature('@bento-grid-structure');
    const bento = new BentoGrid(page);
    const testPage = buildUrl(baseURL, feature.path);

    await test.step('Go to test page', async () => {
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
      await bento.waitForReady();
    });

    await test.step('Block shell has region role and accessible label', async () => {
      await expect(bento.block).toHaveClass(/con-block/);
      await expect(bento.block).toHaveAttribute('role', feature.expected.role);
      await expect(bento.block).toHaveAttribute('aria-label', feature.expected.ariaLabel);
    });

    await test.step('All three responsive views render; desktop is the visible one', async () => {
      await expect(bento.viewMobile).toBeAttached();
      await expect(bento.viewTablet).toBeAttached();
      await expect(bento.viewDesktop).toBeAttached();
      await expect(bento.viewDesktop).toBeVisible();
      await expect(bento.viewMobile).toBeHidden();
      await expect(bento.viewTablet).toBeHidden();
    });

    await test.step('Section header shows a heading and subtext', async () => {
      // Header may be authored in-block (dedicated pages) or as the text
      // section directly above the block (integration page).
      const header = await bento.sectionHeadingInfo();
      expect(header.heading, `section heading (${header.source})`).not.toBe('');
      expect(header.subtext, `section subtext (${header.source})`).not.toBe('');
    });

    await test.step('Featured video bento renders as a clickable video card', async () => {
      await expect(bento.featured).toBeVisible();
      await expect(bento.featured).toHaveClass(/has-video/);
      await expect(bento.featured).toHaveAttribute('href', /.+/);
      await expect(bento.featuredHeading).not.toBeEmpty();
      await expect(bento.featuredPlayIcon).toBeVisible();
      await expect(bento.featuredWatchLink).toBeVisible();
    });

    await test.step('Carousel renders cards, each with a play icon and watch link', async () => {
      const cardCount = await bento.gridItems.count();
      expect(cardCount).toBeGreaterThanOrEqual(feature.expected.minCards);
      await expect(bento.gridItemPlayIcons).toHaveCount(cardCount);
      await expect(bento.gridItemWatchLinks).toHaveCount(cardCount);
      await expect(bento.controls).toBeVisible();
    });
  });

  test(`${findFeature('@bento-grid-video-modal').name} ${findFeature('@bento-grid-video-modal').tags}`, async ({ page, baseURL }) => {
    const feature = findFeature('@bento-grid-video-modal');
    const bento = new BentoGrid(page);
    const testPage = buildUrl(baseURL, feature.path);

    await test.step('Go to test page', async () => {
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
      await bento.waitForReady();
    });

    await test.step('Clicking the featured video opens the video modal', async () => {
      await bento.openFeaturedVideo();
      await expect(bento.modal).toBeVisible();
      await expect(bento.modalVideo).toBeAttached();
      await expect(bento.modalError).toBeHidden();
    });

    await test.step('The modal plays the featured video', async () => {
      // Dedicated page: native <video><source> mp4. Integration page: the
      // fragment modal embeds the video as an adobetv iframe.
      const src = await bento.modalVideoSource();
      expect(src, 'modal video source (mp4 or embed)').toMatch(/.+/);
    });

    await test.step('Closing the modal removes it from the page', async () => {
      await bento.closeModal();
      await expect(bento.modal).toHaveCount(0);
    });
  });

  test(`${findFeature('@bento-grid-carousel-nav').name} ${findFeature('@bento-grid-carousel-nav').tags}`, async ({ page, baseURL }) => {
    const feature = findFeature('@bento-grid-carousel-nav');
    const bento = new BentoGrid(page);
    const testPage = buildUrl(baseURL, feature.path);

    await test.step('Go to test page', async () => {
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
      await bento.waitForReady();
    });

    await test.step('Prev arrow starts disabled, Next arrow is enabled', async () => {
      await expect(bento.controls).toBeVisible();
      await expect(bento.prevArrow).toBeDisabled();
      await expect(bento.nextArrow).toBeEnabled();
    });

    await test.step('Clicking Next scrolls the carousel and enables Prev', async () => {
      await bento.clickNext();
      await expect(bento.prevArrow).toBeEnabled();
    });

    await test.step('Clicking Prev scrolls back toward the start', async () => {
      await bento.clickPrev();
    });
  });

  test(`${findFeature('@bento-grid-responsive').name} ${findFeature('@bento-grid-responsive').tags}`, async ({ page, baseURL }) => {
    const feature = findFeature('@bento-grid-responsive');
    const bento = new BentoGrid(page);
    const testPage = buildUrl(baseURL, feature.path);

    await test.step('Go to test page (desktop)', async () => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
      await bento.waitForReady();
    });

    await test.step('Desktop shows the featured card + carousel controls', async () => {
      await expect(bento.viewDesktop).toBeVisible();
      await expect(bento.featured).toBeVisible();
    });

    await test.step('Mobile collapses to a single full carousel (no arrow controls, per QE AC)', async () => {
      await page.setViewportSize({ width: 390, height: 844 });
      await expect(bento.viewMobile).toBeVisible();
      await expect(bento.viewDesktop).toBeHidden();
      expect(await bento.mobileGridItems.count()).toBeGreaterThan(0);
      await expect(bento.mobileControls).toHaveCount(0);
    });
  });

  test(`${findFeature('@bento-grid-play-icon-topright').name} ${findFeature('@bento-grid-play-icon-topright').tags}`, async ({ page, baseURL }) => {
    const feature = findFeature('@bento-grid-play-icon-topright');
    const bento = new BentoGrid(page);
    const testPage = buildUrl(baseURL, feature.path);

    await test.step('Go to test page (desktop)', async () => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
      await bento.waitForReady();
    });

    await test.step('Featured play icon sits in the top-right of the image (AC)', async () => {
      const p = await bento.playIconPlacement('featured');
      expect(p, 'featured icon + media measurable').not.toBeNull();
      expect(p.inRightHalf, 'featured play icon in right half').toBe(true);
      expect(p.inTopHalf, 'featured play icon in top half').toBe(true);
    });

    await test.step('Carousel card play icon sits in the top-right of the image (AC)', async () => {
      const p = await bento.playIconPlacement('card');
      expect(p, 'card icon + media measurable').not.toBeNull();
      expect(p.inRightHalf, 'card play icon in right half').toBe(true);
      expect(p.inTopHalf, 'card play icon in top half').toBe(true);
    });
  });

  test(`${findFeature('@bento-grid-partial-vs-full').name} ${findFeature('@bento-grid-partial-vs-full').tags}`, async ({ page, baseURL }) => {
    const feature = findFeature('@bento-grid-partial-vs-full');
    const bento = new BentoGrid(page);
    const testPage = buildUrl(baseURL, feature.path);

    await test.step('Go to test page', async () => {
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
      await bento.waitForReady();
    });

    await test.step('Desktop is a partial carousel (overflows; multiple cards visible) (AC)', async () => {
      await page.setViewportSize({ width: 1440, height: 900 });
      const d = await bento.desktopCarouselPartial();
      expect(d.overflows, 'carousel content overflows the viewport (scrollable)').toBe(true);
      expect(d.cardWidthPct, 'each card is well under full width (partial — multiple visible)').toBeLessThan(50);
    });

    await test.step('Mobile is a full-width single carousel (QE AC: full carousel, no arrows)', async () => {
      await page.setViewportSize({ width: 390, height: 844 });
      const m = await bento.mobileCarouselFull();
      expect(m.controls, 'full carousel on mobile — no arrow controls per QE AC').toBe(0);
      expect(m.overflows, 'mobile carousel is swipeable').toBe(true);
      expect(m.cardWidthPct, 'each mobile card is near full width').toBeGreaterThan(60);
    });
  });

  // SPEC-LOCK (red until built): the ISWA Figma (node 950-1996) shows secondary cards
  // with the same light-grey rounded-card background as the featured card, and card
  // corners that match the inner image radius. Live has neither yet (secondary bg is
  // transparent, card radius 0px) — these two tests hold the design contract.
  test(`${findFeature('@bento-grid-secondary-bg').name} ${findFeature('@bento-grid-secondary-bg').tags}`, async ({ page, baseURL }) => {
    const feature = findFeature('@bento-grid-secondary-bg');
    const bento = new BentoGrid(page);
    const testPage = buildUrl(baseURL, feature.path);

    await test.step('Go to test page (desktop)', async () => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
      await bento.waitForReady();
    });

    await test.step('Desktop: secondary cards match the featured card grey background', async () => {
      const audit = await bento.cardStyleAudit('.view-desktop');
      expect(audit.secondaryBgIsGrey, `secondary bg should be light grey, got ${audit.secondaryBg}`).toBe(true);
      expect(audit.bgMatchesFeatured, `secondary bg ${audit.secondaryBg} should match featured ${audit.featuredBg}`).toBe(true);
    });

    await test.step('Mobile: the grey background carries through', async () => {
      await page.setViewportSize({ width: 390, height: 844 });
      const audit = await bento.cardStyleAudit('.view-mobile');
      expect(audit.secondaryBgIsGrey, `mobile secondary bg should be light grey, got ${audit.secondaryBg}`).toBe(true);
    });
  });

  // SPEC-LOCK (red until built): Figma-confirmed — see note above.
  test(`${findFeature('@bento-grid-card-radius').name} ${findFeature('@bento-grid-card-radius').tags}`, async ({ page, baseURL }) => {
    const feature = findFeature('@bento-grid-card-radius');
    const bento = new BentoGrid(page);
    const testPage = buildUrl(baseURL, feature.path);

    await test.step('Go to test page (desktop)', async () => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(testPage);
      await page.waitForLoadState('domcontentloaded');
      await bento.waitForReady();
    });

    await test.step('Card corner radius matches the inner creative image radius', async () => {
      const audit = await bento.cardStyleAudit('.view-desktop');
      expect(
        audit.radiusMatchesImage,
        `card radius ${audit.cardRadius}px should match image radius ${audit.mediaRadius}px`,
      ).toBe(true);
    });
  });
});
