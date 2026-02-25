import { expect } from '@playwright/test';

const CAAS_CONTENT_TYPE_MAP = {
  Guide: 'caas:content-type/guide',
  Infographic: 'caas:content-type/infographic',
  Report: 'caas:content-type/report',
  'Video/Demo': 'caas:content-type/demos-and-video',
};

export default class LandingPagePreview {
  constructor(page) {
    this.page = page;

    // Marquee block
    this.marquee = page.locator('.marquee');
    this.marqueeHeadline = page.locator('.marquee h1, .marquee h2').first();
    this.marqueeDescription = page.locator('.marquee .body-m, .marquee p').first();
    this.marqueeImage = page.locator('.marquee img').first();

    // Body / Text block
    this.bodySection = page.locator('.section:has(.text)');
    this.bodyText = page.locator('.text');

    // Card block
    this.card = page.locator('.card, .consonant-Card');
    this.cardTitle = page.locator('.card h3, .consonant-Card-title').first();
    this.cardDescription = page.locator('.card p, .consonant-Card-description').first();
    this.cardImage = page.locator('.card img, .consonant-Card img').first();

    // Marketo form block (gated pages)
    this.marketoForm = page.locator('.marketo');
    this.formDescription = page.locator('.marketo .body-m, .marketo p').first();
    this.email = page.locator('#Email');
    this.firstName = page.locator('#FirstName');
    this.lastName = page.locator('#LastName');
    this.company = page.locator('#Company');
    this.country = page.locator('#Country');
    this.state = page.locator('#State');
    this.zipCode = page.locator('#Postal_Code__c, #PostalCode');
    this.phone = page.locator('#Phone');
    this.jobTitle = page.locator('#mktoFormCol_Job_Title, select[name="functionalArea"], #functionalArea');
    this.department = page.locator('#Department, select[name="mktoFormCol_Department"]');
    this.submitButton = page.locator('.marketo button[type="submit"], .mktoButton');

    // Thank-you / success state
    this.thankYouMessage = page.locator('.section:has-text("Thank you")');
    this.pdfDownloadLink = page.locator('a[href$=".pdf"]');

    // Video player
    this.videoPlayer = page.locator('.video, video, iframe[src*="video"]');

    // Experience Fragment / Recommended content
    this.experienceFragment = page.locator('.fragment, .section:last-child');

    // Metadata (from page source)
    this.metaTitle = () => page.locator('meta[property="og:title"]');
    this.metaDescription = () => page.locator('meta[name="description"]');
  }

  // --- Content Verification ---

  async verifyMarqueeContent(headline, description) {
    if (headline) {
      await expect(this.marqueeHeadline).toContainText(headline);
    }
    if (description) {
      await expect(this.marqueeDescription).toContainText(description);
    }
  }

  async verifyMarqueeImageVisible() {
    await expect(this.marqueeImage).toBeVisible();
    const src = await this.marqueeImage.getAttribute('src');
    expect(src).toBeTruthy();
  }

  async verifyCardContent(title, description) {
    if (title) {
      await expect(this.cardTitle).toContainText(title);
    }
    if (description) {
      await expect(this.cardDescription).toContainText(description);
    }
  }

  async verifyBodyContent(text) {
    await expect(this.bodyText).toContainText(text);
  }

  async verifyCaaSContentType(contentType) {
    const expectedTag = CAAS_CONTENT_TYPE_MAP[contentType];
    if (!expectedTag) return;
    const pageContent = await this.page.content();
    expect(pageContent).toContain(expectedTag);
  }

  async verifySeoMetadata(title, description) {
    if (title) {
      const ogTitle = await this.metaTitle().getAttribute('content');
      expect(ogTitle).toContain(title);
    }
    if (description) {
      const metaDesc = await this.metaDescription().getAttribute('content');
      expect(metaDesc).toContain(description);
    }
  }

  async verifyVideoPlayer() {
    await expect(this.videoPlayer).toBeVisible();
  }

  // --- Gated Form Interaction ---

  async verifyFormDisplayed() {
    await expect(this.marketoForm).toBeVisible();
  }

  async verifyFormDescription(expectedText) {
    await expect(this.formDescription).toContainText(expectedText);
  }

  async submitMarketoForm(testData) {
    await expect(async () => {
      await this.marketoForm.scrollIntoViewIfNeeded();
      await expect(this.email).toBeVisible({ timeout: 10000 });
    }).toPass({ intervals: [3000], timeout: 60000 });

    if (testData.firstName) await this.firstName.fill(testData.firstName);
    if (testData.lastName) await this.lastName.fill(testData.lastName);
    if (testData.email) await this.email.fill(testData.email);
    if (testData.company) await this.company.fill(testData.company);
    if (testData.country) await this.country.selectOption(testData.country);
    if (testData.state) await this.state.selectOption(testData.state);
    if (testData.zipCode) await this.zipCode.fill(testData.zipCode);
    if (testData.phone) await this.phone.fill(testData.phone);

    await this.submitButton.click();
  }

  async verifyThankYouState(contentType) {
    const expectedMessage = `Thank you. Your ${contentType.toLowerCase()} is ready below.`;
    await expect(this.thankYouMessage).toContainText('Thank you', { timeout: 30000 });
  }

  async verifyPdfAccess() {
    await expect(this.pdfDownloadLink).toBeVisible();
    const href = await this.pdfDownloadLink.getAttribute('href');
    expect(href).toContain('.pdf');
  }

  // --- Full Preview Verification ---

  async verifyPreviewContent(data) {
    await this.verifyMarqueeContent(data.headline, data.marqueeDescription);
    await this.verifyMarqueeImageVisible();

    if (data.bodyDescription) {
      await this.verifyBodyContent(data.bodyDescription);
    }

    if (data.cardTitle) {
      await this.verifyCardContent(data.cardTitle, data.cardDescription);
    }

    await this.verifyCaaSContentType(data.contentType);

    if (data.seoTitle) {
      await this.verifySeoMetadata(data.seoTitle, data.seoDescription);
    }
  }
}
