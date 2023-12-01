// app.js
document.addEventListener('DOMContentLoaded', function () {
  const appElement = document.getElementById('app');
  const pokeInfoSection = document.createElement('section');
  pokeInfoSection.classList.add('poke-info-section');
  document.body.appendChild(pokeInfoSection);

  const apiUrl = 'https://pokeapi.co/api/v2/pokemon/';
  const pokemonNumbers = [88, 11, 156, 667, 555, 333, 258, 78, 700, 495];

  // Список всех покемонов
  const allPokemon = [];

  // Список выбранных покемонов
  const selectedPokemon = [];

  async function loadAllPokemonList() {
    try {
      const promises = pokemonNumbers.map(number => fetch(`${apiUrl}${number}`));
      const responses = await Promise.all(promises);
      const data = await Promise.all(responses.map(response => response.json()));
      allPokemon.push(...data);
      await displayPokemonList(allPokemon);
    } catch (error) {
      console.error('Ошибка загрузки списка всех покемонов:', error);
    }
  }

  function displayPokemonList(pokemonList) {
    const containerElement = document.createElement('div');
    containerElement.id = 'pokemon-container';

    for (const pokemon of pokemonList) {
      if (pokemon.hidden) continue; // Пропускаем скрытых покемонов

      const pokemonDiv = document.createElement('div');
      pokemonDiv.classList.add('pokemon-card');

      const imgElement = document.createElement('img');
      imgElement.src = pokemon.sprites.front_default;
      imgElement.alt = pokemon.name;

      const nameElement = document.createElement('div');
      nameElement.textContent = pokemon.name;

      pokemonDiv.addEventListener('click', () => handlePokemonClick(pokemon));

      pokemonDiv.appendChild(imgElement);
      pokemonDiv.appendChild(nameElement);

      containerElement.appendChild(pokemonDiv);
    }

    appElement.innerHTML = ''; // Очищаем содержимое appElement
    appElement.appendChild(containerElement);
  }

  function handlePokemonClick(pokemon) {
    if (selectedPokemon.length < 2) {
      selectedPokemon.push(pokemon);
      displaySelectedPokemon();
    }
  }

  function displaySelectedPokemon() {
    pokeInfoSection.innerHTML = '';

    selectedPokemon.forEach((pokemon, index) => {
      const pokeInfoContent = document.createElement('div');
      pokeInfoContent.classList.add('poke-info-content');

      const playerLabel = document.createElement('div');
      playerLabel.textContent = `Player ${index + 1}`;

      const imgElement = document.createElement('img');
      imgElement.src = pokemon.sprites.front_default;
      imgElement.alt = pokemon.name;

      const nameElement = document.createElement('div');
      nameElement.classList.add('poke-name');
      nameElement.textContent = pokemon.name;

      pokeInfoContent.appendChild(playerLabel);
      pokeInfoContent.appendChild(imgElement);
      pokeInfoContent.appendChild(nameElement);

      pokeInfoSection.appendChild(pokeInfoContent);

      // Добавляем battle-div после каждого poke-info-content, кроме последнего
      if (index < selectedPokemon.length - 1) {
        const battleDiv = document.createElement('div');
        battleDiv.classList.add('battle-div');

        const battleButton = document.createElement('button');
        battleButton.textContent = 'Битва';
        battleButton.classList.add('battle-button');

        battleButton.addEventListener('click', () => handleBattleClick());

        battleDiv.appendChild(battleButton);
        pokeInfoSection.appendChild(battleDiv);
      } else {
        // Создаем блок "Еще раз" после появления слова "WINNER"
        const resetBlock = createResetBlock();
        pokeInfoSection.appendChild(resetBlock);
        resetBlock.style.display = 'none'; // Изначально скрываем блок "Еще раз"
      }
    });
  }

  function createResetBlock() {
    const resetBlock = document.createElement('div');
    resetBlock.classList.add('reset-block');

    const resetButton = document.createElement('div');
    resetButton.textContent = 'Еще раз';
    resetButton.classList.add('reset-button');

    resetButton.addEventListener('click', () => handleResetClick());

    resetBlock.appendChild(resetButton);

    return resetBlock;
  }

function handleBattleClick() {
    // Проверяем, у какого покемона больше сила
    const winner = compareStrength(selectedPokemon[0], selectedPokemon[1]);

    // Определяем индексы покемонов в списке
    const indexWinner = selectedPokemon.indexOf(winner);
    const indexLoser = 1 - indexWinner; // Второй покемон - проигравший

    // Добавляем надпись WINNER к блоку с победителем
    const winnerContent = pokeInfoSection.children[indexWinner * 2];
    winnerContent.innerHTML += '<div class="winner-label">WINNER</div>';

    // Получаем данные проигравшего и победившего покемона
    const loser = selectedPokemon[indexLoser];
    const winnerName = winner.name;
    const loserName = loser.name;
    const winnerStrength = winner.base_experience;
    const loserStrength = loser.base_experience;

    // Добавляем строку с описанием битвы
    const battleDescription = document.createElement('div');
    battleDescription.classList.add('battle-description');
    battleDescription.textContent = `${winnerName} (СИЛА: ${winnerStrength}) > ${loserName} (СИЛА: ${loserStrength})`;
    winnerContent.appendChild(battleDescription);

    // Скрываем блок с проигравшим покемоном
   const loserContent = pokeInfoSection.children[indexLoser * 2];
  if (loserContent) {
    loserContent.classList.add('fade-out');
    // Устанавливаем флаг hidden для проигравшего покемона
    selectedPokemon[indexLoser].hidden = true;

    // Скрываем блок с проигравшим покемоном после завершения анимации
    setTimeout(() => {
      loserContent.style.display = 'none';
    }, 1000);
  }

    // Обновляем отображение списка покемонов
    displayPokemonList(allPokemon);

    // Ищем блок с кнопкой битвы
    const battleDiv = pokeInfoSection.querySelector('.battle-div');
    if (battleDiv) {
      // Скрываем блок с кнопкой битвы
      battleDiv.style.display = 'none';
      // Скрываем кнопку битвы
      const battleButton = battleDiv.querySelector('.battle-button');
      if (battleButton) {
        battleButton.style.display = 'none';
      }
    }

    // Показываем блок "Еще раз"
    const resetBlock = pokeInfoSection.querySelector('.reset-block');
    if (resetBlock) {
      resetBlock.style.display = 'block';
      // Скрываем кнопку битвы
      const resetButton = resetBlock.querySelector('.reset-button');
      if (resetButton) {
        resetButton.style.display = 'block';
      }
    }
}



function handleResetClick() {
  // Сбрасываем выбор покемонов
  selectedPokemon.length = 0;

  // Сбрасываем отображение блока "Еще раз"
  const resetBlock = pokeInfoSection.querySelector('.reset-block');
  if (resetBlock) {
    resetBlock.style.display = 'none';
    // Скрываем кнопку "Еще раз"
    const resetButton = resetBlock.querySelector('.reset-button');
    if (resetButton) {
      resetButton.style.display = 'none';
    }
  }

  // Обновляем отображение списка покемонов
  displayPokemonList(allPokemon);


  // Скрываем все блоки poke-info-content
  const allPokeInfoContent = pokeInfoSection.querySelectorAll('.poke-info-content');
  allPokeInfoContent.forEach((pokeInfoContent) => {
    pokeInfoContent.style.display = 'none';
  });
}


  function compareStrength(pokemon1, pokemon2) {
    const strength1 = pokemon1.base_experience;
    const strength2 = pokemon2.base_experience;

    return strength1 >= strength2 ? pokemon1 : pokemon2;
  }

  loadAllPokemonList();
});
