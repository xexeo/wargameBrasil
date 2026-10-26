import { messages } from './i18n-messages.js';
import { dataTranslations } from './i18n-data.js';
import { browserStore } from './persistence.js';
const storageKey = 'monte-castelo-language-v1';
export let language = browserStore.read(storageKey) === 'en-US' ? 'en-US' : 'pt-BR';
const catalog = messages;
const exact = new Map(Object.values(catalog).filter(m => !m.pt.includes('{')).map(m => [m.pt, m.en]));
export function t(key, ...values) {
    const message = catalog[key];
    if (!message)
        throw new Error(`Missing translation key: ${key}`);
    const text = language === 'en-US' ? message.en : message.pt;
    return text.replace(/\{(\d+)\}/g, (_, i) => String(typeof values[+i] === 'string' ? translateData(values[+i]) : values[+i] ?? ''));
}
export function setLanguage(value) { language = value; browserStore.write(storageKey, value); document.documentElement.lang = value; }
export function localizedDate(iso) { return new Intl.DateTimeFormat(language, { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: language === 'en-US' }).format(new Date(iso)); }
// Only known source messages are matched. Game state and imported unit names are never rewritten.
export function translateData(source) {
    if (language === 'pt-BR')
        return source;
    if (dataTranslations[source] !== undefined)
        return dataTranslations[source];
    if (exact.has(source))
        return exact.get(source);
    let m;
    if (m = source.match(/^Neutralize todas as peças alemãs ou assegure Monte Castelo até o fim da rodada (\d+)\. Acumule (\d+) pontos e segure o cume para antecipar a vitória\. No último fechamento, o cume basta; sem a meta de pontos, a vitória é custosa\.$/))
        return `Neutralize every German counter or secure Monte Castelo by the end of round ${m[1]}. Accumulate ${m[2]} points and hold the summit for an earlier victory. At the final round ending, holding the summit is enough; without the point target, victory is costly.`;
    if (m = source.match(/^Acumule (\d+) pontos ou elimine a defesa em até (\d+) rodadas, conforme as regras legadas desta partida\.$/))
        return `Accumulate ${m[1]} points or eliminate the defense within ${m[2]} rounds, following this saved game’s legacy rules.`;
    if (m = source.match(/^Neutralize todas as peças alemãs ou acumule (\d+) pontos( e assegure Monte Castelo com infantaria)? até o fim da rodada (\d+)\.$/))
        return `Neutralize every German counter or accumulate ${m[1]} points${m[2] ? ' and secure Monte Castelo with infantry' : ''} by the end of round ${m[3]}.`;
    if (source === '21 de fevereiro de 1945. Os batalhões do Sampaio avançam com apoio da artilharia.')
        return 'February 21, 1945. The Sampaio battalions advance with artillery support.';
    if (m = source.match(/^(Fogo defensivo · )?(.+) → (.+): dado (\d+)( \+ barragem)?, (\d+) dano(, contra-ataque: 1 dano)?( · reação suprimida)?\.$/))
        return `${m[1] ? 'Defensive fire · ' : ''}${translateData(m[2])} → ${translateData(m[3])}: die ${m[4]}${m[5] ? ' + barrage' : ''}, ${m[6]} damage${m[7] ? ', counterattack: 1 damage' : ''}${m[8] ? ' · reaction suppressed' : ''}.`;
    if (m = source.match(/^(.+): retirada por perdas para (\d+-\d+); próxima ação comprometida, sem recuperar PV\.$/))
        return `${translateData(m[1])}: withdrawal after losses to ${m[2]}; next action committed, no HP recovered.`;
    if (m = source.match(/^Fim da rodada (\d+): \+(\d+) pontos para a FEB\.$/))
        return `End of round ${m[1]}: +${m[2]} points for the FEB.`;
    if (source === '16:48 · Concentração de artilharia: ataques da bateria FEB recebem +1 nesta rodada.')
        return '16:48 · Concentrated artillery fire: FEB battery attacks receive +1 this round.';
    if (m = source.match(/^A infantaria chegou ao cume, mas terminou com (\d+)\/(\d+) pontos\. O prazo encerrou antes de completar a ocupação exigida\.$/))
        return `Infantry reached the summit but finished with ${m[1]}/${m[2]} points. The deadline passed before the required occupation was completed.`;
    if (m = source.match(/^Não restam peças alemãs em combate\. A vitória foi por neutralização da força adversária\. (No encerramento, .+?) Peças fora de combate não equivalem a todos os soldados mortos\.$/)) {
        const status = m[1] === 'No encerramento, o cume está ocupado pela infantaria brasileira.' ? 'At the end, Brazilian infantry occupies the summit.' : m[1] === 'No encerramento, há apoio brasileiro no cume; apoio não assegura objetivos.' ? 'At the end, Brazilian support is on the summit; support cannot secure objectives.' : 'At the end, no Brazilian counter is on the summit.';
        return `No German counters remain in action. Victory came through neutralizing the opposing force. ${status} Counters out of action do not mean all soldiers were killed.`;
    }
    if (m = source.match(/^Não restam peças alemãs em combate\.( Monte Castelo também está ocupado\.| O cume não foi ocupado; a vitória foi por neutralização da força adversária\.) Peças fora de combate não equivalem a todos os soldados mortos\.$/))
        return `No German counters remain in action.${m[1].startsWith(' Monte Castelo') ? ' Monte Castelo is also occupied.' : ' The summit was not occupied; victory came through neutralizing the opposing force.'} Counters out of action do not mean all soldiers were killed.`;
    const policy = { strong: 'hunter', weak: 'opportunist', tactical: 'general staff', aggressive: 'aggressive', defensive: 'defensive' };
    if (m = source.match(/^ · (strong|weak|tactical) \/ (aggressive|defensive)$/))
        return ` · ${policy[m[1]]} / ${policy[m[2]]}`;
    // Proper names, symbols, numbers and caller-provided names retain their original spelling.
    return source;
}
const staticTexts = [];
const staticAttributes = [];
export function initializeStaticTranslations() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while (node = walker.nextNode()) {
        if (node.parentElement?.closest('script,style'))
            continue;
        const source = node.data.replace(/\s+/g, ' ').trim();
        if (exact.has(source))
            staticTexts.push({ node, source });
    }
    for (const node of document.querySelectorAll('[aria-label],[alt],[title],[placeholder]'))
        for (const name of ['aria-label', 'alt', 'title', 'placeholder']) {
            const source = node.getAttribute(name);
            if (source && exact.has(source))
                staticAttributes.push({ node, name, source });
        }
    applyStaticTranslations();
}
export function applyStaticTranslations() {
    document.documentElement.lang = language;
    for (const { node, source } of staticTexts)
        if (node.isConnected)
            node.data = language === 'en-US' ? exact.get(source) : source;
    for (const { node, name, source } of staticAttributes)
        if (node.isConnected)
            node.setAttribute(name, language === 'en-US' ? exact.get(source) : source);
}
// Used by the browser audit to verify every catalog key and parameter in both languages.
export function translationCoverage() {
    return Object.entries(catalog).map(([key, m]) => ({ key, pt: m.pt, en: m.en, parametersMatch: JSON.stringify([...m.pt.matchAll(/\{\d+\}/g)].map(x => x[0]).sort()) === JSON.stringify([...m.en.matchAll(/\{\d+\}/g)].map(x => x[0]).sort()) }));
}
// Ephemeral messages in an open dialog or storage status retain their content on language changes.
export function translateRenderedMessage(source) {
    const message = Object.values(catalog).find(m => m.pt === source || m.en === source);
    return message ? (language === 'en-US' ? message.en : message.pt) : translateData(source);
}
//# sourceMappingURL=i18n.js.map