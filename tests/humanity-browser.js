import { shiftHumanity, resistancePool } from '../js/model/humanity.js';
import { skillFocusCount, normalizeSkillFocuses } from '../js/model/skills.js';
import { assertCharacter } from '../js/storage.js';
import { getPower } from '../data/disciplines.js';
import { natures, getNature } from '../data/natures.js';
import { clans } from '../data/clans.js';
import { lifepaths, getLifepath } from '../data/lifepaths.js';

// Run only in an isolated browser profile: interaction tests replace its local sheet.
export function runTests() {
    const passed = [];
    const check = (condition, name) => {
        if (!condition) throw new Error(name);
        passed.push(name);
    };
    const make = () => ({
        humanityPosition: 0, lostBeastCircles: 0, lostNatureCircles: 0, humanityFate: '',
        identity: { generationModifier: 1 }, attributes: { composure: 3, resolve: 3 }, currentVitae: 13
    });
    for (const direction of [-1, 1]) {
        const c = make();
        const opposite = direction < 0 ? 'lostNatureCircles' : 'lostBeastCircles';
        for (let i = 0; i < 3; i++) shiftHumanity(c, direction);
        check(c.humanityPosition === 3 * direction && c[opposite] === 0, 'Reach extreme ' + direction);
        shiftHumanity(c, direction);
        check(c[opposite] === 1 && c.humanityPosition === 3 * direction, 'Lose opposite circle ' + direction);
        c.humanityPosition = -2 * direction;
        shiftHumanity(c, -direction);
        check(c[opposite] === 0 && c.humanityPosition === -2 * direction, 'Recover without moving ' + direction);
        c.humanityPosition = 3 * direction;
        for (let i = 0; i < 3; i++) shiftHumanity(c, direction);
        check(!c.humanityFate, 'Three losses do not end journey yet ' + direction);
        shiftHumanity(c, direction);
        check(c.humanityFate === (direction < 0 ? 'wight' : 'departure'), 'Fourth overflow ends journey ' + direction);
    }
    const c = make();
    check(resistancePool(c, 'beast').dice === 3, 'Satisfied resistance includes +1');
    c.humanityPosition = 3;
    check(!resistancePool(c, 'nature').canResist, 'Mortal 3 cannot resist outburst');
    check(resistancePool(c, 'beast').bonus === 3, 'Mortal 3 frenzy bonus plus satisfied');
    c.humanityPosition = -3;
    check(resistancePool(c, 'nature').bonus === 3, 'Monstrous 3 outburst bonus plus satisfied');
    check(resistancePool(c, 'beast').canResist, 'Monstrous 3 may resist Beast frenzy');

    const byId = (id) => document.getElementById(id);
    const clickDot = (id, index) => byId(id).querySelectorAll('button')[index].click();
    const saved = () => JSON.parse(localStorage.getItem('vtm-v6-character-sheet'));
    const stage = () => byId('humanity-stage').textContent;
    const setInput = (id, value) => {
        byId(id).value = value;
        byId(id).dispatchEvent(new Event('input', { bubbles: true }));
    };
    check(byId('rules-reference').children.length === 9, 'Reference renders nine sections');
    check(byId('merit').options.length >= 17, 'Merits still render');
    check(natures.length === 8 && byId('nature').options.length === 9, 'All eight Natures available');
    check(byId('nature').value === 'Survivor' && getNature('Survivor — old description').name === 'Survivor', 'Legacy Nature recognized');
    const oldPosition = stage();
    for (const nature of natures) {
        byId('nature').value = nature.name;
        byId('nature').dispatchEvent(new Event('change', { bubbles: true }));
        check(byId('nature-outburst-effect').textContent === nature.effect && saved().nature === nature.name,
            nature.name + ' selection updates outburst and saves');
    }
    check(stage() === oldPosition, 'Selecting Nature never moves Humanity');
    check(byId('beast-clan-name').textContent.includes('Enticer'), 'Beast comes from selected clan');
    byId('play-level').value = 'ancilla';
    byId('play-level').dispatchEvent(new Event('change', { bubbles: true }));
    check(byId('humanity-start-help').textContent.includes('Monstruoso 1'), 'Ancilla starting guidance updates');
    byId('play-level').value = 'elder';
    byId('play-level').dispatchEvent(new Event('change', { bubbles: true }));
    check(byId('humanity-start-help').textContent.includes('Monstruoso 2') && stage() === oldPosition, 'Elder guidance does not move existing character');
    byId('play-level').value = 'neonate';
    byId('play-level').dispatchEvent(new Event('change', { bubbles: true }));
    const powerRow = () => byId('disciplines').querySelector('.power-row');
    const powerSelect = powerRow().querySelector('select');
    check(powerRow().querySelector('.power-description').textContent.includes('Efeito:'), 'Power effect remains available outside editable notes');
    powerSelect.value = [...powerSelect.options].filter((option) => option.value).at(-1).value;
    powerSelect.dispatchEvent(new Event('change', { bubbles: true }));
    const chosen = saved().disciplines[0];
    const source = getPower(chosen.name, chosen.powers[0].name);
    check(powerRow().querySelector('.power-description').textContent.includes(source.summary), 'Power selection updates effect description');
    check(powerRow().querySelector('select').getAttribute('aria-describedby') === powerRow().querySelector('.power-description').id, 'Power description linked accessibly');
    clickDot('humanity-scale', 3);
    check(byId('nature-success').hidden && byId('nature-resistance').textContent.includes('Faltam'), 'Tracking phase explains unavailable actions');
    clickDot('nature-points', 4);
    check(!byId('nature-success').hidden && byId('nature-finish').hidden, 'Full tracker shows only resolution actions');
    check(stage() === 'Neutro', 'Nature marks do not shift humanity');
    byId('nature-success').click();
    check(saved().naturePoints === 4 && stage() === 'Neutro', 'Success removes one mark only');
    clickDot('nature-points', 4);
    byId('nature-failure').click();
    check(byId('nature-success').hidden && !byId('nature-finish').hidden, 'Episode phase shows completion action');
    check(saved().naturePoints === 0 && saved().natureEpisode === 'failure' && stage() === 'Neutro', 'Failure starts persisted episode without shift');
    byId('nature-finish').click();
    check(stage() === 'Mortal 1' && !saved().natureEpisode, 'Finishing outburst shifts once');
    byId('nature-finish').click();
    check(stage() === 'Mortal 1', 'Finishing twice is prevented');
    clickDot('willpower-tracker', 1);
    clickDot('beast-points', 4);
    byId('beast-accepted').click();
    const before = saved().currentWillpower;
    byId('beast-finish').click();
    check(saved().currentWillpower === before + 2 && stage() === 'Neutro', 'Accepted episode restores Willpower only on completion');
    clickDot('humanity-scale', 5);
    clickDot('nature-points', 4);
    byId('nature-painful').click();
    check(byId('nature-resistance').textContent.includes('Drama'), 'Painful failure displays consequence');
    byId('nature-finish').click();
    clickDot('nature-points', 4);
    check(byId('nature-success').disabled && byId('nature-success').hidden, 'Mortal 3 blocks resistance success');
    check(byId('nature-painful').hidden && !byId('nature-failure').hidden, 'Mortal 3 offers inevitable episode without a test');
    byId('nature-failure').click();
    byId('nature-finish').click();
    check(saved().lostBeastCircles === 1 && byId('humanity-scale').querySelector('button').disabled, 'Overflow crosses and disables lost circle');
    setInput('quickening', 99);
    check(saved().quickening === 5, 'Quickening clamps to five');
    clickDot('vitae-tracker', 0);
    clickDot('vitae-tracker', 0);
    check(saved().quickening === 0 && byId('quickening-plus').disabled, 'Torpor clears and blocks Quickening');
    setInput('nefarious-damage', 99);
    check(byId('hunger-state').textContent === 'MORTE FINAL', 'All blocked Vitae indicates Final Death');
    check([...byId('vitae-tracker').querySelectorAll('button')].every((b) => b.disabled), 'Baneful damage disables blocked boxes');
    const firstAttribute = byId('attributes').querySelector('button');
    firstAttribute.click();
    byId('attributes').querySelector('button').click();
    check(saved().attributes.strength === 1, 'Attribute cannot fall below one');
    check([0, 1, 2, 3, 4, 5].map(skillFocusCount).join() === '0,1,1,2,2,3', 'Focus thresholds are 1, 3 and 5');
    check(normalizeSkillFocuses({ focus: 'light firearms, heavy firearms' }).join('|') === 'light firearms|heavy firearms', 'Legacy focuses migrate separately');
    const skillRow = () => byId('skills').querySelector('.skill-row');
    const rateSkill = (rating) => skillRow().querySelectorAll('.dots button')[rating - 1].click();
    rateSkill(5);
    check(skillRow().querySelectorAll('input').length === 3, 'Five dots display three focus fields');
    const thirdFocus = skillRow().querySelectorAll('input')[2];
    thirdFocus.value = 'Acrobacia';
    thirdFocus.dispatchEvent(new Event('input', { bubbles: true }));
    rateSkill(1);
    check(skillRow().querySelectorAll('input').length === 1 && saved().skills.athletics.focuses[2] === 'Acrobacia', 'Lowering rating preserves locked focus');
    rateSkill(1);
    check(skillRow().querySelectorAll('input').length === 0, 'Zero dots display no focus fields');
    rateSkill(3);
    check(skillRow().querySelectorAll('input').length === 2, 'Three dots display two focus fields');
    rateSkill(5);
    check(skillRow().querySelectorAll('input')[2].value === 'Acrobacia', 'Restoring rating restores third focus');
    assertCharacter(saved());
    check(true, 'Saved focus arrays accepted by import validation');
    const invalid = saved();
    invalid.skills.athletics.focuses = [42];
    let rejected = false;
    try { assertCharacter(invalid); } catch { rejected = true; }
    check(rejected, 'Invalid focus arrays rejected');
    check(!document.querySelector('.humanity-adjustment') && !byId('beast-shift'), 'Separate humanity adjustment removed');
    const tip = byId('sheet-tooltip');
    byId('merit').focus();
    check(!tip.hidden && tip.textContent.includes('Mérito'), 'Keyboard focus shows contextual tooltip');
    check(byId('merit').getAttribute('aria-describedby').includes('merit-description'), 'Tooltip preserves existing accessible description');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    check(tip.hidden && byId('merit').getAttribute('aria-describedby') === 'merit-description', 'Escape dismisses tooltip and restores description');
    document.querySelector('[aria-label="Ajuda: Humanidade"]').click();
    check(!tip.hidden && tip.textContent.includes('círculo'), 'Help trigger works on click/touch');
    const focusField = skillRow().querySelector('input');
    focusField.focus();
    check(!tip.hidden && tip.textContent.includes('Foco 3'), 'Rerendered focus fields have tooltips');
    document.body.click();
    check(tip.hidden, 'Outside click dismisses tooltip');
    const beastNotes = byId('beast').value;
    for (const clan of clans) {
        byId('clan').value = clan.id;
        byId('clan').dispatchEvent(new Event('change', { bubbles: true }));
        check(byId('beast-clan-name').textContent.includes(clan.beast.name) &&
            byId('beast-clan-indulging').textContent === clan.beast.indulging &&
            byId('beast-clan-frenzy').textContent.includes(clan.frenzy.description),
            clan.name + ' updates Beast, indulgence and frenzy');
    }
    check(byId('beast').value === beastNotes, 'Changing clan preserves personal Beast notes');
    check(lifepaths.length === 14 && byId('lifepath-0').options.length === 16, 'Fourteen lifepaths plus empty and custom options');
    check(byId('lifepath-0').value === 'Criminal' && byId('lifepath-1').value === 'Military', 'Legacy lifepaths recognized');
    const skillSnapshot = JSON.stringify(saved().skills);
    for (const path of lifepaths) {
        byId('lifepath-0').value = path.name;
        byId('lifepath-0').dispatchEvent(new Event('change', { bubbles: true }));
        const allocation = byId('lifepath-allocation-0');
        const skillOptions = [...allocation.querySelectorAll('[data-kind=skills] .allocation-row')].map((row) => row.dataset.choice);
        const resourceOptions = [...allocation.querySelectorAll('[data-kind=resources] .allocation-row')].map((row) => row.dataset.choice);
        check(skillOptions.includes(path.skills[0]) &&
            resourceOptions.includes(path.resources[0]) && saved().lifepaths[0] === path.name,
            path.name + ' lifepath renders compact distribution counters and saves');
    }
    check(JSON.stringify(saved().skills) === skillSnapshot, 'Selecting lifepath does not spend skill dots');
    byId('lifepath-0').value = 'Criminal';
    byId('lifepath-0').dispatchEvent(new Event('change', { bubbles: true }));
    byId('lifepath-allocation-0').querySelector('[data-kind=skills] [data-action=plus]').click();
    check(saved().lifepathAllocations[0].skills[0] === getLifepath('Criminal').skills[0], 'Lifepath skill choice persists');
    byId('lifepath-0').value = 'Diplomat';
    byId('lifepath-0').dispatchEvent(new Event('change', { bubbles: true }));
    check(byId('lifepath-help-0').textContent.includes('não está disponível para Neonate'), 'Ancilla lifepath warns at Neonate tier');
    byId('play-level').value = 'ancilla';
    byId('play-level').dispatchEvent(new Event('change', { bubbles: true }));
    check(!byId('lifepath-help-0').textContent.includes('não está disponível'), 'Lifepath tier guidance updates');
    byId('lifepath-1').value = '';
    byId('lifepath-1').dispatchEvent(new Event('change', { bubbles: true }));
    check(saved().lifepaths[1] === '', 'One-lifepath character can leave second slot empty');
    byId('lifepath-0').value = '__custom__';
    byId('lifepath-0').dispatchEvent(new Event('change', { bubbles: true }));
    const customPath = byId('lifepaths').querySelector('textarea');
    check(!customPath.hidden, 'Custom lifepath text field available');
    customPath.value = 'Bibliotecário — História pessoal';
    customPath.dispatchEvent(new Event('input', { bubbles: true }));
    check(saved().lifepaths[0] === customPath.value && getLifepath(customPath.value) === null, 'Custom lifepath preserved as text');
    assertCharacter(saved());
    return passed;
}
