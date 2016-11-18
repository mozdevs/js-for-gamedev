var battle = new RPG.Battle();
var actionForm, spellForm, targetForm;
var infoPanel;

function renderParties() {
    // render both parties
    renderCharacters(
        battle.characters.allFrom('heroes'),
        document.querySelector('#heroes .character-list'));
    renderCharacters(
        battle.characters.allFrom('monsters'),
        document.querySelector('#monsters .character-list'));

    function renderCharacters(charas, list) {
        var html = '';
        for (var charaId in charas) {
            var chara = charas[charaId];
            html += `<li data-chara-id="${charaId}"
                     class="${chara.hp <= 0 ? 'dead' : ''}">${charaId}
                     (HP: <strong>${chara.hp}</strong>/${chara.maxHp},
                     MP: <strong>${chara.mp}</strong>/${chara.maxMp})
                     </li>`;
        }
        list.innerHTML = html;
    }
}

function renderOptions(options, list) {
    var html = '';
    for (var i = 0; i < options.length; i++) {
        html += `<li><label>
                 <input ${i === 0 ? 'required' : ''} type="radio" name="option"
                 value="${options[i]}">
                ${options[i]}
                 </label></li>`;
    }
    list.innerHTML = html;
}

function showActionMenu() {
    actionForm.style.display = 'block';
    renderOptions(battle.options.list(), actionForm.querySelector('.choices'));
}

function showTargetMenu() {
    targetForm.style.display = 'block';
    renderOptions(battle.options.list(), targetForm.querySelector('.choices'));
}

function showSpellMenu() {
    spellForm.style.display = 'block';
    var spells = battle.options.list();
    renderOptions(spells, spellForm.querySelector('.choices'));
    // hide or disable the submit button depending on whether there are spells
    // available to select
    spellForm.querySelector('button[type=submit]').disabled =
        spells.length === 0;
}

function prettifyEffect(obj) {
    return Object.keys(obj).map(function (key) {
        var sign = obj[key] > 0 ? '+' : ''; // show + sign for positive effects
        return `${sign}${obj[key]} ${key}`;
    }).join(', ');
}


battle.setup({
    heroes: {
        members: [
            RPG.entities.characters.heroTank,
            RPG.entities.characters.heroWizard
        ],
        grimoire: [
            RPG.entities.scrolls.health,
            RPG.entities.scrolls.fireball
        ]
    },
    monsters: {
        members: [
            RPG.entities.characters.monsterSlime,
            RPG.entities.characters.monsterBat,
            RPG.entities.characters.monsterSkeleton,
            RPG.entities.characters.monsterBat
        ]
    }
});

battle.on('start', function (data) {
    console.log('START', data);
});

battle.on('turn', function (data) {
    console.log('TURN', data);

    // render the characters
    renderParties();
    // highlight current character
    document.querySelector(`[data-chara-id="${data.activeCharacterId}"]`)
        .classList.add('active');
    // show battle actions form
    showActionMenu();
});

battle.on('info', function (data) {
    console.log('INFO', data);

    var effects = prettifyEffect(data.effect || {});

    var msg = `<strong>${data.activeCharacterId}</strong> ${data.action}ed`;
    if (data.action !== 'defend') {
        if (data.action === 'cast') {
            msg += ` <em>${data.scrollName}</em> on`;
        }
        msg += ` <strong>${data.targetId}</strong>`;
        if (!data.success) {
            msg += ', but failed';
        }
        else {
            msg += ` and caused ${effects}`;
        }
    }

    msg += '.';
    document.querySelector('#battle-info').innerHTML = msg;
});

battle.on('end', function (data) {
    console.log('END', data);

    // re-render the parties so the death of the last character gets reflected
    renderParties();

    document.querySelector('#battle-info').innerHTML =
        `Battle is over! Winners were: <strong>${data.winner}</strong>`;
});

window.onload = function () {
    actionForm = document.querySelector('form[name=select-action]');
    targetForm = document.querySelector('form[name=select-target]');
    spellForm = document.querySelector('form[name=select-spell]');
    infoPanel = document.querySelector('#battle-info');

    actionForm.addEventListener('submit', function (evt) {
        evt.preventDefault();

        // select the action chosen by the player
        var action = actionForm.elements.option.value;
        battle.options.select(action);
        // hide action menu
        actionForm.style.display = 'none';

        if (action === 'attack') {
            showTargetMenu();
        }
        else if (action === 'cast') {
            showSpellMenu();
        }
    });

    targetForm.addEventListener('submit', function (evt) {
        evt.preventDefault();
        // select the target chosen by the player
        var target = targetForm.elements.option.value;
        battle.options.select(target);
        // hide this menu
        targetForm.style.display = 'none';
    });

    targetForm.querySelector('.cancel')
    .addEventListener('click', function (evt) {
        evt.preventDefault();
        battle.options.cancel();
        targetForm.style.display = 'none';
        showActionMenu();
    });

    spellForm.addEventListener('submit', function (evt) {
        evt.preventDefault();
        // select the spell chosen by the player
        var spell = spellForm.elements.option.value;
        battle.options.select(spell);
        // hide this menu & show targets
        spellForm.style.display = 'none';
        showTargetMenu();
    });

    spellForm.querySelector('.cancel')
    .addEventListener('click', function (evt) {
        evt.preventDefault();
        battle.options.cancel();
        spellForm.style.display = 'none';
        showActionMenu();
    });

    battle.start();
};
