import { normalizeCharacter } from '../js/model/character.js';
import { CURRENT_SCHEMA_VERSION } from '../data/schema.js';

export async function runTests() {
    const key = 'vtm-v6-character-sheet';
    const original = localStorage.getItem(key);
    const passed = [];
    const check = (ok, message) => { if (!ok) throw new Error(message); passed.push(message); };
    const frame = document.createElement('iframe');
    frame.title = 'Advancement fixture';
    frame.style.cssText = 'width:100%;height:900px';
    const loaded = () => new Promise((resolve,reject) => {
        const timer=setTimeout(()=>reject(new Error('Advancement fixture timeout')),8000);
        frame.addEventListener('load',()=>{clearTimeout(timer);resolve();},{once:true});
    });
    const doc=()=>frame.contentDocument, byId=id=>doc().getElementById(id), saved=()=>JSON.parse(localStorage.getItem(key));
    try {
        const legacy=normalizeCharacter({version:4,mode:'play',identity:{name:'XP Test'}});
        localStorage.setItem(key,JSON.stringify(legacy));
        let wait=loaded(); frame.src=new URL('../index.html',import.meta.url).href; document.body.append(frame); await wait;

        check(saved().version===CURRENT_SCHEMA_VERSION && saved().experience.available===0 && saved().experience.history.length===0,
            'Schema migration supplies an empty XP ledger');
        check(byId('session-xp').textContent==='0 XP','Play dashboard shows current XP');

        byId('xp-change').value='4'; byId('xp-note').value='Sessão 1'; byId('xp-gain').click();
        check(saved().experience.available===4 && saved().experience.history[0].delta===4 && byId('session-xp').textContent==='4 XP',
            'Gaining XP updates balance, history and session dashboard');

        byId('xp-change').value='2'; byId('xp-note').value='Habilidade'; byId('xp-spend').click();
        check(saved().experience.available===2 && saved().experience.history[1].delta===-2,
            'Spending XP records a negative ledger entry');

        byId('xp-change').value='9'; byId('xp-spend').click();
        check(saved().experience.available===2 && saved().experience.history.length===2,
            'Recorded spending cannot make the XP balance negative');

        byId('xp-available').value='7'; byId('xp-available').dispatchEvent(new frame.contentWindow.Event('change',{bubbles:true}));
        check(saved().experience.available===7 && saved().experience.history.length===2,
            'Manual balance adjustment preserves history');

        check(frame.getComputedStyle(byId('calculator-result')).backgroundColor !== 'rgb(13, 13, 16)',
            'Classic theme removes the legacy black calculator result background');

        return passed;
    } finally {
        frame.remove();
        if(original===null)localStorage.removeItem(key); else localStorage.setItem(key,original);
    }
}
