import { normalizeCharacter } from '../js/model/character.js';
import { migrateCharacter } from '../js/model/migrations.js';
import { ensureCreationSlots } from '../js/model/creation.js';
import { frenzyDifficulty } from '../js/model/frenzy.js';
import { resistancePool } from '../js/model/humanity.js';
import { validateCharacter } from '../js/model/validation.js';
import { CURRENT_SCHEMA_VERSION } from '../data/schema.js';
import { tierRules } from '../data/tiers.js';
import { ATTRIBUTE_GROUPS } from '../data/attributes.js';
import { merits } from '../data/merits.js';
import { clans } from '../data/clans.js';
import { lifepaths } from '../data/lifepaths.js';
import { assertCharacter } from '../js/storage.js';

function fixture(tier, dots) {
    return {version:2, identity:{name:'Creation fixture',clan:'Brujah',playLevel:tier,generationModifier:2},
        attributes:{strength:dots}, resources:[{name:'Contact',dots,details:'Keep contact details'}],
        disciplines:[{name:'Potence',dots,powers:[{name:'Custom power',cost:'1',reminder:'Keep notes'}]}],
        lifepaths:['Criminal','Military','Diplomat','Harpy'],
        clanTraits:['Prowess','Spark of Rage','Wrestler','Combat Reflexes'],
        merit:'Bond Resistant — original legacy text', beast:'Keep Beast notes', currentVitae:4,
        lifepathAllocations:Array.from({length:4},()=>({skills:['Percepção','','','',''],resources:['Riqueza','','']}))};
}

