import { expect } from '@playwright/test';

const DA_LIVE_URL = 'https://da.live';
const LPB_PATH = '/app/adobecom/da-bacom/tools/generator/landing-page';

export default class LandingPageBuilder {
  constructor(page) {
    this.page = page;

    // Root component
    this.generator = page.locator('da-generator');

    // Core Options
    this.contentType = page.locator('sl-select[name="contentType"]');
    this.gated = page.locator('sl-select[name="gated"]');
    this.region = page.locator('sl-select[name="region"]');
    this.marqueeHeadlineInput = page.locator('sl-input[name="marqueeHeadline"]');
    this.pathInput = page.locator('path-input[name="pageName"]');
    this.pathInputField = page.locator('path-input[name="pageName"] input.path-input');
    this.pathCheckBtn = page.locator('path-input[name="pageName"] button.path-action-btn');
    this.pathAvailableIcon = page.locator('path-input[name="pageName"] svg.validation-icon.available');
    this.pathConflictIcon = page.locator('path-input[name="pageName"] svg.validation-icon.conflict');
    this.pathCheckingIcon = page.locator('path-input[name="pageName"] svg.validation-icon.checking');
    this.coreOptionsSection = page.locator('.form-row.core-options');
    this.templatePreviewLink = page.locator('.template-preview-label a');

    // Action buttons
    this.confirmBtn = page.locator('sl-button.primary');
    this.savePreviewBtn = page.locator('sl-button[type="submit"]');
    this.resetBtn = page.locator('sl-button.reset');
    this.helpText = page.locator('p.help-text');

    // Form section (Gated only)
    this.formTemplate = page.locator('sl-select[name="formTemplate"]');
    this.campaignId = page.locator('sl-input[name="campaignId"]');
    this.marketoPOI = page.locator('sl-select[name="marketoPOI"]');

    // Marquee section
    this.marqueeEyebrow = page.locator('sl-select[name="marqueeEyebrow"]');
    this.marqueeDescription = page.locator('sl-input[name="marqueeDescription"]');
    this.marqueeImageDropzone = page.locator('image-dropzone[name="marqueeImage"]');
    this.marqueeImageInput = page.locator('image-dropzone[name="marqueeImage"] input.img-file-input');
    this.marqueeImagePreview = page.locator('image-dropzone[name="marqueeImage"] .preview-img-placeholder img');
    this.marqueeImageDelete = page.locator('image-dropzone[name="marqueeImage"] .icon-delete');

    // Body section
    this.bodyDescription = page.locator('text-editor[name="bodyDescription"]');
    this.bodyEditorContent = page.locator('text-editor[name="bodyDescription"] .editor-content');
    this.bodyBoldBtn = page.locator('text-editor[name="bodyDescription"] .toolbar-btn.bold');
    this.bodyItalicBtn = page.locator('text-editor[name="bodyDescription"] .toolbar-btn.italic');
    this.bodyListBtn = page.locator('text-editor[name="bodyDescription"] .toolbar-btn.list');
    this.bodyImageDropzone = page.locator('image-dropzone[name="bodyImage"]');
    this.bodyImageInput = page.locator('image-dropzone[name="bodyImage"] input.img-file-input');

    // Card section
    this.cardTitle = page.locator('sl-input[name="cardTitle"]');
    this.cardDescription = page.locator('sl-input[name="cardDescription"]');
    this.cardImageDropzone = page.locator('image-dropzone[name="cardImage"]');
    this.cardImageInput = page.locator('image-dropzone[name="cardImage"] input.img-file-input');

    // CaaS section
    this.primaryProducts = page.locator('multi-select[name="primaryProducts"]');
    this.productsDropdownTrigger = page.locator('multi-select[name="primaryProducts"] .selected-items');
    this.productsDropdownMenu = page.locator('multi-select[name="primaryProducts"] .dropdown-menu');
    this.industry = page.locator('sl-select[name="caasIndustry"]');

    // SEO Metadata section
    this.seoTitle = page.locator('sl-input[name="seoMetadataTitle"]');
    this.seoDescription = page.locator('sl-input[name="seoMetadataDescription"]');
    this.primaryProductName = page.locator('sl-select[name="primaryProductName"]');

    // Experience Fragment
    this.experienceFragment = page.locator('sl-select[name="experienceFragment"]');

    // Asset delivery
    this.videoAsset = page.locator('sl-input[name="videoAsset"]');
    this.pdfFileInput = page.locator('input.pdf-file-input');
    this.pdfFileInfo = page.locator('.file-info');
    this.pdfViewLink = page.locator('.file-info a:has-text("View")');
    this.pdfClearLink = page.locator('.file-info a:has-text("Clear")');

    // Toasts (appended to document.body, outside shadow DOM)
    this.toast = page.locator('toast-message');
    this.toastSuccess = page.locator('toast-message .toast.success');
    this.toastError = page.locator('toast-message .toast.error');
    this.toastInfo = page.locator('toast-message .toast.info');
    this.toastWarning = page.locator('toast-message .toast.warning');

    // Error states
    this.fieldErrors = page.locator('.error-message');
    this.requiredFieldError = page.locator('.inputfield-error');

    // Section headers
    this.sectionHeaders = page.locator('.form-row h2');
  }

