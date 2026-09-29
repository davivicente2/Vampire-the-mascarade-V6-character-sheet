import { normalizeCharacter } from '../js/model/character.js';
import { assertCharacter } from '../js/storage.js';
import { traitIssues, meritIssues, powerIssues, disciplineDots } from '../js/model/eligibility.js';
import { canSetRating, ratingLimit, disciplineChoices } from '../js/model/selection-limits.js';
import { validateCharacter } from '../js/model/validation.js';
import { clans } from '../data/clans.js';
import { merits } from '../data/merits.js';
import { getAvailablePowers } from '../data/disciplines.js';
import { CURRENT_SCHEMA_VERSION } from '../data/schema.js';

export function runModelTests() {
    const passed = [];
    const check = (ok, message) => { if (!ok) throw new Error(message); passed.push(message); };
    const make = (clan='Brujah', tier='neonate') => normalizeCharacter({identity:{clan, playLevel:tier, generationModifier:1}});
    function satisfy(character, requirements) {
        for (const r of requirements || []) {
            if (r.any) satisfy(character, [r.any[0]]);
            else if (r.discipline) character.disciplines.push({name:r.discipline,dots:r.dots,powers:[]});
            else if (r.attribute) character.attributes[r.attribute] = r.dots;
            else character.identity.generationModifier = r.generationModifier;
        }
    }
    for (const clan of clans) for (const trait of clan.traits) {
        const c = make(clan.name, trait.tier);
        satisfy(c, trait.requirements);
        check(!traitIssues(c, trait).length, clan.name + ' / ' + trait.name + ' is available at its exact tier and Discipline prerequisites');
        c.identity.playLevel = trait.tier === 'ancilla' ? 'neonate' : '';
        check(traitIssues(c, trait).some(text=>text.includes('Requer')), trait.name + ' rejects a tier below its requirement');
    }
    for (const merit of merits) {
        const c = make(); satisfy(c, merit.requirements);
        check(!meritIssues(c, merit).length, merit.name + ' accepts its documented prerequisites');
        if (merit.requirements?.length) {
            c.disciplines = []; c.attributes.stamina = 1; c.identity.generationModifier = 0;
            check(meritIssues(c, merit).length > 0, merit.name + ' is unavailable when requirements are missing');
        }
    }
    const lasombra = make('Lasombra', 'ancilla');
    const oppression = clans.find(c=>c.name==='Lasombra').traits.find(t=>t.name==='Oppressing Dominance');
    lasombra.disciplines = [{name:'Dominate',dots:2,powers:[]},{name:'Corruption',dots:1,powers:[]}];
    check(!traitIssues(lasombra,oppression).length,'OR prerequisite accepts Corruption instead of Oblivion');
    lasombra.disciplines[1].name='Oblivion';
    check(!traitIssues(lasombra,oppression).length,'OR prerequisite also accepts Oblivion');
    lasombra.disciplines[0].dots=1;
    check(traitIssues(lasombra,oppression).length>0,'OR prerequisite still requires Dominate 2');
    const c=make();
    c.disciplines=[{name:'Potence',dots:1,powers:[]},{name:'Potence',dots:1,powers:[]}];
    check(disciplineDots(c,'Potence')===1,'Duplicate rows do not satisfy a two-dot prerequisite');
    c.disciplines=[{name:'Potence',dots:2,powers:[]}];
    const prowess=clans[0].traits.find(t=>t.name==='Prowess');
    c.clanTraits=['Prowess'];
    check(traitIssues(c,prowess,'advancementClanTraits').some(text=>text.includes('já escolhido')),'Acquired Traits cannot duplicate initial Traits');
    check(!traitIssues(c,prowess,'clanTraits',0).length,'A selected Trait does not count as its own duplicate');
    const power=getAvailablePowers('Potence',1)[0];
    c.disciplines[0].powers=[{name:power.name,cost:'',reminder:''}];
    check(powerIssues(c,c.disciplines[0],power).some(text=>text.includes('já escolhido')),'A learned power is omitted from another power slot');
    check(!powerIssues(c,c.disciplines[0],power,0).length,'Selected power remains eligible in its own slot');
    c.skills.athletics.dots=3;
    check(!canSetRating(c,'skills','athletics',4),'Creation cannot increase a Skill past three');
    c.mode='play';
    check(canSetRating(c,'skills','athletics',4) && !canSetRating(c,'skills','athletics',6),'Play permits Skill advancement through five');
    check(!validateCharacter(c).some(w=>/Pontos de Habilidade:|Méritos:|Poderes de Disciplina:|distribuição de Atributos/.test(w)),'Play does not apply creation budgets to an advanced character');
    for (const [tier,clanMax,otherMax] of [['neonate',5,3],['ancilla',7,5],['elder',8,7]]) {
        c.identity.playLevel=tier;
        check(ratingLimit(c,'disciplines',{name:'Potence'})===clanMax && ratingLimit(c,'disciplines',{name:'Animalism'})===otherMax,tier+' uses separate clan and non-clan advancement caps');
    }
    c.mode='creation';c.identity.playLevel='neonate';c.identity.sire='Adoptive Sire';c.identity.sireClan='Gangrel';c.identity.sireDiscipline='Animalism';
    check(ratingLimit(c,'disciplines',{name:'Animalism'})===1 && !disciplineChoices(c).includes('Oblivion'),'Creation admits a Sire Discipline at one dot and omits unrelated Disciplines');
    c.disciplines[0].dots=4;
    check(!canSetRating(c,'disciplines',0,5) && canSetRating(c,'disciplines',0,3),'Creation budget blocks added Discipline dots but permits corrections');
    c.attributes={strength:4,dexterity:4,stamina:2,charisma:4,manipulation:2,composure:2,intelligence:2,wits:2,resolve:2};
    check(!canSetRating(c,'attributes','stamina',3),'Filled Attribute pools cannot gain an extra creation point');
    const old = {version:3,identity:{name:'Old'},beast:'Keep',flaw:'Keep flaw',skills:{athletics:{dots:5,focus:'Run'}}};
    const migrated=normalizeCharacter(old);
    check(migrated.version===CURRENT_SCHEMA_VERSION && migrated.mode==='creation' && migrated.skills.athletics.dots===5 && migrated.flaw==='Keep flaw','v3 migrates to modes and notes without reducing ratings or dropping personal fields');
    check(JSON.stringify(normalizeCharacter(migrated))===JSON.stringify(migrated),'New schema normalization is idempotent');
    let rejected=0;
    for(const extra of [{notes:{backstory:3}},{mode:'invalid'},{clanIcons:{brujah:'https://example.com/image.png'}},{advancementClanTraits:[5]}]) {
        try { assertCharacter({identity:{},...extra}); } catch { rejected++; }
    }
    check(rejected===4,'Imports reject malformed notes, modes, icons and acquired Traits');
    return passed;
}

