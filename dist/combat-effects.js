import { troopProfile } from './troops.js';
export function combatWeapon(event) {
    const profile = troopProfile(event.from.id);
    return profile?.type === 'artillery' ? 'artillery' : profile?.role === 'support' ? 'mortar' : 'infantry';
}
/** Presentation only: transient shots never enter game state or delay an action. */
export function createCombatEffects(map, announcement, describe, getOptions = () => ({ animations: true, duration: 650 }), onStart) {
    const queue = [];
    let current = null, last = null, started = 0, currentDuration = 650, timer, frame;
    const center = ({ q, r }) => ({ x: 65 + q * 64 + r * 32, y: 63 + r * 56 });
    const animated = () => getOptions().animations && !matchMedia('(prefers-reduced-motion: reduce)').matches;
    function flight() {
        if (!current)
            return null;
        const from = center(current.from), to = center(current.to), weapon = combatWeapon(current), distance = Math.hypot(to.x - from.x, to.y - from.y);
        const height = weapon === 'mortar' ? Math.min(170, Math.max(70, distance * .55)) : Math.min(130, Math.max(45, distance * .28));
        const control = { x: (from.x + to.x) / 2, y: Math.min(from.y, to.y) - height };
        return { from, to, weapon, control, path: weapon === 'infantry' ? `M${from.x} ${from.y}L${to.x} ${to.y}` : `M${from.x} ${from.y}Q${control.x} ${control.y} ${to.x} ${to.y}` };
    }
    function positionProjectiles() {
        const group = map.querySelector('.combat-effect'), geometry = flight();
        if (!group || !geometry || !current)
            return;
        const enabled = animated();
        group.classList.toggle('combat-static', !enabled);
        group.dataset.animated = String(enabled);
        const progress = Math.min(1, Math.max(0, (performance.now() - started) / (currentDuration * .62))), { from, to, weapon, control } = geometry;
        const impact = group.querySelector('.combat-impact');
        if (impact)
            impact.style.visibility = !enabled || progress >= 1 ? 'visible' : 'hidden';
        if (!enabled)
            return;
        if (weapon === 'infantry') {
            for (const [index, bullet] of Array.from(group.querySelectorAll('.combat-bullet')).entries()) {
                const p = (performance.now() - started) / (currentDuration * .45) - index * .14, visible = p >= 0 && p <= 1;
                bullet.style.visibility = visible ? 'visible' : 'hidden';
                if (!visible)
                    continue;
                const tail = Math.max(0, p - .10);
                bullet.setAttribute('x1', String(from.x + (to.x - from.x) * tail));
                bullet.setAttribute('y1', String(from.y + (to.y - from.y) * tail));
                bullet.setAttribute('x2', String(from.x + (to.x - from.x) * p));
                bullet.setAttribute('y2', String(from.y + (to.y - from.y) * p));
            }
        }
        else {
            const projectile = group.querySelector('.combat-projectile');
            if (projectile) {
                const p = progress, q = 1 - p, x = q * q * from.x + 2 * q * p * control.x + p * p * to.x, y = q * q * from.y + 2 * q * p * control.y + p * p * to.y, angle = Math.atan2(2 * q * (control.y - from.y) + 2 * p * (to.y - control.y), 2 * q * (control.x - from.x) + 2 * p * (to.x - control.x)) * 180 / Math.PI;
                projectile.setAttribute('transform', `translate(${x} ${y}) rotate(${angle})`);
                projectile.style.visibility = progress < 1 ? 'visible' : 'hidden';
            }
        }
    }
    function animateFrame() { frame = undefined; positionProjectiles(); if (current && animated())
        frame = requestAnimationFrame(animateFrame); }
    function redraw() {
        map.querySelector('.combat-effect')?.remove();
        announcement.textContent = last ? describe(last).announcement : '';
        if (!current)
            return;
        const geometry = flight(), { from, to, weapon, path } = geometry, { label } = describe(current), delay = -Math.max(0, performance.now() - started);
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.setAttribute('class', `combat-effect combat-weapon-${weapon}`);
        group.setAttribute('pointer-events', 'none');
        group.setAttribute('aria-hidden', 'true');
        group.dataset.combatKind = current.kind;
        group.dataset.from = `${current.from.q},${current.from.r}`;
        group.dataset.to = `${current.to.q},${current.to.r}`;
        group.dataset.weapon = weapon;
        group.dataset.damage = String(current.damage);
        group.style.setProperty('--combat-delay', `${delay}ms`);
        group.style.setProperty('--combat-duration', `${currentDuration}ms`);
        const scale = Number(getComputedStyle(map).getPropertyValue('--ui-uiScale')) || 1;
        const width = Math.max(130 * scale, Math.min(420 * scale, (label.length * 9 + 24) * scale)), labelX = Math.max(width / 2 + 5, Math.min(955 - width / 2, to.x)), labelY = Math.max(26 * scale, to.y - 42);
        const projectile = weapon === 'infantry' ? '<g class="combat-projectiles"><line class="combat-bullet"/><line class="combat-bullet"/><line class="combat-bullet"/></g>' : weapon === 'mortar' ? '<g class="combat-projectile"><ellipse rx="5" ry="4"/><path d="M-5 -4L-8 -5V5L-5 4Z"/></g>' : '<g class="combat-projectile"><path d="M-8 -4H3L10 0L3 4H-8Z"/></g>';
        group.innerHTML = `<defs><marker id="combat-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10Z" fill="var(--ui-combatTrace)"/></marker></defs><path class="combat-trace-halo" d="${path}"/><path class="combat-trace" d="${path}" marker-end="url(#combat-arrow)"/>${projectile}<circle class="combat-muzzle" cx="${from.x}" cy="${from.y}" r="10"/><g class="combat-impact" transform="translate(${to.x} ${to.y})"><circle class="combat-impact-ring" r="28"/><path class="combat-burst" d="M0 -29L7 -13L23 -23L14 -7L31 0L14 7L23 23L7 14L0 31L-7 14L-23 23L-14 7L-31 0L-14 -7L-23 -23L-7 -14Z"/><circle class="combat-impact-center" r="9"/></g><g class="combat-label"><rect x="${labelX - width / 2}" y="${labelY - 22 * scale}" width="${width}" height="${31 * scale}" rx="5"/><text x="${labelX}" y="${labelY}" text-anchor="middle"></text></g>`;
        group.querySelector('text').textContent = label;
        if (!current.damage)
            group.classList.add('combat-miss');
        map.appendChild(group);
        positionProjectiles();
        if (frame !== undefined)
            cancelAnimationFrame(frame);
        frame = animated() ? requestAnimationFrame(animateFrame) : undefined;
    }
    function next() {
        if (frame !== undefined)
            cancelAnimationFrame(frame);
        frame = undefined;
        current = queue.shift() ?? null;
        timer = undefined;
        if (!current) {
            redraw();
            return;
        }
        const configured = getOptions().duration;
        currentDuration = Number.isFinite(configured) ? Math.max(250, Math.min(1500, configured)) : 650;
        started = performance.now();
        last = current;
        try {
            onStart?.(current);
        }
        catch { /* Optional sound cannot interrupt visual feedback. */ }
        redraw();
        timer = setTimeout(next, currentDuration);
    }
    function enqueue(event) { queue.push(event); if (!current)
        next(); }
    function clear() { if (timer !== undefined)
        clearTimeout(timer); if (frame !== undefined)
        cancelAnimationFrame(frame); frame = undefined; timer = undefined; queue.length = 0; current = null; last = null; announcement.textContent = ''; redraw(); }
    return { enqueue, redraw, clear };
}
//# sourceMappingURL=combat-effects.js.map