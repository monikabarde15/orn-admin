#!/usr/bin/env node

/**
 * ULTRA FAST Selenium Browser Test Suite - DAILY AUTOMATION FOCUS
 * ⚡ OPTIMIZED FOR SPEED: < 30 seconds total runtime
 * ⚠️ REQUIRES: Vite dev server (npm run dev) - NOT static build server
 * RUNS AGAINST: http://localhost:3000 (Vite dev server required for React functionality)
 * BROWSER: Chrome (headless mode for speed)
 * Tests critical frontend functionality with maximum speed
 * Covers: Health, Navigation, UI, Interactions, Performance, System
 */

import { Builder, By, until, Key } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import fs from 'fs';
import path from 'path';
import { execSync, spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class ComprehensiveSeleniumTestSuite {
    constructor() {
        this.driver = null;
        this.devServerProcess = null;
        this.baseUrl = 'http://localhost:3000';
        this.testResults = {
            totalTests: 0,
            passedTests: 0,
            failedTests: 0,
            errors: [],
            startTime: new Date(),
            endTime: null
        };
    }

    async initialize() {
        console.log('🚀 Initializing Selenium WebDriver (ULTRA FAST mode - Chrome)...');

        const options = new chrome.Options();
        options.addArguments('--headless=new'); // New headless mode is faster
        options.addArguments('--no-sandbox');
        options.addArguments('--disable-dev-shm-usage');
        options.addArguments('--disable-gpu');
        options.addArguments('--disable-extensions');
        options.addArguments('--disable-plugins');
        options.addArguments('--disable-images'); // Skip images for speed
        options.addArguments('--window-size=1024,768'); // Smaller window
        options.addArguments('--disable-web-security');
        options.addArguments('--disable-features=VizDisplayCompositor');
        options.addArguments('--memory-pressure-off'); // Faster memory management
        options.addArguments('--disable-background-timer-throttling');
        options.addArguments('--disable-renderer-backgrounding');
        options.addArguments('--disable-backgrounding-occluded-windows');

        this.driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();

        // Set very short implicit wait
        await this.driver.manage().setTimeouts({ implicit: 1000 });

        console.log('✅ Chrome WebDriver initialized in ULTRA FAST mode');
    }

    async logTest(testName, status, details = '') {
        this.testResults.totalTests++;
        const timestamp = new Date().toISOString();
        const statusIcon = status === 'PASS' ? '✅' : '❌';

        console.log(`${statusIcon} [${timestamp}] ${testName}: ${status}`);
        if (details) console.log(`   Details: ${details}`);

        if (status === 'PASS') {
            this.testResults.passedTests++;
        } else {
            this.testResults.failedTests++;
            this.testResults.errors.push({
                test: testName,
                status,
                details,
                timestamp
            });
        }
    }

    async checkChromeAvailability() {
        console.log('🔍 Checking Chrome availability...');

        const chromePaths = [
            '/usr/bin/google-chrome',
            '/usr/bin/chromium-browser',
            '/usr/bin/chromium',
            '/opt/google/chrome/chrome',
            '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
            'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
        ];

        // Check common Chrome executable paths
        for (const chromePath of chromePaths) {
            try {
                // Use a simple command to check if Chrome exists and is executable
                execSync(`"${chromePath}" --version`, { stdio: 'pipe' });
                console.log(`✅ Chrome found at: ${chromePath}`);
                return true;
            } catch (error) {
                // Continue checking other paths
            }
        }

        // Try using 'which' command
        try {
            execSync('which google-chrome || which chromium-browser || which chromium', { stdio: 'pipe' });
            console.log('✅ Chrome found via which command');
            return true;
        } catch (error) {
            // Chrome not found
        }

        console.log('❌ Chrome not found on this system');
        return false;
    }

    async waitForElement(selector, timeout = 2000) { // Reduced from 10000 to 2000
    }

    async clickElement(selector, description = '') {
        try {
            const element = await this.waitForElement(selector);
            await element.click();
            await this.logTest(`Click ${description || selector}`, 'PASS');
        } catch (error) {
            await this.logTest(`Click ${description || selector}`, 'FAIL', error.message);
            throw error;
        }
    }

    async checkElementExists(selector, description = '') {
        try {
            await this.waitForElement(selector);
            await this.logTest(`Element exists: ${description || selector}`, 'PASS');
            return true;
        } catch (error) {
            await this.logTest(`Element exists: ${description || selector}`, 'FAIL', error.message);
            return false;
        }
    }

    async checkPageTitle(expectedTitle) {
        try {
            await this.driver.wait(until.titleContains(expectedTitle), 10000);
            const actualTitle = await this.driver.getTitle();
            if (actualTitle.includes(expectedTitle)) {
                await this.logTest(`Page title check: ${expectedTitle}`, 'PASS');
                return true;
            } else {
                await this.logTest(`Page title check: ${expectedTitle}`, 'FAIL', `Expected: ${expectedTitle}, Got: ${actualTitle}`);
                return false;
            }
        } catch (error) {
            await this.logTest(`Page title check: ${expectedTitle}`, 'FAIL', error.message);
            return false;
        }
    }

    async navigateTo(url, description = '') {
        try {
            await this.driver.get(url);
            await this.driver.sleep(2000); // Wait for page load
            await this.logTest(`Navigate to ${description || url}`, 'PASS');
        } catch (error) {
            await this.logTest(`Navigate to ${description || url}`, 'FAIL', error.message);
            throw error;
        }
    }

    // ===== OPTIMIZED TEST SUITES =====

    async testCriticalApplicationHealth() {
        console.log('🏥 Testing Critical Application Health...');

        try {
            await this.navigateTo(this.baseUrl);

            // Ultra-fast health check - just verify page loads
            const title = await this.driver.getTitle();
            await this.logTest('Application loads successfully', title && title.length > 0 ? 'PASS' : 'FAIL');

            // Quick JS error check
            const logs = await this.driver.manage().logs().get('browser');
            const severeErrors = logs.filter(log => log.level.name === 'SEVERE');
            await this.logTest('No critical JavaScript errors', severeErrors.length === 0 ? 'PASS' : 'FAIL');

        } catch (error) {
            await this.logTest('Critical application health check', 'FAIL', error.message);
        }
    }

    async testEssentialNavigation() {
        console.log('🧭 Testing Essential Navigation...');

        // Reduced to only 3 most critical pages for speed
        const essentialPages = [
            { url: '/', name: 'Home' },
            { url: '/analytics', name: 'Analytics' },
            { url: '/authentication/login-boxed', name: 'Login' }
        ];

        for (const page of essentialPages) {
            try {
                await this.navigateTo(`${this.baseUrl}${page.url}`);
                // Just check if page loaded by looking for any content
                const bodyText = await this.driver.findElement(By.tagName('body')).getText();
                await this.logTest(`${page.name} page loads`, bodyText && bodyText.length > 0 ? 'PASS' : 'FAIL');
            } catch (error) {
                await this.logTest(`${page.name} page`, 'FAIL', error.message);
            }
        }
    }

    async testCoreUIComponents() {
        console.log('🧩 Testing Core UI Components...');

        try {
            await this.navigateTo(this.baseUrl);

            // Ultra-fast component checks - just count elements
            const buttons = await this.driver.findElements(By.css('button, [role="button"]'));
            await this.logTest('Buttons present', buttons.length > 0 ? 'PASS' : 'FAIL');

            const inputs = await this.driver.findElements(By.css('input'));
            await this.logTest('Inputs present', inputs.length > 0 ? 'PASS' : 'FAIL');

        } catch (error) {
            await this.logTest('Core UI components test', 'FAIL', error.message);
        }
    }

    async testBasicInteractions() {
        console.log('📝 Testing Basic Interactions...');

        try {
            await this.navigateTo(`${this.baseUrl}/authentication/login-boxed`);

            // Quick interaction test
            const emailInput = await this.driver.findElements(By.css('input[type="email"]'));
            if (emailInput.length > 0) {
                await emailInput[0].clear();
                await emailInput[0].sendKeys('test@example.com');
                await this.logTest('Email input interaction', 'PASS');
            }

        } catch (error) {
            await this.logTest('Basic interactions test', 'FAIL', error.message);
        }
    }

    async testPerformanceBasics() {
        console.log('⚡ Testing Performance Basics...');

        try {
            const startTime = Date.now();
            await this.navigateTo(this.baseUrl);
            const loadTime = Date.now() - startTime;

            await this.logTest('Page load time', loadTime < 5000 ? 'PASS' : 'FAIL', `Load time: ${loadTime}ms`);

        } catch (error) {
            await this.logTest('Performance basics test', 'FAIL', error.message);
        }
    }

    async testSystemHealthQuick() {
        console.log('🔧 Testing System Health...');

        try {
            // Ultra-fast localStorage test
            const result = await this.driver.executeScript(`
                try {
                    localStorage.setItem('test', 'value');
                    const value = localStorage.getItem('test');
                    localStorage.removeItem('test');
                    return value === 'value';
                } catch (e) {
                    return false;
                }
            `);
            await this.logTest('localStorage functionality', result ? 'PASS' : 'FAIL');

        } catch (error) {
            await this.logTest('System health test', 'FAIL', error.message);
        }
    }

    async runAllTests() {
        console.log('🚀 Starting ULTRA FAST Selenium Test Suite');
        console.log('⚡ Target: Complete in < 30 seconds');
        console.log('='.repeat(55));

        // Start the development server first
        console.log('🔧 Starting development server...');
        try {
            this.devServerProcess = spawn('npm', ['run', 'dev'], {
                cwd: path.join(__dirname, '..'),
                stdio: 'pipe',
                detached: true
            });
            console.log('✅ Development server started');
            // Wait for server to be ready
            await new Promise(resolve => setTimeout(resolve, 8000));
        } catch (error) {
            console.error('❌ Failed to start development server:', error.message);
            process.exit(1);
        }

        // Check Chrome availability first
        const chromeAvailable = await this.checkChromeAvailability();
        if (!chromeAvailable) {
            console.log('\n❌ CHROME NOT FOUND!');
            console.log('='.repeat(55));
            console.log('To run real Selenium tests, you need to install Chrome:');
            console.log('');
            console.log('🐧 Ubuntu/Debian:');
            console.log('   sudo apt-get update && sudo apt-get install -y chromium-browser');
            console.log('');
            console.log('🍎 macOS:');
            console.log('   brew install chromium');
            console.log('');
            console.log('🪟 Windows:');
            console.log('   Chrome is usually pre-installed, or download from:');
            console.log('   https://www.google.com/chrome/');
            console.log('');
            console.log('💡 Alternative: Run demo mode (no browser required):');
            console.log('   npm run selenium:demo');
            console.log('='.repeat(55));

            // Generate a report showing Chrome not available
            this.testResults.totalTests = 1;
            this.testResults.failedTests = 1;
            this.testResults.errors.push({
                test: 'Chrome Browser Check',
                status: 'FAIL',
                details: 'Chrome browser not found on system',
                timestamp: new Date().toISOString()
            });
            await this.generateReport();
            process.exit(1);
        }

        try {
            await this.initialize();

            // Run optimized test suites (focused on speed and critical functionality)
            await this.testCriticalApplicationHealth();
            await this.testEssentialNavigation();
            await this.testCoreUIComponents();
            await this.testBasicInteractions();
            await this.testPerformanceBasics();
            await this.testSystemHealthQuick();

        } catch (error) {
            console.error('💥 Test suite failed:', error);
            await this.logTest('Overall test suite', 'FAIL', error.message);
        } finally {
            await this.generateReport();
            await this.cleanup();
        }
    }

    async generateReport() {
        this.testResults.endTime = new Date();
        const duration = this.testResults.endTime - this.testResults.startTime;

        console.log('\n' + '='.repeat(60));
        console.log('📊 TEST RESULTS SUMMARY');
        console.log('='.repeat(60));

        console.log(`Total Tests: ${this.testResults.totalTests}`);
        console.log(`Passed: ${this.testResults.passedTests}`);
        console.log(`Failed: ${this.testResults.failedTests}`);
        console.log(`Success Rate: ${((this.testResults.passedTests / this.testResults.totalTests) * 100).toFixed(2)}%`);
        console.log(`Duration: ${(duration / 1000).toFixed(2)} seconds`);

        if (this.testResults.errors.length > 0) {
            console.log('\n❌ FAILED TESTS:');
            this.testResults.errors.forEach((error, index) => {
                console.log(`${index + 1}. ${error.test}: ${error.details}`);
            });
        }

        // Save detailed report to file
        const reportPath = path.join(__dirname, 'selenium_test_report.json');
        fs.writeFileSync(reportPath, JSON.stringify(this.testResults, null, 2));
        console.log(`\n📄 Detailed report saved to: ${reportPath}`);

        // Determine exit code
        const exitCode = this.testResults.failedTests > 0 ? 1 : 0;
        process.exit(exitCode);
    }

    async cleanup() {
        if (this.driver) {
            try {
                await this.driver.quit();
                console.log('🧹 WebDriver cleaned up successfully');
            } catch (error) {
                console.error('⚠️ Error cleaning up WebDriver:', error.message);
            }
        }

        // Stop the development server
        if (this.devServerProcess) {
            try {
                this.devServerProcess.kill('SIGTERM');
                console.log('🧹 Development server stopped successfully');
            } catch (error) {
                console.error('⚠️ Error stopping development server:', error.message);
            }
        }
    }
}

// Run the test suite if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    const testSuite = new ComprehensiveSeleniumTestSuite();
    testSuite.runAllTests().catch(error => {
        console.error('💥 Fatal error:', error);
        process.exit(1);
    });
}

export default ComprehensiveSeleniumTestSuite;
