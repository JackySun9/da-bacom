const path = require('path');

const ASSETS_DIR = path.join(__dirname, 'assets');
const SAMPLE_PNG = path.join(ASSETS_DIR, 'sample-marquee.png');
const SAMPLE_CARD_PNG = path.join(ASSETS_DIR, 'sample-card.png');
const SAMPLE_PDF = path.join(ASSETS_DIR, 'sample-guide.pdf');

module.exports = {
  name: 'Landing Page Builder',
  features: [
    // =========================================================
    // 1.1 Core Options & Form Flow
    // =========================================================
    {
      tcid: '0',
      name: '@lpb-initial-state: Only Core Options visible on fresh load',
      path: '/tools/generator/landing-page',
      tags: '@lpb @core @smoke @regression @bacom',
      data: {},
    },
    {
      tcid: '1',
      name: '@lpb-confirm-disabled: Confirm disabled without all core fields',
      path: '/tools/generator/landing-page',
      tags: '@lpb @core @smoke @regression @bacom',
      data: {},
    },
    {
      tcid: '2',
      name: '@lpb-url-auto-generation: URL auto-generates from inputs',
      path: '/tools/generator/landing-page',
      tags: '@lpb @core @smoke @regression @bacom',
      data: {
        contentType: 'Guide',
        gated: 'Gated',
        region: 'us',
        headline: 'Nala LPB Test Auto URL',
      },
    },
    {
      tcid: '3',
      name: '@lpb-confirm-shows-form: Full form appears after confirm',
      path: '/tools/generator/landing-page',
      tags: '@lpb @core @smoke @regression @bacom',
      data: {
        contentType: 'Report',
        gated: 'Ungated',
        region: 'us',
        headline: 'Nala LPB Confirm Test',
      },
    },
    {
      tcid: '4',
      name: '@lpb-reset-form: Reset clears all fields and returns to initial state',
      path: '/tools/generator/landing-page',
      tags: '@lpb @core @regression @bacom',
      data: {
        contentType: 'Guide',
        gated: 'Gated',
        region: 'us',
        headline: 'Nala LPB Reset Test',
      },
    },

    // =========================================================
    // 1.2 Required Field Validation
    // =========================================================
    {
      tcid: '5',
      name: '@lpb-missing-required-error: Error toast when required fields missing',
      path: '/tools/generator/landing-page',
      tags: '@lpb @validation @smoke @regression @bacom',
      data: {
        contentType: 'Guide',
        gated: 'Ungated',
        region: 'us',
        headline: 'Nala LPB Validation Test',
      },
    },
    {
      tcid: '6',
      name: '@lpb-gated-validation: Gated-specific fields required',
      path: '/tools/generator/landing-page',
      tags: '@lpb @validation @gated @regression @bacom',
      data: {
        contentType: 'Guide',
        gated: 'Gated',
        region: 'us',
        headline: 'Nala LPB Gated Validation',
      },
    },

    // =========================================================
    // 1.3 Image Upload
    // =========================================================
    {
      tcid: '7',
      name: '@lpb-marquee-image-upload: Valid PNG upload shows preview',
      path: '/tools/generator/landing-page',
      tags: '@lpb @image @smoke @regression @bacom',
      data: {
        contentType: 'Guide',
        gated: 'Ungated',
        region: 'us',
        headline: 'Nala Image Upload Test',
        imagePath: SAMPLE_PNG,
      },
    },
    {
      tcid: '8',
      name: '@lpb-image-delete-reupload: Delete and re-upload image',
      path: '/tools/generator/landing-page',
      tags: '@lpb @image @regression @bacom',
      data: {
        contentType: 'Guide',
        gated: 'Ungated',
        region: 'us',
        headline: 'Nala Image Delete Test',
        imagePath: SAMPLE_PNG,
      },
    },

    // =========================================================
    // 1.4 PDF Upload
    // =========================================================
    {
      tcid: '9',
      name: '@lpb-pdf-upload: Valid PDF upload shows file info',
      path: '/tools/generator/landing-page',
      tags: '@lpb @pdf @smoke @regression @bacom',
      data: {
        contentType: 'Guide',
        gated: 'Gated',
        region: 'us',
        headline: 'Nala PDF Upload Test',
        pdfPath: SAMPLE_PDF,
      },
    },
    {
      tcid: '10',
      name: '@lpb-pdf-clear: Clear PDF and re-upload',
      path: '/tools/generator/landing-page',
      tags: '@lpb @pdf @regression @bacom',
      data: {
        contentType: 'Report',
        gated: 'Ungated',
        region: 'us',
        headline: 'Nala PDF Clear Test',
        pdfPath: SAMPLE_PDF,
      },
    },
    {
      tcid: '11',
      name: '@lpb-video-hides-pdf: Video/Demo hides PDF, shows video input',
      path: '/tools/generator/landing-page',
      tags: '@lpb @pdf @content-type @smoke @regression @bacom',
      data: {
        contentType: 'Video/Demo',
        gated: 'Ungated',
        region: 'us',
        headline: 'Nala Video Type Test',
      },
    },

    // =========================================================
    // 1.5 Multi-Select Products
    // =========================================================
    {
      tcid: '12',
      name: '@lpb-multi-select-products: Select multiple CaaS products',
      path: '/tools/generator/landing-page',
      tags: '@lpb @multi-select @smoke @regression @bacom',
      data: {
        contentType: 'Guide',
        gated: 'Ungated',
        region: 'us',
        headline: 'Nala Multi Select Test',
      },
    },
    {
      tcid: '13',
      name: '@lpb-remove-product-tag: Remove tag by clicking X',
      path: '/tools/generator/landing-page',
      tags: '@lpb @multi-select @regression @bacom',
      data: {
        contentType: 'Guide',
        gated: 'Ungated',
        region: 'us',
        headline: 'Nala Remove Tag Test',
      },
    },
    {
      tcid: '14',
      name: '@lpb-dropdown-close-outside: Dropdown closes on outside click',
      path: '/tools/generator/landing-page',
      tags: '@lpb @multi-select @regression @bacom',
      data: {
        contentType: 'Guide',
        gated: 'Ungated',
        region: 'us',
        headline: 'Nala Dropdown Close Test',
      },
    },

    // =========================================================
    // 1.6 Form State Persistence
    // =========================================================
    {
      tcid: '15',
      name: '@lpb-persist-on-refresh: Form data persists across refresh',
      path: '/tools/generator/landing-page',
      tags: '@lpb @persistence @smoke @regression @bacom',
      data: {
        contentType: 'Report',
        gated: 'Ungated',
        region: 'us',
        headline: 'Nala Persistence Test',
      },
    },
    {
      tcid: '16',
      name: '@lpb-reset-clears-storage: Reset clears localStorage',
      path: '/tools/generator/landing-page',
      tags: '@lpb @persistence @regression @bacom',
      data: {
        contentType: 'Guide',
        gated: 'Gated',
        region: 'us',
        headline: 'Nala Reset Storage Test',
      },
    },

    // =========================================================
    // 1.7 Rich Text Formatting
    // =========================================================
    {
      tcid: '17',
      name: '@lpb-rich-text-bold: Bold formatting in body description',
      path: '/tools/generator/landing-page',
      tags: '@lpb @rich-text @regression @bacom',
      data: {
        contentType: 'Guide',
        gated: 'Ungated',
        region: 'us',
        headline: 'Nala Rich Text Bold Test',
      },
    },
    {
      tcid: '18',
      name: '@lpb-rich-text-italic: Italic formatting in body description',
      path: '/tools/generator/landing-page',
      tags: '@lpb @rich-text @regression @bacom',
      data: {
        contentType: 'Guide',
        gated: 'Ungated',
        region: 'us',
        headline: 'Nala Rich Text Italic Test',
      },
    },
    {
      tcid: '19',
      name: '@lpb-rich-text-bullets: Bullet list in body description',
      path: '/tools/generator/landing-page',
      tags: '@lpb @rich-text @regression @bacom',
      data: {
        contentType: 'Guide',
        gated: 'Ungated',
        region: 'us',
        headline: 'Nala Rich Text Bullets Test',
      },
    },
  ],
};