export function runModelTests() {
    const passed = [];
    const check = (ok, message) => { if (!ok) throw new Error(message); passed.push(message); };
    const legacy = fixture('ancilla',6);
    const original = JSON.stringify(legacy);
    const migrated = migrateCharacter(legacy);
    check(migrated.version === CURRENT_SCHEMA_VERSION && migrated.merits[0] === legacy.merit && migrated.merit === legacy.merit, 'v2 migration retains legacy merit and creates merits array');
    check(JSON.stringify(legacy) === original, 'Migration never mutates the source object');
    check(JSON.stringify(migrateCharacter(migrated)) === JSON.stringify(migrated), 'Migration is idempotent');
    check(normalizeCharacter({identity:{}}).version === CURRENT_SCHEMA_VERSION, 'Unversioned sheets migrate sequentially to current schema');
    for (const [tier,dots,paths,meritCount,traits,skills,resources] of [
        ['neonate',5,2,1,2,18,9], ['ancilla',6,3,2,3,23,14], ['elder',8,4,3,4,28,19]
    ]) {
        const c = normalizeCharacter(fixture(tier,dots));
        check(c.attributes.strength === dots && c.resources[0].dots === dots && c.disciplines[0].dots === dots, tier+' import keeps high Attribute/Resource/Discipline dots');
        const fresh = normalizeCharacter({identity:{playLevel:tier}});
        check(fresh.lifepaths.length === paths && fresh.merits.length === meritCount && fresh.clanTraits.length === traits, tier+' creates the correct number of slots');
        const budget = tierRules[tier].creation;
        c.lifepaths = lifepaths.slice(0,paths).map((path)=>path.name);
        c.lifepathAllocations.length = paths;
        Object.values(ATTRIBUTE_GROUPS).forEach((group,index)=>{
            let pool=budget.attributePools[index];
            group.forEach(([key])=>{const spend=Math.min(pool,3); c.attributes[key]=1+spend; pool-=spend;});
        });
        Object.values(c.skills).forEach((skill,index)=>skill.dots=Math.min(3,Math.max(0,skills-index*3)));
        c.resources=Array.from({length:Math.ceil(resources/3)},(_,index)=>({name:'Resource',dots:Math.min(3,resources-index*3),details:''}));
        c.disciplines=[{name:'Potence',dots:budget.disciplineDots,powers:Array.from({length:budget.powers},()=>({name:'Custom',cost:'',reminder:''}))},{name:'Presence',dots:1,powers:[]}];
        c.merits=merits.slice(0,meritCount).map(m=>m.name);
        c.clanTraits=clans[0].traits.slice(0,traits).map(t=>t.name);
        const warnings=validateCharacter(c);
        check(!warnings.some(w=>/Caminhos de Vida:|distribuição de Atributos|Pontos de Disciplina|Poderes de Disciplina:|Méritos:|Traços de Clã:|Pontos de Habilidade:|Pontos de Recursos:/.test(w)),tier+' validates all creation budgets');
        c.resources[0].dots--;
        c.skills.athletics.dots--;
        c.disciplines[0].dots--;
        c.disciplines[0].powers.pop();
        c.merits.pop(); c.clanTraits.pop(); c.attributes.strength--;
        const invalid=validateCharacter(c).join('\n');
        check(['Pontos de Recursos:', 'Pontos de Habilidade:', 'Pontos de Disciplina', 'Poderes de Disciplina:', 'Méritos:', 'Traços de Clã:', 'distribuição de Atributos'].every(text=>invalid.includes(text)),tier+' reports each mismatched budget');
        c.lifepaths=['Criminal'];
        const young=validateCharacter(c).join('\n');
        check(young.includes('exceção de personagem jovem') && !young.includes('Pontos de Habilidade:'),tier+' leaves young-character compensation to the table');
    }
    const elder=normalizeCharacter(fixture('elder',8));
    elder.merits=['Bond Resistant','Code of Honor','Fleetness'];
    elder.identity.playLevel='neonate'; ensureCreationSlots(elder);
    const restored=normalizeCharacter(elder);
    check(restored.attributes.strength===8 && restored.disciplines[0].dots===8 && restored.resources[0].dots===8 && restored.lifepaths.length===4 && restored.clanTraits.length===4 && restored.merits.length===3, 'Downgrade and renormalization keep all excess choices and ratings');
    check(validateCharacter(restored).some(w=>w.includes('acima dos slots')) && validateCharacter(restored).some(w=>w.includes('limite de criação')), 'Downgrade warns instead of deleting data');
    check(tierRules.ancilla.creation.maxDots===6 && tierRules.ancilla.inPlay.clanDisciplineMax===7 && tierRules.ancilla.inPlay.nonClanDisciplineMax===5, 'Creation and in-play Discipline limits are separate');
    const brujah=normalizeCharacter({identity:{clan:'Brujah',generationModifier:2},currentVitae:4});
    check(frenzyDifficulty(brujah,2)===4 && frenzyDifficulty(brujah,5)===7,'Boiling Passion adds generation modifier to any Frenzy base');
    check(resistancePool(brujah,'beast').difficulty===7 && resistancePool(brujah,'nature').difficulty===5,'Brujah affects Beast Frenzy but never Nature Outburst');
    brujah.identity.clan='Ministry';
    check(frenzyDifficulty(brujah,2)===2 && resistancePool(brujah,'beast').difficulty===5,'Other clans keep base Frenzy difficulty');
    let rejected=0;
    for(const value of [{identity:{},version:CURRENT_SCHEMA_VERSION+1},{identity:{},merits:'invalid'},{identity:{},merits:[5]}]){
        try {assertCharacter(value);} catch {rejected++;}
    }
    check(rejected===3,'Schema rejects future versions and malformed merits');
    return passed;
}

