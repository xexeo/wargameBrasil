import { combatWeapon } from './combat-effects.js';
/** Original procedural effects: no downloads, recordings, gameplay RNG or game state. */
export function createCombatAudio(getOptions) {
    let context = null, master = null, noiseSeed = 0x91e10da5;
    const active = new Set();
    function sync() {
        if (!context || !master)
            return;
        const options = getOptions(), volume = Number.isFinite(options.volume) ? Math.max(0, Math.min(1, options.volume)) : 0;
        master.gain.cancelScheduledValues(context.currentTime);
        master.gain.setTargetAtTime(options.enabled ? volume * .28 : 0, context.currentTime, .015);
    }
    async function unlock() {
        if (!getOptions().enabled)
            return;
        try {
            if (!context) {
                const Constructor = globalThis.AudioContext ?? globalThis.webkitAudioContext;
                if (!Constructor)
                    return;
                context = new Constructor();
                master = context.createGain();
                const compressor = context.createDynamicsCompressor();
                compressor.threshold.value = -16;
                compressor.knee.value = 12;
                compressor.ratio.value = 8;
                master.connect(compressor);
                compressor.connect(context.destination);
            }
            sync();
            if (context.state === 'suspended')
                await context.resume();
        }
        catch { /* Unavailable/blocked audio never interrupts the game. */ }
    }
    function track(source, cleanup) { active.add(source); source.onended = () => { active.delete(source); source.disconnect(); cleanup(); }; }
    function noise(start, length, cutoff, level) {
        const ctx = context, buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * length), ctx.sampleRate), data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
            noiseSeed ^= noiseSeed << 13;
            noiseSeed ^= noiseSeed >>> 17;
            noiseSeed ^= noiseSeed << 5;
            data[i] = ((noiseSeed >>> 0) / 0x100000000) * 2 - 1;
        }
        const source = ctx.createBufferSource(), filter = ctx.createBiquadFilter(), gain = ctx.createGain();
        source.buffer = buffer;
        filter.type = 'lowpass';
        filter.frequency.value = cutoff;
        gain.gain.setValueAtTime(.0001, start);
        gain.gain.exponentialRampToValueAtTime(level, start + .004);
        gain.gain.exponentialRampToValueAtTime(.0001, start + length);
        source.connect(filter);
        filter.connect(gain);
        gain.connect(master);
        track(source, () => { filter.disconnect(); gain.disconnect(); });
        source.start(start);
        source.stop(start + length);
    }
    function tone(start, length, frequency, endFrequency, level) {
        const ctx = context, oscillator = ctx.createOscillator(), gain = ctx.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, start);
        oscillator.frequency.exponentialRampToValueAtTime(endFrequency, start + length);
        gain.gain.setValueAtTime(.0001, start);
        gain.gain.exponentialRampToValueAtTime(level, start + .006);
        gain.gain.exponentialRampToValueAtTime(.0001, start + length);
        oscillator.connect(gain);
        gain.connect(master);
        track(oscillator, () => gain.disconnect());
        oscillator.start(start);
        oscillator.stop(start + length);
    }
    function play(event) {
        if (!getOptions().enabled || !context || context.state !== 'running' || !master || active.size > 72)
            return;
        try {
            sync();
            const now = context.currentTime + .008, weapon = combatWeapon(event);
            const duration = getOptions().duration ?? 650, flight = Math.max(.12, Math.min(.85, duration * .00062));
            if (weapon === 'infantry') {
                for (let i = 0; i < 3; i++) {
                    noise(now + i * .065, .065, 5500, .5);
                    tone(now + i * .065, .075, 170, 70, .3);
                }
            }
            else if (weapon === 'mortar') {
                noise(now, .10, 1500, .4);
                tone(now, .12, 180, 65, .6);
                tone(now + .09, Math.max(.08, flight - .09), 460, 190, .12);
                noise(now + flight, .36, 1600, .85);
                tone(now + flight, .40, 90, 34, .8);
            }
            else {
                noise(now, .16, 2400, .9);
                tone(now, .18, 120, 42, .8);
                tone(now + .10, Math.max(.08, flight - .10), 300, 105, .14);
                noise(now + flight, .48, 1900, 1);
                tone(now + flight, .55, 70, 25, .95);
            }
        }
        catch { /* Rendering/audio failures must not alter combat or random draws. */ }
    }
    function mute() {
        if (context && master) {
            master.gain.cancelScheduledValues(context.currentTime);
            master.gain.setValueAtTime(0, context.currentTime);
        }
        for (const source of active) {
            try {
                source.stop();
            }
            catch { }
        }
        active.clear();
    }
    return { unlock, play, mute, sync };
}
//# sourceMappingURL=combat-audio.js.map