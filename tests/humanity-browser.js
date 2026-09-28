import { shiftHumanity, resistancePool } from '../data/humanity.js';
import { skillFocusCount, normalizeSkillFocuses } from '../data/skills.js';
import { assertCharacter } from '../js/storage.js';
import { getPower } from '../data/disciplines.js';

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
    const powerRow = () => byId('disciplines').querySelector('.power-row');
    const powerSelect = powerRow().querySelector('select');
    check(powerRow().querySelector('.power-description').textContent.includes('Efeito:'), 'Power effect is visible outside input');
    powerSelect.value = [...powerSelect.options].filter((option) => option.value).at(-1).value;
    powerSelect.dispatchEvent(new Event('change', { bubbles: true }));
    const chosen = saved().disciplines[0];
    const source = getPower(chosen.name, chosen.powers[0].name);
    check(powerRow().querySelector('.power-description').textContent.includes(source.summary), 'Power selection updates effect description');
    check(powerRow().querySelector('select').getAttribute('aria-describedby') === powerRow().querySelector('.power-description').id, 'Power description linked accessibly');
    clickDot('humanity-scale', 3);
    clickDot('nature-points', 4);
    check(stage() === 'Neutro', 'Nature marks do not shift humanity');
    byId('nature-success').click();
    check(saved().naturePoints === 4 && stage() === 'Neutro', 'Success removes one mark only');
    clickDot('nature-points', 4);
    byId('nature-failure').click();
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
    clickDot('humanity-scale', 6);
    clickDot('nature-points', 4);
    check(byId('nature-success').disabled, 'Mortal 3 blocks resistance success');
    byId('nature-painful').click();
    check(byId('nature-resistance').textContent.includes('Drama'), 'Painful failure displays consequence');
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
    return passed;
}