export async function runTests() {
    const passed=runModelTests();
    const check=(ok,message)=>{if(!ok)throw new Error(message);passed.push(message);};
    const key='vtm-v6-character-sheet', original=localStorage.getItem(key);
    const frame=document.createElement('iframe'); frame.title='Creation regression fixture';frame.style.cssText='width:100%;height:900px';
    const loaded=()=>new Promise((resolve,reject)=>{
        const timer=setTimeout(()=>reject(new Error('Fixture failed to load')),8000);
        frame.addEventListener('load',()=>{clearTimeout(timer);resolve();},{once:true});
    });
    const doc=()=>frame.contentDocument, byId=id=>doc().getElementById(id), saved=()=>JSON.parse(localStorage.getItem(key));
    const change=(id,value,type='change')=>{const el=byId(id);el.value=value;el.dispatchEvent(new frame.contentWindow.Event(type,{bubbles:true}));};
    const importSheet=async sheet=>{
        const transfer=new frame.contentWindow.DataTransfer();
        transfer.items.add(new frame.contentWindow.File([JSON.stringify(sheet)],'fixture.json',{type:'application/json'}));
        byId('import-file').files=transfer.files;
        const wait=loaded(); byId('import-file').dispatchEvent(new frame.contentWindow.Event('change',{bubbles:true}));await wait;
    };
    try {
        localStorage.removeItem(key);
        let wait=loaded();frame.src=new URL('../index.html',import.meta.url).href;document.body.append(frame);await wait;
        check(byId('character-name').value==='' && byId('clan').value==='' && byId('resources').children.length===0,'First visit starts an empty sheet with no Resource rows');
        check(localStorage.getItem(key)===null,'First visit never writes example or replacement data');
        check(byId('sire-description').closest('details').hidden,'No Sire means no description panel');
        check(!byId('clan-frenzy-description'),'Identity keeps Frenzy name/link without repeating its rule');
        check(byId('quickening').closest('article').querySelector('details:not([open])'),'Quickening detailed rule starts collapsed');
        const currentNeonate = normalizeCharacter({identity:{name:'Current Neonate',playLevel:'neonate'},merit:'Code of Honor'});
        await importSheet(currentNeonate);
        check(saved().version===CURRENT_SCHEMA_VERSION && saved().merits[0]==='Code of Honor' && byId('character-name').value==='Current Neonate', 'Current Neonate file imports without remigration or data loss');
        change('play-level','elder');
        check(doc().querySelectorAll('#clan-traits select').length===4 && doc().querySelectorAll('#merits select').length===3 && doc().querySelectorAll('.lifepath-card').length===4,'Selecting Elder creates 4 paths, 4 Traits and 3 Merits');
        byId('add-resource').click();
        const preset=byId('resources').querySelector('select');
        check([...preset.options].some(o=>o.value==='__custom__'),'New Resource offers presets and custom choice');
        preset.value='Refúgio';preset.dispatchEvent(new frame.contentWindow.Event('change',{bubbles:true}));
        const details=byId('resources').querySelector('input[aria-label^="Detalhes"]');details.value='Keep haven address';details.dispatchEvent(new frame.contentWindow.Event('input',{bubbles:true}));
        preset.value='__custom__';preset.dispatchEvent(new frame.contentWindow.Event('change',{bubbles:true}));
        const name=byId('resources').querySelector('input[aria-label^="Nome"]');name.value='Special haven';name.dispatchEvent(new frame.contentWindow.Event('input',{bubbles:true}));
        check(saved().resources[0].name==='Special haven' && saved().resources[0].details==='Keep haven address','Resource presets/custom names keep personal details');
        for(const [tier,dots] of [['neonate',5],['ancilla',6],['elder',8]]) {
            await importSheet(fixture(tier,dots));
            check(saved().version===CURRENT_SCHEMA_VERSION && saved().attributes.strength===dots && saved().resources[0].dots===dots && saved().disciplines[0].dots===dots,tier+' actual v2 file import migrates without clipping');
            check(byId('attributes').querySelector('.dots').children.length===dots && byId('resources').querySelector('.dots').children.length===dots && byId('disciplines').querySelector('.dots').children.length===dots,tier+' rating controls show the allowed dots');
            check(saved().merit===fixture(tier,dots).merit && saved().merits[0]===saved().merit,tier+' file import preserves singular merit and creates the array');
        }
        change('merit-2','Code of Honor');change('merit-3','Fleetness');
        const before={lifepaths:JSON.stringify(saved().lifepaths), traits:JSON.stringify(saved().clanTraits), merits:JSON.stringify(saved().merits), allocation:JSON.stringify(saved().lifepathAllocations)};
        change('play-level','neonate');wait=loaded();frame.contentWindow.location.reload();await wait;
        check(saved().attributes.strength===8 && saved().resources[0].dots===8 && saved().disciplines[0].dots===8,'Tier reduction plus reload keeps 8-dot values');
        check(JSON.stringify(saved().lifepaths)===before.lifepaths && JSON.stringify(saved().clanTraits)===before.traits && JSON.stringify(saved().merits)===before.merits && JSON.stringify(saved().lifepathAllocations)===before.allocation,'Tier reduction plus reload preserves every populated slot and allocation');
        check(byId('validation-list').textContent.includes('acima dos slots') && byId('merit-3-description').textContent.includes('excedente'),'Excess slots stay editable with visible warnings');
        change('play-level','elder');
        check(!byId('merit-3-description').textContent.includes('excedente'),'Restoring tier removes excess-slot warnings');
        let exported;
        frame.contentWindow.URL.createObjectURL=blob=>{exported=blob;return 'blob:test';};frame.contentWindow.URL.revokeObjectURL=()=>{};
        frame.contentWindow.HTMLAnchorElement.prototype.click=()=>{};
        byId('export-button').click();const backup=JSON.parse(await exported.text());
        check(backup.version===CURRENT_SCHEMA_VERSION && backup.merits.length===3 && backup.attributes.strength===8,'Current export retains schema, multiple merits and high dots');
        await importSheet(backup);
        check(saved().merits[2]==='Fleetness' && saved().attributes.strength===8 && saved().beast==='Keep Beast notes','Current schema reimports without losing choices or personal notes');
        // Known slot at index 0 was Criminal in this fixture; use its visible counter controls.
        const skills=JSON.stringify(saved().skills),resources=JSON.stringify(saved().resources);
        const group=byId('lifepath-allocation-0').querySelector('[data-kind=skills]');
        const row=group.querySelector('.allocation-row');
        for(let i=0;i<7;i++)group.querySelector('[data-action=plus]:not(:disabled)')?.click();
        check(group.querySelector('.allocation-total').textContent==='Total: 5/5' && [...group.querySelectorAll('[data-action=plus]')].every(b=>b.disabled),'Lifepath skill counters stop at five points');
        row.querySelector('[data-action=minus]').click();
        check(group.querySelector('.allocation-total').textContent==='Total: 4/5','Minus removes exactly one allocated skill point');
        const rg=byId('lifepath-allocation-0').querySelector('[data-kind=resources]');
        for(let i=0;i<5;i++)rg.querySelector('[data-action=plus]').click();
        check(rg.querySelector('.allocation-total').textContent==='Total: 3/3','Resource allocation stops at three');
        check(JSON.stringify(saved().skills)!==skills && JSON.stringify(saved().resources)===resources,'Skill counters sync Habilidades while Resource totals remain manual');
        check(!byId('lifepaths').querySelector('select.lifepath-skill-choice'),'Repeated allocation selectors are gone');
        frame.style.width='390px';
        check(doc().documentElement.scrollWidth<=doc().documentElement.clientWidth,'Elder sheet and counters fit a mobile viewport');
        // Brujah modifiers refresh with both generation and Clan changes.
        change('generation-modifier','2','input');
        byId('beast-points').querySelectorAll('button')[4].click();
        byId('nature-points').querySelectorAll('button')[4].click();
        check(byId('beast-resistance').textContent.includes('dificuldade 7') && byId('nature-resistance').textContent.includes('dificuldade 5'),'UI applies Boiling Passion only to Frenzy resistance');
        check(byId('hunger-effect').textContent.includes('frenesi de fome: 4'),'Hunger Frenzy includes Brujah modifier');
        byId('willpower-tracker').querySelector('button').click();byId('willpower-tracker').querySelector('button').click();
        check(byId('willpower-tracker').nextElementSibling.textContent.includes('dificuldade 4'),'Rage Frenzy reminder includes Brujah modifier');
        change('clan','ministry');
        check(byId('beast-resistance').textContent.includes('dificuldade 5') && byId('hunger-effect').textContent.includes('frenesi de fome: 2'),'Changing Clan refreshes all Frenzy calculations');
        return passed;
    } finally {
        frame.remove();
        if(original===null)localStorage.removeItem(key);else localStorage.setItem(key,original);
    }
}
