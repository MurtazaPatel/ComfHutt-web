const puppeteer = require('puppeteer');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const VIEWPORT = { width: 375, height: 667, isMobile: true, hasTouch: true }; // iPhone SE/6/7/8

async function runMobileSmokeTest() {
  console.log('📱 Starting Mobile Smoke Test...');
  console.log(`Target: ${BASE_URL}`);
  console.log(`Viewport: ${VIEWPORT.width}x${VIEWPORT.height}`);

  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport(VIEWPORT);
  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1');

  let errors = [];

  try {
    // 1. Homepage Load & Layout Check
    console.log('1️⃣  Testing Homepage...');
    await page.goto(`${BASE_URL}`, { waitUntil: 'networkidle0' });
    
    // Check for horizontal scroll
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const clientWidth = await page.evaluate(() => document.body.clientWidth);
    if (scrollWidth > clientWidth) {
        errors.push(`❌ Homepage has horizontal scroll: scrollWidth(${scrollWidth}) > clientWidth(${clientWidth})`);
    } else {
        console.log('✅ Homepage layout OK (no horizontal scroll)');
    }

    // Check Marketplace Button visibility (it might be in a hamburger menu or direct link)
    // On mobile landing, we expect a "Get Started" or "Marketplace" link.
    // Based on code: LandingNavbar has "GET STARTED" button and hamburger menu.
    
    // 2. Navigation to Marketplace
    console.log('2️⃣  Navigating to Marketplace...');
    // Try to find a link to marketplace. 
    // In LandingNavbar, "Marketplace" link is inside the hamburger menu or hidden on mobile?
    // Let's check if we can find a direct CTA or use the URL.
    // "GET STARTED" button calls redirectToChoices -> likely /choices or /marketplace.
    
    await page.goto(`${BASE_URL}/marketplace`, { waitUntil: 'networkidle0' });
    
    const marketplaceScrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const marketplaceClientWidth = await page.evaluate(() => document.body.clientWidth);
    
    if (marketplaceScrollWidth > marketplaceClientWidth) {
        errors.push(`❌ Marketplace has horizontal scroll: ${marketplaceScrollWidth} > ${marketplaceClientWidth}`);
    } else {
        console.log('✅ Marketplace layout OK');
    }

    // 3. Property Card Interaction
    console.log('3️⃣  Testing Property Card...');
    // Wait for properties to load
    await page.waitForSelector('div[role="article"]', { timeout: 5000 }).catch(() => console.log('⚠️ No property cards found (timeout)'));
    
    const propertyCards = await page.$$('div[role="article"]');
    if (propertyCards.length > 0) {
        console.log(`   Found ${propertyCards.length} property cards.`);
        
        // Check "Invest" or "View" button visibility on the first card
        // Note: In code, buttons might be hidden behind hover on desktop, but should be visible on mobile?
        // Actually the code for PropertyCard shows buttons are always there in the bottom section.
        
        // Click the first card to open modal
        await propertyCards[0].click();
        console.log('   Clicked property card.');
        
        // Wait for modal
        try {
            await page.waitForSelector('div[class*="fixed inset-0"]', { timeout: 3000 });
            console.log('✅ Property Detail Modal opened');
            
            // Close modal
            const closeBtn = await page.$('button svg.text-gray-800'); // X icon
            if (closeBtn) {
                 const closeButtonParent = await closeBtn.evaluateHandle(el => el.closest('button'));
                 await closeButtonParent.click();
                 console.log('✅ Modal closed successfully');
            } else {
                errors.push('❌ Could not find Close button in modal');
            }

        } catch (e) {
            errors.push('❌ Property Detail Modal did not open or load in time');
        }
        
    } else {
        errors.push('❌ No properties loaded on Marketplace');
    }

    // 4. Property Summary Page
    console.log('4️⃣  Testing Property Summary Page...');
    // We need a valid ID. Let's pick one if we can, or just use a mock ID if the app handles it gracefully (or mocks it).
    // The app uses mock data, so any ID might work if it uses getPropertyById logic.
    // Let's grab the ID from the card we found earlier if possible, or navigate to a known route.
    // We'll try to find a link in the card that goes to summary.
    
    const investButtons = await page.$$('a[href*="/properties/"]');
    if (investButtons.length > 0) {
        const investHref = await page.evaluate(el => el.getAttribute('href'), investButtons[0]);
        console.log(`   Navigating to summary: ${investHref}`);
        await page.goto(`${BASE_URL}${investHref}`, { waitUntil: 'networkidle0' });
        
        // Check for "Invest Now" button
        const summaryInvestBtn = await page.$('a[aria-label="Invest now"], button[aria-label="Invest now"]');
        if (summaryInvestBtn) {
            console.log('✅ "Invest Now" button found on Summary page');
        } else {
            // It might be sold out, check for sold out
            const soldOutBtn = await page.$('button[disabled]');
            const soldOutText = await page.evaluate(el => el ? el.innerText : '', soldOutBtn);
            if (soldOutText && soldOutText.includes('Sold Out')) {
                 console.log('✅ Property is Sold Out (Button verified)');
            } else {
                 errors.push('❌ "Invest Now" button missing on Summary page');
            }
        }

    } else {
        console.log('⚠️ Could not find an Invest link to follow to Summary page.');
    }


  } catch (err) {
    errors.push(`❌ Test script crashed: ${err.message}`);
  } finally {
    await browser.close();
  }

  console.log('\n📊 === TEST REPORT ===');
  if (errors.length === 0) {
    console.log('🟢 PASSED: All mobile checks passed.');
    process.exit(0);
  } else {
    console.log('🔴 FAILED: Found issues:');
    errors.forEach(e => console.log(e));
    process.exit(1);
  }
}

runMobileSmokeTest();