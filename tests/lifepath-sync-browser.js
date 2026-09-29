import { normalizeCharacter } from '../js/model/character.js';
import { changeLifepathSkills, lifepathSkillContributions, skillForLifepathChoice, canAddLifepathSkill, setSkillTotal } from '../js/model/lifepath-skills.js';
import { assertCharacter } from '../js/storage.js';
import { lifepaths } from '../data/lifepaths.js';

export async function runTests() {
    const passed = [];
    const check = (ok, message) => {if(!ok)throw new Error(message);passed.push(message);};
    const make = (dots=0) => normalizeCharacter({version:3,identity:{playLevel:'neonate'},
        skills:{athletics:{dots,focus:'Personal focus'}},lifepaths:['Criminal','Military'],
        lifepathAllocations:[{skills:['Atletismo (Corrida)',''],resources:[]},{skills:['Atletismo'],resources:[]}]});
    const empty = make();
    check(empty.skills.athletics.dots===2,'Old allocations fill missing final Skill dots');
    const old = make(3);
    check(old.skills.athletics.dots===3 && lifepathSkillContributions(old).athletics===2,'Old total already including paths is not double counted');
    check(normalizeCharacter(old).skills.athletics.dots===3,'Repeated normalization never adds the same allocation twice');
    check(skillForLifepathChoice('Atletismo (Corrida)')==='athletics' && skillForLifepathChoice('Briga (Luta suja)')==='fighting' && skillForLifepathChoice('Custom unknown')===null,'Catalog choices resolve to skill IDs without interpreting focus text');
    check(lifepaths.every(path=>path.skills.every(skillForLifepathChoice)),'Every catalog option maps to a known final Skill');
    changeLifepathSkills(old,()=>{old.lifepathAllocations[0].skills[0]='';});
    check(old.skills.athletics.dots===2 && old.skills.athletics.focuses[0]==='Personal focus','Removing a path point preserves additional points and personal focus');
    changeLifepathSkills(old,()=>{old.lifepathAllocations[1].skills[0]='';});
    check(old.skills.athletics.dots===1,'Removing all path points leaves the manual investment');
    const floor=make(3);setSkillTotal(floor,'athletics',0);
    check(floor.skills.athletics.dots===2,'Manual total cannot erase points still assigned by paths');
    check(canAddLifepathSkill(floor,'Atletismo'),'Available creation point can still be assigned');
    setSkillTotal(floor,'athletics',3);
    check(!canAddLifepathSkill(floor,'Atletismo'),'Allocation cannot push a Skill past creation maximum');
    assertCharacter(old);
    check(old.version===3,'Synchronization keeps the existing schema and export shape');
    const excess=normalizeCharacter({version:3,identity:{playLevel:'neonate'},skills:{athletics:{dots:8}},
        lifepaths:['Military','Military','Military'],lifepathAllocations:Array.from({length:3},()=>({skills:['Atletismo','Atletismo'],resources:[]}))});
    check(excess.skills.athletics.dots===8 && lifepathSkillContributions(excess).athletics===6,'Imported high dots and contributions from excess paths are preserved');
    changeLifepathSkills(excess,()=>{excess.lifepathAllocations[2].skills[0]='';});
    check(excess.skills.athletics.dots===7,'Correcting an excess allocation still preserves additional dots');

    const key='vtm-v6-character-sheet', original=localStorage.getItem(key);
    const frame=document.createElement('iframe');frame.title='Lifepath synchronization fixture';frame.style.cssText='width:100%;height:900px';
    const loaded=()=>new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error('Sync fixture load timeout')),8000);frame.addEventListener('load',()=>{clearTimeout(timer);resolve();},{once:true});});
    const doc=()=>frame.contentDocument, byId=id=>doc().getElementById(id), saved=()=>JSON.parse(localStorage.getItem(key));
    const change=(id,value)=>{const e=byId(id);e.value=value;e.dispatchEvent(new frame.contentWindow.Event('change',{bubbles:true}));};
    const skillRow=()=>byId('skills').querySelector('.skill-row');
    const panel=slot=>byId('lifepath-allocation-'+slot).querySelector('[data-kind=skills]');
    const row=(slot,choice)=>[...panel(slot).querySelectorAll('.allocation-row')].find(row=>row.dataset.choice===choice);
    const step=(slot,choice,action)=>row(slot,choice).querySelector('[data-action='+action+']').click();
    const editTotal=n=>skillRow().querySelectorAll('.dots button')[n-1].click();
    try {
        localStorage.setItem(key,JSON.stringify({version:3,identity:{name:'Sync',playLevel:'neonate'},skills:{athletics:{dots:1,focus:'My athletics focus'}},lifepaths:['Criminal','Military']}));
        let wait=loaded();frame.src=new URL('../index.html',import.meta.url).href;document.body.append(frame);await wait;
        check(panel(0).open,'Incomplete path allocation starts expanded');
        change('calculator-attribute','strength');change('calculator-skill','athletics');
        step(0,'Atletismo (Corrida)','plus');
        check(saved().skills.athletics.dots===2 && skillRow().querySelector('.skill-origin').textContent.includes('1 dos Caminhos + 1 adicionais'),'Allocation updates final Skills and their point origins immediately');
        check(byId('calculator-result').textContent==='3 dados','Skill synchronization also refreshes the dice calculator');
        step(1,'Atletismo','plus');
        check(saved().skills.athletics.dots===3 && row(0,'Atletismo (Corrida)').querySelector('[data-action=plus]').disabled,'Different paths share the same Skill and its creation limit');
        check(skillRow().querySelectorAll('.dots button')[0].disabled,'Protected path points are visibly unavailable to remove in final Skills');
        editTotal(3);
        check(saved().skills.athletics.dots===2 && !row(0,'Atletismo (Corrida)').querySelector('[data-action=plus]').disabled,'Editing additional dots refreshes available path allocations');
        // Fill the remaining four points with legal choices.
        step(0,'Percepção','plus');step(0,'Briga (Luta suja)','plus');step(0,'Sabotagem (Arrombamento)','plus');step(0,'Subterfúgio','plus');
        check(!panel(0).open && panel(0).querySelector('summary').textContent.includes('5/5'),'Completing distribution collapses it with a visible total');
        check(doc().activeElement===panel(0).querySelector('summary'),'Auto-collapse returns keyboard focus to the summary');
        check(byId('sheet-tooltip').hidden,'Auto-collapse hides the tooltip of the now-hidden allocation button');
        panel(0).querySelector('summary').click();
        check(panel(0).open,'Completed distribution can be reopened for editing');
        step(0,'Percepção','minus');
        check(panel(0).open && saved().skills.awareness.dots===0,'Removing allocation updates the Skill while keeping editing available');
        step(0,'Percepção','plus');
        check(!panel(0).open,'Finishing again collapses the distribution');
        const dots=saved().skills.athletics.dots;
        wait=loaded();frame.contentWindow.location.reload();await wait;
        check(!panel(0).open && saved().skills.athletics.dots===dots,'Reload keeps completed distribution collapsed without duplicating dots');
        check(saved().skills.athletics.focuses[0]==='My athletics focus','Existing focus survives allocation, removal and reload');
        // Additional investment stays put when the source path is changed.
        editTotal(3);
        change('lifepath-0','Artist');
        check(saved().skills.athletics.dots===2 && saved().skills.athletics.focuses[0]==='My athletics focus','Changing a path removes only its contribution, preserving other path and extra dots');
        change('play-level','elder');change('play-level','neonate');
        const proto=frame.contentWindow.Storage.prototype, set=proto.setItem;let saves=0;
        proto.setItem=function(...args){saves++;return set.apply(this,args);};
        const before=saved().skills.craft.dots;
        step(0,'Ofício','plus');proto.setItem=set;
        check(saves===1 && saved().skills.craft.dots===before+1,'Tier/path rerenders keep exactly one allocation update and save');
        let exported;
        frame.contentWindow.URL.createObjectURL=blob=>{exported=blob;return 'blob:sync';};frame.contentWindow.URL.revokeObjectURL=()=>{};frame.contentWindow.HTMLAnchorElement.prototype.click=()=>{};
        byId('export-button').click();const json=await exported.text();
        const transfer=new frame.contentWindow.DataTransfer();transfer.items.add(new frame.contentWindow.File([json],'sync.json',{type:'application/json'}));byId('import-file').files=transfer.files;
        wait=loaded();byId('import-file').dispatchEvent(new frame.contentWindow.Event('change',{bubbles:true}));await wait;
        check(saved().skills.athletics.dots===2 && saved().skills.craft.dots===before+1,'Export/import round trip never reapplies already included contributions');
        frame.style.width='390px';
        check(doc().documentElement.scrollWidth<=doc().documentElement.clientWidth,'Collapsible summaries and skill origins fit mobile width');
        change('lifepath-0','__custom__');
        change('play-level','elder');change('play-level','neonate');
        const notes=doc().querySelector('[aria-label="Caminho de Vida personalizado 1"]');
        check(byId('lifepath-0').value==='__custom__' && !notes.hidden,'Blank custom path remains editable through tier rerenders');
        notes.value='My custom history';notes.dispatchEvent(new frame.contentWindow.Event('input',{bubbles:true}));
        wait=loaded();frame.contentWindow.location.reload();await wait;
        check(byId('lifepath-0').value==='__custom__' && doc().querySelector('[aria-label="Caminho de Vida personalizado 1"]').value==='My custom history','Custom path text survives save and reload');
        change('play-level','elder');change('lifepath-3','Military');
        step(3,'Atletismo','plus');change('play-level','neonate');
        check(saved().skills.athletics.dots===3 && byId('lifepath-3'),'Downgrading tier preserves excess path contributions');
        change('lifepath-3','__custom__');
        check(byId('lifepath-3').value==='__custom__' && !doc().querySelector('[aria-label="Caminho de Vida personalizado 4"]').hidden && saved().skills.athletics.dots===2,'Excess path can become an editable custom entry while removing its old contribution');
        change('lifepath-3','');
        check(!byId('lifepath-3') && saved().lifepaths[3]==='' && doc().activeElement===byId('lifepath-1'),'Clearing the final excess path saves and returns focus to a remaining path');

        // Imported contributions must remain removable even without a known path.
        localStorage.setItem(key,JSON.stringify({version:3,identity:{playLevel:'neonate'},lifepaths:[''],skills:{athletics:{dots:2}},
            lifepathAllocations:[{skills:['Atletismo','Unknown old choice'],resources:[]}]}));
        wait=loaded();frame.contentWindow.location.reload();await wait;
        check(!byId('lifepath-allocation-0').hidden && panel(0).open && byId('lifepath-help-0').textContent.includes('sem Caminho do catálogo'),'Imported allocation without a path remains visible for correction');
        check(row(0,'Unknown old choice').querySelector('[data-action=plus]').disabled,'Unknown imported choices cannot create inferred Skill dots');
        step(0,'Atletismo','minus');
        check(saved().skills.athletics.dots===1 && saved().lifepathAllocations[0].skills.includes('Unknown old choice'),'Removing an orphan contribution preserves extra dots and unknown saved data');
        check(doc().documentElement.scrollWidth<=doc().documentElement.clientWidth,'Unknown imported choices also fit mobile width');
        return passed;
    } finally {
        frame.remove();if(original===null)localStorage.removeItem(key);else localStorage.setItem(key,original);
    }
}
