const path = require('path');

const ASSETS_DIR = path.join(__dirname, 'assets');
const SAMPLE_PNG = path.join(ASSETS_DIR, 'sample-marquee.png');
const SAMPLE_CARD_PNG = path.join(ASSETS_DIR, 'sample-card.png');
const SAMPLE_PDF = path.join(ASSETS_DIR, 'sample-guide.pdf');

const FORM_TEST_DATA = {
  firstName: 'NalaTest',
  lastName: 'Tester',
  email: 'qa-test@adobetest.com',
  company: 'Adobe Nala Test Corp',
  country: 'United States',
  state: 'California',
  zipCode: '95110',
  phone: '408-555-9999',
};

module.exports = {
  name: 'Landing Page Builder E2E',
  features: [
    // =========================================================
    // E2E-001: Gated Guide (Parts A + B + C + D)
    // =========================================================
    {
      tcid: '0',
      name: '@lpb-e2e-gated-guide: Full gated guide journey',
      path: '/tools/generator/landing-page',
      tags: '@lpb @e2e @gated @guide @smoke @regression @bacom',
      data: {
        contentType: 'Guide',
        gated: 'Gated',
        region: 'us',
        headline: `Nala E2E Gated Guide ${Date.now()}`,
        formTemplate: 'Medium',
        campaignId: '0',
        poi: 'Adobe Analytics',
        marqueeDescription: 'Learn how enterprise teams use analytics to drive growth.',
        marqueeImage: SAMPLE_PNG,
        bodyDescription: 'Best practices for analytics implementation across the enterprise.',
        cardTitle: 'Enterprise Analytics Guide',
        cardDescription: 'Download our complete guide to enterprise analytics.',
        cardImage: SAMPLE_CARD_PNG,
        products: [],
        industry: '',
        seoTitle: 'Enterprise Analytics Guide | Adobe',
        seoDescription: 'Download our comprehensive analytics guide for enterprise teams.',
        primaryProductName: '',
        experienceFragment: '',
        pdfAsset: SAMPLE_PDF,
        expectedCaasTag: 'caas:content-type/guide',
        formTestData: FORM_TEST_DATA,
      },
    },

    // =========================================================
    // E2E-002: Ungated Report (Parts A + B + C)
    // =========================================================
    {
      tcid: '1',
      name: '@lpb-e2e-ungated-report: Full ungated report journey',
      path: '/tools/generator/landing-page',
      tags: '@lpb @e2e @ungated @report @smoke @regression @bacom',
      data: {
        contentType: 'Report',
        gated: 'Ungated',
        region: 'us',
        headline: `Nala E2E Ungated Report ${Date.now()}`,
        marqueeDescription: 'Insights from 5,000+ marketing leaders worldwide.',
        marqueeImage: SAMPLE_PNG,
        bodyDescription: 'Key trends shaping the future of digital marketing.',
        cardTitle: 'Digital Marketing Report',
        cardDescription: 'Get the latest insights on digital marketing trends.',
        cardImage: SAMPLE_CARD_PNG,
        products: [],
        industry: '',
        seoTitle: 'State of Digital Marketing 2025 | Adobe',
        seoDescription: 'Discover key trends shaping the marketing landscape.',
        primaryProductName: '',
        experienceFragment: '',
        pdfAsset: SAMPLE_PDF,
        expectedCaasTag: 'caas:content-type/report',
      },
    },

    // =========================================================
    // E2E-003: Video/Demo (Parts A + B + C)
    // =========================================================
    {
      tcid: '2',
      name: '@lpb-e2e-video-demo: Full video/demo journey',
      path: '/tools/generator/landing-page',
      tags: '@lpb @e2e @ungated @video @smoke @regression @bacom',
      data: {
        contentType: 'Video/Demo',
        gated: 'Ungated',
        region: 'us',
        headline: `Nala E2E Video Demo ${Date.now()}`,
        marqueeDescription: 'See Adobe Analytics in action with this product walkthrough.',
        marqueeImage: SAMPLE_PNG,
        bodyDescription: 'Product experts demonstrate the power of Adobe Analytics.',
        cardTitle: 'Analytics Product Demo',
        cardDescription: 'Watch the full demo of Adobe Analytics.',
        cardImage: SAMPLE_CARD_PNG,
        products: [],
        industry: '',
        seoTitle: 'Adobe Analytics Demo | Adobe',
        seoDescription: 'Watch our product demo showcasing Adobe Analytics capabilities.',
        primaryProductName: '',
        experienceFragment: '',
        videoUrl: 'https://video.tv.adobe.com/v/3456789',
        expectedCaasTag: 'caas:content-type/demos-and-video',
      },
    },
  ],
};
