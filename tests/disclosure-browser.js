import { getPower } from '../data/disciplines.js';
import { legacyPowerReminder } from '../js/ui/disclosure.js';

// Run with a temporary browser profile: exercises real reload and file input events.
export async function runTests() {
    const key = 'vtm-v6-character-sheet';
    const original = localStorage.getItem(key);
    const passed = [];
    const check = (condition, message) => {
        if (!condition) throw new Error(message);
        passed.push(message);
    };
    const frame = document.createElement('iframe');
    frame.title = 'UX regression fixture';
    frame.style.cssText = 'width:100%;height:800px';
    const loaded = () => new Promise((resolve) => frame.addEventListener('load', resolve, {once:true}));
    const source = getPower('Corruption', 'Nightmare Glimpses');
    const fixture = {
        mode: "play",
        identity: {name:'UX fixture', clan:'Ministry', sire:'Cruel Sire', sireDiscipline:'Obfuscate', playLevel:'neonate', generation:11, generationModifier:1},
        skills: {persuasion:{dots:3, focus:'negotiating, intimidation'}},
        resources:[{name:'Contact',dots:2,details:'Contact note'}],
        disciplines:[{name:'Corruption',dots:2,powers:[{name:source.name,cost:source.cost,reminder:legacyPowerReminder(source)}]},
            {name:'Obfuscate',dots:1,powers:[{name:'Custom power',cost:'1',reminder:'Personal power note'}]}],
        lifepaths:['Criminal','Military'], nature:'Survivor', merit:'Bond Famulus',
        beast:'Personal Beast', frenzyTrigger:'Personal frenzy', outburstTrigger:'Personal outburst',
        items:'Personal items', flaw:'Personal flaw', currentVitae:10, currentWillpower:5
    };
    const saved = () => JSON.parse(localStorage.getItem(key));
    const doc = () => frame.contentDocument;
    const byId = (id) => doc().getElementById(id);
    const change = (id, value) => {
        const element = byId(id); element.value = value;
        element.dispatchEvent(new frame.contentWindow.Event('change', {bubbles:true}));
    };
    try {
        localStorage.setItem(key, JSON.stringify(fixture));
        frame.src = new URL('../index.html', import.meta.url).href;
        let waiting = loaded(); document.body.appendChild(frame); await waiting;
        check(byId('nature').value === 'Survivor', 'Old partial sheet loads without new character fields');
        check(doc().querySelectorAll('.skill-focus').length === 2, 'Old focus text normalizes on load');
        check([...doc().querySelectorAll('details:not(.lifepath-allocation-panel)')].filter(panel=>!panel.closest('#notes-dialog')).every((panel) => !panel.open), 'All rule panels start collapsed');
        check(!byId('curse') && byId('clan-curse-description').closest('details'), 'Curse has one full description and no duplicate form field');
        check(byId('nature-outburst-effect').closest('details') && !byId('nature-outburst-name').closest('details'), 'Nature keeps Outburst name visible and effect collapsed');
        check(byId('merit-description').textContent.includes('Animalism 1+') && byId('merit-rule').closest('details'), 'Merit prerequisites remain visible with full description collapsed');
        check(byId('merit-description').textContent.length < byId('merit-rule').textContent.length, 'Long merit is shortened in normal view');
        frame.style.width = '390px';
        check(doc().documentElement.scrollWidth <= doc().documentElement.clientWidth, 'Compact sheet fits a 390px viewport without horizontal overflow');
        frame.style.width = '100%';
        const firstPower = () => doc().querySelector('.power-row');
        check(firstPower().querySelector('details') && !firstPower().querySelector('details').open, 'Power effects start collapsed');
        check(firstPower().querySelector('.power-activation').textContent.includes('Rank'), 'Power rank and activation have a compact readout');
        check(firstPower().querySelector('.power-cost').textContent === source.cost, 'Power cost retains the complete unit in the visible readout');
        check(firstPower().querySelector('details input').value === '', 'Generated legacy reminder is not shown as personal notes');
        check(doc().querySelectorAll('.power-row details > input')[1].value === 'Personal power note', 'Custom power notes remain editable');
        const panel = byId('beast-rules');
        byId('beast-rules-link').click();
        check(panel.open && doc().activeElement === panel.querySelector('summary'), 'Clan link opens and focuses the single Beast reference');
        panel.open = false;
        const resources = JSON.stringify(saved().resources);
        change('sire', 'secretive');
        check(saved().identity.sireDiscipline === 'Obfuscate' && byId('sire-discipline').value === 'Obfuscate', 'Sire change keeps a valid Discipline selection');
        change('sire', 'caring');
        check(saved().identity.sireDiscipline === 'Fortitude' && saved().disciplines.some((d) => d.name === 'Obfuscate' && d.dots === 1), 'Sire change replaces only invalid selection and keeps investments');
        change('clan', 'lasombra');
        check(!byId('clan-special-discipline-field').hidden, 'Variable Clan Discipline selector appears');
        change('clan-special-discipline', 'Oblivion');
        check(saved().identity.clanDisciplineChoice === 'Oblivion', 'Dependent Clan selection persists');
        change('clan', 'brujah');
        check(byId('clan-special-discipline-field').hidden && saved().disciplines.some((d) => d.name === 'Oblivion'), 'Clan change clears unavailable slot but preserves independent Disciplines');
        check([...byId('clan-trait-1').options].some(o=>o.value==='Combat Reflexes'), 'Higher-tier catalog trait remains visible because Traits are table-authoritative');
        change('play-level', 'ancilla');
        const disciplineCard = name=>[...byId('disciplines').children].find(card=>card.querySelector('.discipline-head select').value===name);
        disciplineCard('Celerity').querySelectorAll('.dots button')[2].click();
        change('clan-trait-1','Combat Reflexes');
        check(byId('clan-trait-1').value==='Combat Reflexes', 'Tier and Discipline changes refresh trait eligibility');
        disciplineCard('Potence').querySelectorAll('.dots button')[1].click();
        change('nature', 'Scientist');
        const skillRow = [...byId('lifepath-allocation-0').querySelectorAll('[data-kind=skills] .allocation-row')].find((row) => row.dataset.choice === 'Subterfúgio');
        skillRow.querySelector('[data-action=plus]').click();
        change('lifepath-0', 'Technician');
        check(saved().lifepathAllocations[0].skills[0] === 'Subterfúgio', 'Lifepath change preserves an allocation shared by both paths');
        change('lifepath-0', 'Military');
        check(saved().lifepathAllocations[0].skills[0] === '', 'Lifepath change clears an unavailable allocation');
        check(JSON.stringify(saved().resources) === resources && saved().skills.persuasion.dots === 3, 'Selection changes never distribute final skill or resource dots');
        check(['beast','frenzyTrigger','outburstTrigger','items','flaw'].every((field) => saved()[field] === fixture[field]), 'Clan, Nature, Sire, tier and Lifepath changes preserve personal fields');
        // Count actual persistence calls, not merely idempotent resulting values.
        const storageProto = frame.contentWindow.Storage.prototype;
        const originalSet = storageProto.setItem;
        let saves = 0;
        storageProto.setItem = function(...args) { saves++; return originalSet.apply(this,args); };
        for (const tier of ['elder','neonate','ancilla']) change('play-level', tier);
        saves = 0;
        change('clan-trait-1', 'Prowess');
        check(saves === 1, 'Rerendering does not multiply selection listeners');
        saves = 0;
        byId('quickening-plus').click();
        check(saves === 1 && saved().quickening === 1, 'Rerendering does not multiply resource actions');
        storageProto.setItem = originalSet;
        const beforeReload = JSON.stringify(saved());
        waiting = loaded(); frame.contentWindow.location.reload(); await waiting;
        check(JSON.stringify(saved()) === beforeReload && byId('nature').value === 'Scientist' && byId('quickening').value === '1', 'Reload preserves choices, notes and resource values');
        check(saved().disciplines.find((d) => d.name === 'Corruption').powers[0].reminder === legacyPowerReminder(source), 'Legacy generated reminders survive normalization and saves');
        // Intercept only the download, exercising the real Export button and Blob contents.
        let exported;
        frame.contentWindow.URL.createObjectURL = (blob) => { exported = blob; return 'blob:ux-test'; };
        frame.contentWindow.URL.revokeObjectURL = () => {};
        frame.contentWindow.HTMLAnchorElement.prototype.click = () => {};
        byId('export-button').click();
        const exportedText = await exported.text();
        check(JSON.stringify(JSON.parse(exportedText)) === JSON.stringify(saved()), 'Export contains the complete saved character');
        const transfer = new frame.contentWindow.DataTransfer();
        transfer.items.add(new frame.contentWindow.File([exportedText], 'roundtrip.vtm6.json', {type:'application/json'}));
        byId('import-file').files = transfer.files;
        waiting = loaded();
        byId('import-file').dispatchEvent(new frame.contentWindow.Event('change',{bubbles:true}));
        await waiting;
        check(JSON.stringify(saved()) === beforeReload && byId('beast').value === 'Personal Beast', 'Import through file input reloads and preserves the exported sheet');
        const legacyTransfer = new frame.contentWindow.DataTransfer();
        legacyTransfer.items.add(new frame.contentWindow.File([JSON.stringify({identity:{name:'Legacy'},skills:{athletics:{dots:1,focus:'Running'}}})], 'legacy.json'));
        byId('import-file').files = legacyTransfer.files;
        waiting = loaded();
        byId('import-file').dispatchEvent(new frame.contentWindow.Event('change',{bubbles:true}));
        await waiting;
        check(byId('character-name').value === 'Legacy' && saved().attributes.strength === 1 && saved().lifepathAllocations.length === 2, 'Legacy import supplies defaults and keeps base Attributes at one');
        return passed;
    } finally {
        frame.remove();
        if (original === null) localStorage.removeItem(key); else localStorage.setItem(key,original);
    }
}