  // eslint-disable-next-line class-methods-use-this
  getLPBUrl(ref = '') {
    const params = ref ? `?ref=${ref}` : '';
    return `${DA_LIVE_URL}${LPB_PATH}${params}`;
  }

  async navigate(ref = '') {
    const url = this.getLPBUrl(ref);
    await this.page.goto(url);
    await this.page.waitForLoadState('domcontentloaded');
    await this.generator.waitFor({ state: 'attached', timeout: 30000 });
  }

  async clearLocalStorage() {
    await this.page.evaluate(() => localStorage.removeItem('landing-page-builder'));
  }

  async navigateFresh(ref = '') {
    await this.navigate(ref);
    await this.clearLocalStorage();
    await this.page.reload();
    await this.page.waitForLoadState('domcontentloaded');
    await this.generator.waitFor({ state: 'attached', timeout: 30000 });
  }

  // --- Core Options ---

  async selectContentType(value) {
    await this.contentType.locator('select').selectOption(value);
    await this.contentType.dispatchEvent('change');
  }

  async selectGated(value) {
    await this.gated.locator('select').selectOption(value);
    await this.gated.dispatchEvent('change');
  }

  async selectRegion(value) {
    await this.region.locator('select').selectOption(value);
    await this.region.dispatchEvent('change');
  }

  async fillMarqueeHeadline(text) {
    const input = this.marqueeHeadlineInput.locator('input');
    await input.fill(text);
    await input.dispatchEvent('input');
  }

  async fillPageName(text) {
    await this.pathInputField.fill(text);
    await this.pathInputField.dispatchEvent('input');
  }

  async clickPathCheck() {
    await this.pathCheckBtn.click();
  }

  async waitForPathAvailable() {
    await this.pathAvailableIcon.waitFor({ state: 'visible', timeout: 15000 });
  }

  async clickConfirm() {
    await this.confirmBtn.click();
  }

  async fillCoreOptionsAndConfirm(data) {
    await this.selectContentType(data.contentType);
    await this.selectGated(data.gated);
    if (data.region) await this.selectRegion(data.region);
    await this.fillMarqueeHeadline(data.headline);
    await this.page.waitForTimeout(1000);
    await this.clickPathCheck();
    await this.waitForPathAvailable();
    await this.clickConfirm();
    await this.savePreviewBtn.waitFor({ state: 'visible', timeout: 10000 });
  }

  // --- Form Section (Gated) ---

  async selectFormTemplate(value) {
    await this.formTemplate.locator('select').selectOption(value);
    await this.formTemplate.dispatchEvent('change');
  }

  async fillCampaignId(value) {
    const input = this.campaignId.locator('input');
    await input.fill(value);
    await input.dispatchEvent('input');
  }

  async selectMarketoPOI(value) {
    await this.marketoPOI.locator('select').selectOption(value);
    await this.marketoPOI.dispatchEvent('change');
  }

  async fillFormSection(data) {
    if (data.formTemplate) await this.selectFormTemplate(data.formTemplate);
    if (data.campaignId) await this.fillCampaignId(data.campaignId);
    if (data.poi) await this.selectMarketoPOI(data.poi);
  }

  // --- Marquee Section ---

  async fillMarqueeDescription(text) {
    const input = this.marqueeDescription.locator('input');
    await input.fill(text);
    await input.dispatchEvent('input');
  }

  async uploadMarqueeImage(filePath) {
    await this.marqueeImageInput.setInputFiles(filePath);
  }

  async deleteMarqueeImage() {
    await this.marqueeImageDelete.click();
  }

  // --- Body Section ---

  async fillBodyDescription(text) {
    await this.bodyEditorContent.click();
    await this.bodyEditorContent.fill(text);
  }

  async applyBoldFormatting() {
    await this.bodyBoldBtn.click();
  }

  async applyItalicFormatting() {
    await this.bodyItalicBtn.click();
  }

  async applyBulletList() {
    await this.bodyListBtn.click();
  }

  async uploadBodyImage(filePath) {
    await this.bodyImageInput.setInputFiles(filePath);
  }

  // --- Card Section ---

  async fillCardTitle(text) {
    const input = this.cardTitle.locator('input');
    await input.fill(text);
    await input.dispatchEvent('input');
  }

  async fillCardDescription(text) {
    const input = this.cardDescription.locator('input');
    await input.fill(text);
    await input.dispatchEvent('input');
  }

  async uploadCardImage(filePath) {
    await this.cardImageInput.setInputFiles(filePath);
  }

  // --- CaaS Section ---

  async selectProducts(products) {
    await this.productsDropdownTrigger.click();
    await this.productsDropdownMenu.waitFor({ state: 'visible' });
    for (const product of products) {
      const option = this.productsDropdownMenu.locator(`.dropdown-option:has-text("${product}")`);
      await option.click();
    }
    // Close dropdown by clicking outside
    await this.page.locator('h1').first().click();
  }

