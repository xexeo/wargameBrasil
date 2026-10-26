import {test,expect} from '@playwright/test';
test('header menu adapts to phone width and supports keyboard, dismissal and translated navigation',async({page})=>{
 await page.goto('/');await page.locator('#begin').click();
 const state=await page.evaluate(()=>localStorage.getItem('monte-castelo-session-v1'));
 await page.setViewportSize({width:390,height:844});
 const toggle=page.locator('#menuToggle');await expect(toggle).toBeVisible();await expect(page.locator('#headerMenu')).not.toBeVisible();
 await toggle.focus();await page.keyboard.press('Enter');await expect(toggle).toHaveAttribute('aria-expanded','true');
 await page.keyboard.press('Tab');await expect(page.locator('#appearance')).toBeFocused();
 await page.keyboard.press('Escape');await expect(toggle).toBeFocused();await expect(page.locator('#headerMenu')).not.toBeVisible();
 await toggle.click();await page.locator('#rules').click();await expect(page.locator('#modal')).toBeVisible();await expect(toggle).toHaveAttribute('aria-expanded','false');await page.locator('#closeBottom').click();
 await toggle.click();await page.locator('#gameLogo').click();await expect(toggle).toHaveAttribute('aria-expanded','false');
 await page.selectOption('#language','en-US');await toggle.click();await expect(page.locator('#headerMenu')).toHaveAttribute('aria-label','Game menu');await expect(page.locator('#appearance')).toHaveText('Appearance');
 await page.setViewportSize({width:1440,height:1000});await expect(toggle).not.toBeVisible();await expect(page.locator('#appearance')).toBeVisible();
 expect(await page.evaluate(()=>localStorage.getItem('monte-castelo-session-v1'))).toBe(state);
});
