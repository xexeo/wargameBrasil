export async function clickNavigation(page,id){
 const target=page.locator('#'+id),toggle=page.locator('#menuToggle');
 if(await page.locator('#headerMenu #'+id).count()&&await toggle.isVisible()&&await toggle.getAttribute('aria-expanded')!=='true')await toggle.click();
 await target.click();
}
