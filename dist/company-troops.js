/** Scenario labels A/B/C describe organization, not verified company numbers. */
export function buildCompanyProfiles(base) {
    const companies = [];
    for (let battalion = 1; battalion <= 3; battalion++)
        for (let company = 0; company < 3; company++) {
            const parent = base.find(p => p.id === `b${battalion}`), roman = ['I', 'II', 'III'][battalion - 1], letter = ['A', 'B', 'C'][company];
            companies.push({ ...parent, id: `c-b${battalion}${letter.toLowerCase()}`, q: company === 2 ? battalion * 2 - 1 : battalion * 2 - 1 + company, r: company === 2 ? 8 : 7, name: `${letter}/${roman}/1º RI`, echelon: 'Companhia de fuzileiros', mark: 'I', commandGroup: `br-${roman}`, formation: `${roman}/1º RI · Sampaio`, atk: 2, def: 2, description: 'Companhia de fuzileiros do 1º RI. A/B/C são etiquetas de cenário, não números históricos confirmados. Três companhias por batalhão seguem a organização conhecida; posição e prontidão iniciais são hipóteses. Armas orgânicas integram o perfil. Só uma companhia deste batalhão recebe ordens no turno; o comando não multiplica os fogos ao dividir o escalão.' });
        }
    for (const source of base.filter(p => !['b1', 'b2', 'b3'].includes(p.id))) {
        const p = { ...source, id: `c-${source.id}` };
        if (p.side === 'br') {
            p.q = source.id === 'b4' ? 6 : 2;
            p.r = 8;
            p.atk = source.atk - 1;
            p.def = source.id === 'b4' ? 1 : source.def;
        }
        else if (p.type === 'infantry') {
            p.atk = Math.max(1, p.atk - 1);
            p.def = Math.max(1, p.def - 1);
            p.echelon = 'Destacamento de cenário · referência companhia';
        }
        else
            p.atk = 3;
        companies.push(p);
    }
    return companies;
}
//# sourceMappingURL=company-troops.js.map