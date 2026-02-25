import { expect, test } from '@playwright/test';
import { features } from './landing-page-builder-e2e.spec.js';
import LandingPageBuilder from './landing-page-builder.page.js';
import LandingPagePreview from './landing-page-preview.page.js';

const LPB_REF = process.env.LPB_REF || 'uat';

let lpb;

test.describe('Landing Page Builder - E2E Journey Tests', () => {
  test.beforeEach(async ({ page }) => {
    lpb = new LandingPageBuilder(page);
    await test.setTimeout(180 * 1000);
  });

  // =============================================================
  // E2E-001: Gated Guide — Parts A + B + C + D
  // =============================================================
  test(`${features[0].name}, ${features[0].tags}`, async ({ page }) => {
    const { data } = features[0];

    // Part A: Build the Page
    await test.step('Part A-1: Navigate to LPB with fresh state', async () => {
      await lpb.navigateFresh(LPB_REF);
    });

    await test.step('Part A-2: Fill core options and confirm', async () => {
      await lpb.fillCoreOptionsAndConfirm(data);
    });

    await test.step('Part A-3: Fill Form section (gated)', async () => {
      await lpb.fillFormSection(data);
    });

    await test.step('Part A-4: Fill Marquee section', async () => {
      await lpb.fillMarqueeDescription(data.marqueeDescription);
      await lpb.uploadMarqueeImage(data.marqueeImage);
      await lpb.waitForToast('Image Uploaded', 'success', 15000);
    });

    await test.step('Part A-5: Fill Body section', async () => {
      await lpb.fillBodyDescription(data.bodyDescription);
    });

    await test.step('Part A-6: Fill Card section', async () => {
      await lpb.fillCardTitle(data.cardTitle);
      await lpb.fillCardDescription(data.cardDescription);
      await lpb.uploadCardImage(data.cardImage);
      await lpb.waitForToast('Image Uploaded', 'success', 15000);
    });

    await test.step('Part A-7: Fill SEO Metadata', async () => {
      await lpb.fillSeoTitle(data.seoTitle);
      await lpb.fillSeoDescription(data.seoDescription);
    });

    await test.step('Part A-8: Upload PDF asset', async () => {
      await lpb.uploadPdf(data.pdfAsset);
      await lpb.waitForToast('PDF uploaded successfully', 'success', 30000);
    });

    // Part B: Verify Builder Behavior
    let previewPage;

    await test.step('Part B-1: Click Save & Preview', async () => {
      previewPage = await lpb.submitAndWaitForPreview();
    });

    await test.step('Part B-2: Verify save toast sequence', async () => {
      await lpb.waitForToast('Saving page', 'info', 10000);
    });

    await test.step('Part B-3: Verify page saved toast', async () => {
      await lpb.waitForToast('Page saved', 'success', 15000);
    });

    await test.step('Part B-4: Verify preview toast', async () => {
      await lpb.waitForToast('Preview updated', 'success', 30000);
    });

    await test.step('Part B-5: Verify new tab opened', async () => {
      expect(previewPage).toBeTruthy();
      await expect(previewPage).toHaveURL(/business\.stage\.adobe\.com|aem\.page/);
    });

    // Part C: Verify Preview Page Content
    const preview = new LandingPagePreview(previewPage);

    await test.step('Part C-1: Verify marquee headline', async () => {
      await preview.verifyMarqueeContent(data.headline, data.marqueeDescription);
    });

    await test.step('Part C-2: Verify marquee image', async () => {
      await preview.verifyMarqueeImageVisible();
    });

    await test.step('Part C-3: Verify body content', async () => {
      await preview.verifyBodyContent(data.bodyDescription);
    });

    await test.step('Part C-4: Verify card content', async () => {
      await preview.verifyCardContent(data.cardTitle, data.cardDescription);
    });

    await test.step('Part C-5: Verify CaaS content type tag', async () => {
      await preview.verifyCaaSContentType(data.contentType);
    });

    // Part D: Verify Gated Flow (form submission)
    await test.step('Part D-1: Verify Marketo form is displayed', async () => {
      await preview.verifyFormDisplayed();
    });

    await test.step('Part D-2: Verify form description message', async () => {
      await preview.verifyFormDescription('share your contact information');
    });

    await test.step('Part D-3: Submit form with test data', async () => {
      await preview.submitMarketoForm(data.formTestData);
    });

    await test.step('Part D-4: Verify thank you message', async () => {
      await preview.verifyThankYouState(data.contentType);
    });

    await test.step('Part D-5: Verify PDF access', async () => {
      await preview.verifyPdfAccess();
    });

    await previewPage.close();
  });

  // =============================================================
  // E2E-002: Ungated Report — Parts A + B + C
  // =============================================================
  test(`${features[1].name}, ${features[1].tags}`, async ({ page }) => {
    const { data } = features[1];

    // Part A: Build the Page
    await test.step('Part A-1: Navigate to LPB with fresh state', async () => {
      await lpb.navigateFresh(LPB_REF);
    });

    await test.step('Part A-2: Fill core options and confirm', async () => {
      await lpb.fillCoreOptionsAndConfirm(data);
    });

    await test.step('Part A-3: Fill Marquee section', async () => {
      await lpb.fillMarqueeDescription(data.marqueeDescription);
      await lpb.uploadMarqueeImage(data.marqueeImage);
      await lpb.waitForToast('Image Uploaded', 'success', 15000);
    });

    await test.step('Part A-4: Fill Body section', async () => {
      await lpb.fillBodyDescription(data.bodyDescription);
    });

    await test.step('Part A-5: Fill Card section', async () => {
      await lpb.fillCardTitle(data.cardTitle);
      await lpb.fillCardDescription(data.cardDescription);
      await lpb.uploadCardImage(data.cardImage);
      await lpb.waitForToast('Image Uploaded', 'success', 15000);
    });

    await test.step('Part A-6: Fill SEO Metadata', async () => {
      await lpb.fillSeoTitle(data.seoTitle);
      await lpb.fillSeoDescription(data.seoDescription);
    });

    await test.step('Part A-7: Upload PDF asset', async () => {
      await lpb.uploadPdf(data.pdfAsset);
      await lpb.waitForToast('PDF uploaded successfully', 'success', 30000);
    });

    // Part B: Verify Builder Behavior
    let previewPage;

    await test.step('Part B-1: Click Save & Preview and wait for new tab', async () => {
      previewPage = await lpb.submitAndWaitForPreview();
    });

    await test.step('Part B-2: Verify toast sequence', async () => {
      await lpb.waitForToast('Page saved', 'success', 15000);
      await lpb.waitForToast('Preview updated', 'success', 30000);
    });

    await test.step('Part B-3: Verify new tab opened with correct URL', async () => {
      expect(previewPage).toBeTruthy();
      await expect(previewPage).toHaveURL(/business\.stage\.adobe\.com|aem\.page/);
    });

    // Part C: Verify Preview Page Content
    const preview = new LandingPagePreview(previewPage);

    await test.step('Part C-1: Verify marquee content', async () => {
      await preview.verifyMarqueeContent(data.headline, data.marqueeDescription);
    });

    await test.step('Part C-2: Verify marquee image', async () => {
      await preview.verifyMarqueeImageVisible();
    });

    await test.step('Part C-3: Verify body content', async () => {
      await preview.verifyBodyContent(data.bodyDescription);
    });

    await test.step('Part C-4: Verify card content', async () => {
      await preview.verifyCardContent(data.cardTitle, data.cardDescription);
    });

    await test.step('Part C-5: Verify CaaS content type tag', async () => {
      await preview.verifyCaaSContentType(data.contentType);
    });

    await test.step('Part C-6: Verify SEO metadata', async () => {
      await preview.verifySeoMetadata(data.seoTitle, data.seoDescription);
    });

    await previewPage.close();
  });

  // =============================================================
  // E2E-003: Video/Demo — Parts A + B + C
  // =============================================================
  test(`${features[2].name}, ${features[2].tags}`, async ({ page }) => {
    const { data } = features[2];

    // Part A: Build the Page
    await test.step('Part A-1: Navigate to LPB with fresh state', async () => {
      await lpb.navigateFresh(LPB_REF);
    });

    await test.step('Part A-2: Fill core options and confirm', async () => {
      await lpb.fillCoreOptionsAndConfirm(data);
    });

    await test.step('Part A-3: Fill Marquee section', async () => {
      await lpb.fillMarqueeDescription(data.marqueeDescription);
      await lpb.uploadMarqueeImage(data.marqueeImage);
      await lpb.waitForToast('Image Uploaded', 'success', 15000);
    });

    await test.step('Part A-4: Fill Body section', async () => {
      await lpb.fillBodyDescription(data.bodyDescription);
    });

    await test.step('Part A-5: Fill Card section', async () => {
      await lpb.fillCardTitle(data.cardTitle);
      await lpb.fillCardDescription(data.cardDescription);
      await lpb.uploadCardImage(data.cardImage);
      await lpb.waitForToast('Image Uploaded', 'success', 15000);
    });

    await test.step('Part A-6: Fill SEO Metadata', async () => {
      await lpb.fillSeoTitle(data.seoTitle);
      await lpb.fillSeoDescription(data.seoDescription);
    });

    await test.step('Part A-7: Enter Video URL (no PDF)', async () => {
      await lpb.fillVideoUrl(data.videoUrl);
    });

    // Part B: Verify Builder Behavior
    let previewPage;

    await test.step('Part B-1: Click Save & Preview and wait for new tab', async () => {
      previewPage = await lpb.submitAndWaitForPreview();
    });

    await test.step('Part B-2: Verify toast sequence', async () => {
      await lpb.waitForToast('Page saved', 'success', 15000);
      await lpb.waitForToast('Preview updated', 'success', 30000);
    });

    await test.step('Part B-3: Verify new tab opened', async () => {
      expect(previewPage).toBeTruthy();
      await expect(previewPage).toHaveURL(/business\.stage\.adobe\.com|aem\.page/);
    });

    // Part C: Verify Preview Page Content
    const preview = new LandingPagePreview(previewPage);

    await test.step('Part C-1: Verify marquee content', async () => {
      await preview.verifyMarqueeContent(data.headline, data.marqueeDescription);
    });

    await test.step('Part C-2: Verify marquee image', async () => {
      await preview.verifyMarqueeImageVisible();
    });

    await test.step('Part C-3: Verify body content', async () => {
      await preview.verifyBodyContent(data.bodyDescription);
    });

    await test.step('Part C-4: Verify card content', async () => {
      await preview.verifyCardContent(data.cardTitle, data.cardDescription);
    });

    await test.step('Part C-5: Verify CaaS content type tag', async () => {
      await preview.verifyCaaSContentType(data.contentType);
    });

    await test.step('Part C-6: Verify video player presence', async () => {
      await preview.verifyVideoPlayer();
    });

    await previewPage.close();
  });
});