export async function runTests() {
    const passed=runModelTests();
    const check=(ok,message)=>{if(!ok)throw new Error(message);passed.push(message);};
    const storageKey='vtm-v6-character-sheet', original=localStorage.getItem(storageKey);
    const frame=document.createElement('iframe');frame.title='Prerequisite and notes fixture';frame.style.cssText='width:100%;height:950px';
    const loaded=()=>new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error('Eligibility fixture timeout')),8000);frame.addEventListener('load',()=>{clearTimeout(timer);resolve();},{once:true});});
    const doc=()=>frame.contentDocument, byId=id=>doc().getElementById(id), saved=()=>JSON.parse(localStorage.getItem(storageKey));
    const change=(id,value)=>{const e=byId(id);e.value=value;e.dispatchEvent(new frame.contentWindow.Event('change',{bubbles:true}));};
    const has=(id,value)=>[...byId(id).options].some(o=>o.value===value && !o.disabled);
    const card=name=>[...byId('disciplines').children].find(c=>c.querySelector('.discipline-head select').value===name);
    const rate=(name,dots)=>card(name).querySelectorAll('.discipline-head .dots button')[dots-1].click();
    const waitFor=async(test)=>{for(let i=0;i<100;i++){if(test())return;await new Promise(r=>setTimeout(r,20));}throw new Error('Async icon did not settle');};
    try {
        const initial=normalizeCharacter({version:3,identity:{name:'UI audit',clan:'Brujah',playLevel:'neonate',generationModifier:1},
            disciplines:[{name:'Potence',dots:2,powers:[]},{name:'Presence',dots:1,powers:[]},{name:'Celerity',dots:0,powers:[]}],
            clanTraits:['Prowess','Wrestler'],beast:'Personal Beast',flaw:'Personal flaw',items:'Personal inventory',lifepaths:['Criminal','Military']});
        localStorage.setItem(storageKey,JSON.stringify(initial));
        let waiting=loaded();frame.src=new URL('../index.html',import.meta.url).href;document.body.append(frame);await waiting;
        check(byId('sheet-mode').value==='creation' && byId('skills').querySelector('.dots').children.length===3,'Fresh creation shows only three Skill dots');
        check(has('merit','Fleetness') && has('clan-trait-1','Combat Reflexes') && !has('lifepath-0','Diplomat'),'Merits and Traits remain available as reference/manual choices while Lifepath tier rules stay enforced');
        check(has('merit','__manual__') && has('clan-trait-1','__manual__'),'Merits and Traits offer explicit manual entries');
        check(byId('sire-discipline-field').hidden,'Sire Discipline selection is unavailable until a Sire is defined');
        change('sire','adoptive');
        check(!byId('sire-clan-field').hidden && !has('sire-discipline','Animalism'),'Adoptive Sire requires its related Clan before granting Discipline choices');
        change('sire-clan','Gangrel');
        check(has('sire-discipline','Animalism') && !has('sire-discipline','Dominate'),'Related Clan restricts the Sire Discipline choices');
        change('sire-discipline','Animalism');
        check(card('Animalism') && card('Animalism').querySelectorAll('.discipline-head .dots button').length===1,'Non-clan Sire Discipline receives only one creation dot control');
        check(['beast','flaw','items','frenzy-trigger','outburst-trigger'].every(id=>!byId(id).closest('details').open),'All inline personal notes and Flaw start collapsed');
        check(byId('flaw').closest('details').querySelector('summary').textContent.includes('preenchido'),'Collapsed filled notes advertise that text is present');
        byId('flaw').closest('details').querySelector('summary').click();
        check(byId('flaw').value==='Personal flaw','Expanding Flaw retains existing text');
        byId('notes-button').focus();byId('notes-button').click();
        check(byId('notes-dialog').open && byId('notes-backstory'),'Notes button opens the character notes dialog');
        const story='Before the Embrace\nA promise <never forgotten>.';
        byId('notes-backstory').value=story;byId('notes-backstory').dispatchEvent(new frame.contentWindow.Event('input',{bubbles:true}));
        check(saved().notes.backstory===story && byId('notes-print').textContent.includes(story),'Story autosaves and a printable copy preserves literal text');
        byId('notes-backstory').focus();
        check(byId('sheet-tooltip').parentElement===byId('notes-dialog') && !byId('sheet-tooltip').hidden,'Contextual help is visible inside the modal layer');
        byId('notes-close').click();
        check(!byId('notes-dialog').open && doc().activeElement===byId('notes-button'),'Closing notes restores focus to its opener');
        change('sheet-mode','play');
        check(byId('skills').querySelector('.dots').children.length===5 && !byId('add-clan-trait').hidden,'Play enables Skill advancement and acquired Traits');
        byId('add-clan-trait').click();change('acquired-trait-1','Spark of Rage');
        check(saved().advancementClanTraits[0]==='Spark of Rage' && byId('acquired-trait-1-description').textContent.includes('referência'),'Acquired Trait records separately and labels catalog rules as reference');
        rate('Celerity',1);
        check(has('merit','Fleetness'),'Catalog Merit remains selectable regardless of automatic prerequisite enforcement');
        change('merit','Fleetness');rate('Celerity',1);
        check(saved().merits[0]==='Fleetness' && !byId('merit').selectedOptions[0].disabled,'Losing a catalog prerequisite preserves the Merit without blocking table rulings');
        rate('Celerity',3);change('play-level','ancilla');
        check(has('clan-trait-3','Combat Reflexes') && has('lifepath-0','Diplomat'),'Catalog Trait remains selectable and Lifepath tier eligibility refreshes');
        change('clan-trait-3','Combat Reflexes');change('play-level','neonate');
        check(saved().clanTraits[2]==='Combat Reflexes','Lowering tier preserves a manually accepted Trait choice');
        change('sheet-mode','creation');
        check(saved().advancementClanTraits[0]==='Spark of Rage' && byId('add-clan-trait').hidden,'Returning to creation preserves advancement and hides acquisition actions');
        change('sheet-mode','play');
        // Actual image upload, removal and per-Clan persistence.
        const canvas=doc().createElement('canvas');canvas.width=8;canvas.height=8;canvas.getContext('2d').fillRect(0,0,8,8);
        const blob=await new Promise(r=>canvas.toBlob(r,'image/png'));
        async function upload(file) {
            const transfer=new frame.contentWindow.DataTransfer();transfer.items.add(file);byId('clan-icon-file').files=transfer.files;
            byId('clan-icon-file').dispatchEvent(new frame.contentWindow.Event('change',{bubbles:true}));
        }
        await upload(new frame.contentWindow.File([blob],'clan.png',{type:'image/png'}));
        await waitFor(()=>saved().clanIcons?.brujah);
        check(!byId('clan-icon').hidden && byId('clan-icon').alt.includes('Brujah'),'Uploaded Clan icon is shown with an accessible label');
        const brujahIcon=saved().clanIcons.brujah;
        change('clan','gangrel');
        check(byId('clan-icon').hidden && saved().clanIcons.brujah===brujahIcon,'Changing Clan keeps its previous icon without showing it for the new Clan');
        await upload(new frame.contentWindow.File([blob],'gangrel.png',{type:'image/png'}));
        await waitFor(()=>saved().clanIcons?.gangrel);
        byId('clan-icon-remove').click();
        check(!saved().clanIcons.gangrel && saved().clanIcons.brujah===brujahIcon,'Removing the current Clan icon preserves other Clan icons');
        change('clan','brujah');
        check(!byId('clan-icon').hidden && saved().clanTraits[0]==='Prowess','Returning to a Clan restores its icon and saved Traits');
        await upload(new frame.contentWindow.File(['invalid'],'bad.txt',{type:'text/plain'}));
        await waitFor(()=>byId('clan-icon-status').textContent.includes('PNG'));
        check(saved().clanIcons.brujah===brujahIcon,'Rejected image leaves the previous icon intact');
        const before=saved();
        waiting=loaded();frame.contentWindow.location.reload();await waiting;
        check(saved().notes.backstory===story && byId('clan-icon').getAttribute('src')===brujahIcon && saved().advancementClanTraits[0]==='Spark of Rage','Reload retains notes, icon and acquired Traits');
        let exported;
        frame.contentWindow.URL.createObjectURL=blob=>{exported=blob;return 'blob:audit';};frame.contentWindow.URL.revokeObjectURL=()=>{};frame.contentWindow.HTMLAnchorElement.prototype.click=()=>{};
        byId('export-button').click();const json=await exported.text();
        const transfer=new frame.contentWindow.DataTransfer();transfer.items.add(new frame.contentWindow.File([json],'audit.json',{type:'application/json'}));byId('import-file').files=transfer.files;
        waiting=loaded();byId('import-file').dispatchEvent(new frame.contentWindow.Event('change',{bubbles:true}));await waiting;
        check(JSON.stringify(saved())===JSON.stringify(before),'Real JSON export/import retains every new and existing field');
        frame.style.width='390px';byId('notes-button').click();
        check(doc().documentElement.scrollWidth<=doc().documentElement.clientWidth && byId('notes-dialog').getBoundingClientRect().width<390,'New controls and notes dialog fit a mobile viewport');
        byId('notes-close').click();
        const flaw=byId('flaw').closest('details'), wasOpen=flaw.open;
        frame.contentWindow.dispatchEvent(new frame.contentWindow.Event('beforeprint'));
        check(flaw.open,'Printing expands filled inline notes');
        frame.contentWindow.dispatchEvent(new frame.contentWindow.Event('afterprint'));
        check(flaw.open===wasOpen,'Printing restores the previous note disclosure state');
        assertCharacter(saved());
        return passed;
    } finally {
        frame.remove();if(original===null)localStorage.removeItem(storageKey);else localStorage.setItem(storageKey,original);
    }
}
