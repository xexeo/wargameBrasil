import { troopProfile } from './troops.js';
export function combatWeapon(event) {
    const profile = troopProfile(event.from.id);
    return profile?.type === 'artillery' ? 'artillery' : profile?.role === 'support' ? 'mortar' : 'infantry';
}
/** Transient presentation, independent of gameplay RNG and serialized state. */
export function createCombatEffects(map, announcement, describe, getOptions = () => ({ animations: true, duration: 650 }), onStart) {
    const queue = [], idleCallbacks = [];
    let current = null, last = null, started = 0, currentDuration = 650, sequence = 0, variant = 0, timer, frame;
    const center = ({ q, r }) => ({ x: 65 + q * 64 + r * 32, y: 63 + r * 56 });
    const animated = () => getOptions().animations && !matchMedia('(prefers-reduced-motion: reduce)').matches;
    function flight() {
        if (!current)
            return null;
        const from = center(current.from), to = center(current.to), weapon = combatWeapon(current), dx = to.x - from.x, dy = to.y - from.y, distance = Math.hypot(dx, dy);
        const sway = (variant % 2 ? 1 : -1) * (8 + variant * 3), height = (weapon === 'mortar' ? Math.min(165, Math.max(65, distance * .48)) : Math.min(90, Math.max(28, distance * .19))) * (1 + (variant - 2) * .06);
        const c1 = { x: from.x + dx * .30 + sway, y: from.y + dy * .30 - height }, c2 = { x: from.x + dx * .72 - sway * .5, y: from.y + dy * .72 - height * .58 };
        const control = { x: (from.x + to.x) / 2 + sway, y: Math.min(from.y, to.y) - height };
        const path = weapon === 'infantry' ? `M${from.x} ${from.y}L${to.x} ${to.y}` : weapon === 'mortar' ? `M${from.x} ${from.y}Q${control.x} ${control.y} ${to.x} ${to.y}` : `M${from.x} ${from.y}C${c1.x} ${c1.y} ${c2.x} ${c2.y} ${to.x} ${to.y}`;
        const point = (p) => { const q = 1 - p; return weapon === 'infantry' ? { x: from.x + dx * p, y: from.y + dy * p } : weapon === 'mortar' ? { x: q * q * from.x + 2 * q * p * control.x + p * p * to.x, y: q * q * from.y + 2 * q * p * control.y + p * p * to.y } : { x: q * q * q * from.x + 3 * q * q * p * c1.x + 3 * q * p * p * c2.x + p * p * p * to.x, y: q * q * q * from.y + 3 * q * q * p * c1.y + 3 * q * p * p * c2.y + p * p * p * to.y }; };
        return { from, to, weapon, path, point, distance };
    }
    function positionProjectiles() {
        const group = map.querySelector('.combat-effect'), g = flight();
        if (!group || !g || !current)
            return;
        const enabled = animated();
        group.classList.toggle('combat-static', !enabled);
        group.dataset.animated = String(enabled);
        const elapsed = (performance.now() - started) / currentDuration, progress = Math.max(0, Math.min(1, elapsed / .62));
        const impact = group.querySelector('.combat-impact');
        if (impact)
            impact.style.visibility = !enabled || progress >= 1 ? 'visible' : 'hidden';
        for (const trail of group.querySelectorAll('.combat-trace,.combat-trace-halo')) {
            trail.style.strokeDasharray = `${Math.max(.001, progress)} 1`;
        }
        if (!enabled)
            return;
        if (g.weapon === 'infantry') {
            const angle = Math.atan2(g.to.y - g.from.y, g.to.x - g.from.x) * 180 / Math.PI;
            for (const [index, bullet] of Array.from(group.querySelectorAll('.combat-bullet')).entries()) {
                const p = elapsed / .43 - index * (.13 + variant * .015);
                bullet.style.visibility = p >= 0 && p <= 1 ? 'visible' : 'hidden';
                if (p < 0 || p > 1)
                    continue;
                const pos = g.point(p), spread = (index - 1) * (2 + variant * .3) * Math.sin(p * Math.PI);
                bullet.setAttribute('transform', `translate(${pos.x},${pos.y + spread}) rotate(${angle})`);
            }
        }
        else {
            const projectile = group.querySelector('.combat-projectile');
            if (projectile) {
                const pos = g.point(progress), ahead = g.point(Math.min(1, progress + .012)), behind = g.point(Math.max(0, progress - .012)), angle = Math.atan2(ahead.y - behind.y, ahead.x - behind.x) * 180 / Math.PI;
                projectile.setAttribute('transform', `translate(${pos.x} ${pos.y}) rotate(${angle})`);
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
        const { from, to, weapon, path } = flight(), { label } = describe(current), delay = -Math.max(0, performance.now() - started);
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.setAttribute('class', `combat-effect combat-weapon-${weapon}`);
        group.setAttribute('pointer-events', 'none');
        group.setAttribute('aria-hidden', 'true');
        Object.assign(group.dataset, { combatKind: current.kind, from: `${current.from.q},${current.from.r}`, to: `${current.to.q},${current.to.r}`, weapon, damage: String(current.damage), variant: String(variant) });
        group.style.setProperty('--combat-delay', `${delay}ms`);
        group.style.setProperty('--combat-duration', `${currentDuration}ms`);
        const scale = Number(getComputedStyle(map).getPropertyValue('--ui-uiScale')) || 1, width = Math.max(130 * scale, Math.min(420 * scale, (label.length * 9 + 24) * scale)), labelX = Math.max(width / 2 + 5, Math.min(955 - width / 2, to.x)), labelY = Math.max(26 * scale, to.y - 42);
        const bullet = '<g class="combat-bullet"><path class="ammo-body" d="M-6 -2.2H1C5 -2.2 8 -.8 8 0S5 2.2 1 2.2H-6Z"/><path class="ammo-streak" d="M-23 0H-9"/></g>';
        const projectile = weapon === 'infantry' ? `<g class="combat-projectiles">${bullet.repeat(3)}</g>` : weapon === 'mortar' ? '<g class="combat-projectile ammo-mortar"><ellipse class="ammo-body" rx="8" ry="4.5"/><path class="ammo-fins" d="M-7 -2H-12L-15 -6H-17V6H-15L-12 2H-7Z"/><path class="ammo-band" d="M3 -4V4"/></g>' : '<g class="combat-projectile ammo-shell"><path class="ammo-body" d="M-10 -4.5H2C8 -4.5 12 -1.5 12 0S8 4.5 2 4.5H-10Z"/><path class="ammo-band" d="M-6 -5V5M-3 -5V5"/><path class="ammo-fins" d="M-10 -4.5V4.5"/></g>';
        group.innerHTML = `<path class="combat-trace-halo" pathLength="1" d="${path}"/><path class="combat-trace" pathLength="1" d="${path}"/>${projectile}<circle class="combat-muzzle" cx="${from.x}" cy="${from.y}" r="8"/><g class="combat-impact" transform="translate(${to.x} ${to.y})"><circle class="combat-impact-ring" r="27"/><path class="combat-burst" d="M0 -27L7 -13L23 -23L14 -7L29 0L14 7L23 23L7 14L0 29L-7 14L-23 23L-14 7L-29 0L-14 -7L-23 -23L-7 -14Z"/><circle class="combat-impact-center" r="8"/></g><g class="combat-label"><rect x="${labelX - width / 2}" y="${labelY - 22 * scale}" width="${width}" height="${31 * scale}" rx="5"/><text x="${labelX}" y="${labelY}" text-anchor="middle"></text></g>`;
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
            const callbacks = idleCallbacks.splice(0);
            for (const callback of callbacks)
                callback();
            return;
        }
        variant = ++sequence % 5;
        const configured = getOptions().duration;
        currentDuration = Number.isFinite(configured) ? Math.max(250, Math.min(1500, configured)) : 650;
        started = performance.now();
        last = current;
        try {
            onStart?.(current);
        }
        catch { }
        redraw();
        timer = setTimeout(next, currentDuration);
    }
    function enqueue(event) { queue.push(event); if (!current)
        next(); }
    function clear() { if (timer !== undefined)
        clearTimeout(timer); if (frame !== undefined)
        cancelAnimationFrame(frame); frame = undefined; timer = undefined; queue.length = 0; idleCallbacks.length = 0; current = null; last = null; announcement.textContent = ''; redraw(); }
    function whenIdle(callback) { if (current || queue.length)
        idleCallbacks.push(callback);
    else
        callback(); }
    // Only presentation events are discarded; game state and combat logs are untouched.
    function limitPending(count) { const keep = Math.max(0, Math.floor(count)); if (queue.length > keep)
        queue.splice(0, queue.length - keep); }
    return { enqueue, redraw, clear, whenIdle, limitPending };
}
//# sourceMappingURL=combat-effects.js.map