  async removeProductTag(product) {
    const tag = this.primaryProducts.locator(`.selected-tag:has-text("${product}") button`);
    await tag.click();
  }

  async getSelectedProducts() {
    const tags = this.primaryProducts.locator('.selected-tag');
    return tags.allTextContents();
  }

  async selectIndustry(value) {
    await this.industry.locator('select').selectOption(value);
    await this.industry.dispatchEvent('change');
  }

  // --- SEO Metadata ---

  async fillSeoTitle(text) {
    const input = this.seoTitle.locator('input');
    await input.fill(text);
    await input.dispatchEvent('input');
  }

  async fillSeoDescription(text) {
    const input = this.seoDescription.locator('input');
    await input.fill(text);
    await input.dispatchEvent('input');
  }

  async selectPrimaryProductName(value) {
    await this.primaryProductName.locator('select').selectOption(value);
    await this.primaryProductName.dispatchEvent('change');
  }

  // --- Experience Fragment ---

  async selectExperienceFragment(value) {
    await this.experienceFragment.locator('select').selectOption(value);
    await this.experienceFragment.dispatchEvent('change');
  }

  // --- Asset Delivery ---

  async fillVideoUrl(url) {
    const input = this.videoAsset.locator('input');
    await input.fill(url);
    await input.dispatchEvent('input');
  }

  async uploadPdf(filePath) {
    await this.pdfFileInput.setInputFiles(filePath);
  }

  async clearPdf() {
    await this.pdfClearLink.click();
  }

  async viewPdf() {
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
      this.pdfViewLink.click(),
    ]);
    return newPage;
  }

  // --- Actions ---

  async clickSaveAndPreview() {
    await this.savePreviewBtn.click();
  }

  async clickReset() {
    await this.resetBtn.click();
  }

  async submitAndWaitForPreview() {
    const [previewPage] = await Promise.all([
      this.page.context().waitForEvent('page', { timeout: 60000 }),
      this.clickSaveAndPreview(),
    ]);
    await previewPage.waitForLoadState('domcontentloaded');
    return previewPage;
  }

  // --- Toast Verification ---

  async waitForToast(text, type = '', timeout = 10000) {
    const selector = type
      ? `toast-message .toast.${type}`
      : 'toast-message .toast';
    const toast = this.page.locator(selector).filter({ hasText: text });
    await toast.waitFor({ state: 'visible', timeout });
    return toast;
  }

  async verifyToastSequence(messages) {
    for (const { text, type } of messages) {
      await this.waitForToast(text, type, 30000);
    }
  }

  // --- Validation Helpers ---

  async getVisibleSectionHeaders() {
    return this.sectionHeaders.allTextContents();
  }

  async isFullFormVisible() {
    return this.savePreviewBtn.isVisible();
  }

  async isCoreOptionsLocked() {
    const classes = await this.coreOptionsSection.getAttribute('class');
    return classes?.includes('locked') || false;
  }

  async getFieldError(fieldName) {
    const container = this.page.locator(`[name="${fieldName}"]`).locator('..');
    const error = container.locator('.error-message, .inputfield-error');
    if (await error.isVisible()) return error.textContent();
    return null;
  }

  async verifyRequiredFieldsHighlighted(fields) {
    for (const field of fields) {
      const element = this.page.locator(`[name="${field}"]`);
      const errorAttr = await element.getAttribute('error');
      expect(errorAttr).toBeTruthy();
    }
  }

  // --- Full Form Fill ---

  async fillCompleteForm(data) {
    // Form section (gated)
    if (data.gated === 'Gated') {
      await this.fillFormSection(data);
    }

    // Marquee
    if (data.marqueeDescription) await this.fillMarqueeDescription(data.marqueeDescription);
    if (data.marqueeImage) await this.uploadMarqueeImage(data.marqueeImage);

    // Body
    if (data.bodyDescription) await this.fillBodyDescription(data.bodyDescription);
    if (data.bodyImage) await this.uploadBodyImage(data.bodyImage);

    // Card
    if (data.cardTitle) await this.fillCardTitle(data.cardTitle);
    if (data.cardDescription) await this.fillCardDescription(data.cardDescription);
    if (data.cardImage) await this.uploadCardImage(data.cardImage);

    // CaaS
    if (data.products?.length) await this.selectProducts(data.products);
    if (data.industry) await this.selectIndustry(data.industry);

    // SEO
    if (data.seoTitle) await this.fillSeoTitle(data.seoTitle);
    if (data.seoDescription) await this.fillSeoDescription(data.seoDescription);
    if (data.primaryProductName) await this.selectPrimaryProductName(data.primaryProductName);

    // Experience Fragment
    if (data.experienceFragment) await this.selectExperienceFragment(data.experienceFragment);

    // Asset
    if (data.videoUrl) await this.fillVideoUrl(data.videoUrl);
    if (data.pdfAsset) await this.uploadPdf(data.pdfAsset);

    // Wait for async uploads to settle
    await this.page.waitForTimeout(2000);
  }
}
