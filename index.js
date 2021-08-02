
document.addEventListener("DOMContentLoaded", () => {
    const randomButton = document.getElementById('random')
    const bottom = document.getElementById('drink-list')
    const browse = document.createElement('h4')

    bottom.before(browse)
    browse.innerText = "Browse By Letter"

    randomButton.addEventListener('click', () => {
        randomDrink()
    })

    generateLetters()

    addSearchBar()
})

function randomDrink() {
    const display = document.getElementById('random-drink');
    fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php')
        .then(response => response.json())
        .then(data => {
            console.log(data)
            showDrink(data, display, 0)
        })
}

function generateLetters() {
    const browse = document.getElementsByTagName('h4')[0]
    const alphabet = document.createElement('div')
    const list = document.getElementById('drink-list')
    alphabet.className = "bottom"
    browse.after(alphabet)

    for (let i = 65; i <= 90; i++) {
        alphabet.innerHTML += `
        <a href="#">${String.fromCharCode(i)}</a>
        `
        if (i !== 90) {
            alphabet.innerHTML += '|'
        }
    }
    const letters = document.querySelectorAll('a')
    letters.forEach((letter) => {
        letter.addEventListener('click', () => {
            list.innerHTML = ""
            fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${letter.innerText}`)
                .then(response => response.json())
                .then(data => {
                    if (data.drinks !== null) {
                        list.innerHTML += `<p class="title">Drinks starting with the letter ${letter.innerText}: </p>`
                        data.drinks.forEach((drink, index) => {
                            list.innerHTML += `
                        <li>
                            <a href="#" data-id="${index}" data-name="${drink.strDrink}">${drink.strDrink}</a>
                        </li>
                        `
                        })
                        for (const el of list.children) {
                            el.addEventListener('click', (e) => {
                                showDrink(data, list, e.target.dataset.id)
                            })
                        }
                    }
                    else {
                        alert(`Sorry I guess there aren't any drinks starting with the letter '${letter.innerText}' yet\n Try another one`)
                    }
                })
        })
    })
}

function addSearchBar() {
    const info = document.getElementById('info')
    info.innerHTML = `
    <form id="drink-search" action="" method="POST">
      <label for="search-bar">Search for a drink: </label>
      <input type="text" id="search-bar" name="search-bar" placeholder="Enter text here">
      <input type="submit" value="Search">
    </form>`

    const form = document.getElementById('drink-search')
    const results = document.createElement('div')
    results.className = 'drink-list'
    results.id = 'results'
    form.after(results)

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        results.innerHTML = ``
        const searchBar = document.getElementById('search-bar')

        fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchBar.value}`)
            .then(response => response.json())
            .then(data => {
                if (data.drinks !== null) {
                    results.innerHTML += `
                        <p class="title">Here are your choices:</p>
                        `
                    data.drinks.forEach((drink, index) => {
                        results.innerHTML += `
                    <li>
                        <a href="#" data-id="${index}" data-name="${drink.strDrink}">${drink.strDrink}</a>
                    </li>
                    `
                    })
                    for (const el of results.children) {
                        el.addEventListener('click', (e) => {
                            showDrink(data, results, e.target.dataset.id)
                        })
                    }
                }
                else {
                    alert(`Sorry I guess there aren't any drinks named '${searchBar.value}' yet\n Try searching for another one`)
                }
            })
    })
}

function showDrink(data, display, num) {
    display.innerHTML = ""
    const drinkTitle = document.createElement('h3')

    const descriptionContainer = document.createElement('div')
    const description = document.createElement('p')
    const descriptionLabel = document.createElement('p')
    const ingredientContainer = document.createElement('div')
    const drinkIngredients = document.createElement('p')
    const instructionLabel = document.createElement('p')
    const ingredientLabel = document.createElement('p')
    const drinkInstructions = document.createElement('p')
    const instructionContainer = document.createElement('div')
    const image = document.createElement('img')
    const showMe = document.createElement('button')
    const drink = data.drinks[num]

    showMe.innerText = "Show Me"

    drinkTitle.innerText = drink.strDrink

    image.src = `${drink.strDrinkThumb}/preview`

    display.append(drinkTitle, showMe)

    showMe.addEventListener('click', () => {
        showMe.after(image)
        showMe.remove()
    })

    descriptionContainer.className = "container"
    descriptionLabel.className = "label"
    descriptionLabel.innerText = "Description: "
    description.className = "box"

    let name = drink.strDrink
    let isAlcoholic = drink.strAlcoholic
    let category = drink.strCategory
    let glass = drink.strGlass

    description.innerText = "A"

    const vowel = 'aeiou'
    for (const letter of vowel) {
        if (letter === name.charAt(0).toLowerCase()) {
            description.innerText += "n"
        }
    }
    description.innerText += ` ${name} is a`


    for (const letter of vowel) {
        if (letter === isAlcoholic.charAt(0).toLowerCase()) {
            description.innerText += "n"
        }
    }

    description.innerText += ` ${isAlcoholic} ${category} served in a`
    for (const letter of vowel) {
        if (letter === glass.charAt(0).toLowerCase()) {
            description.innerText += "n"
        }
    }
    description.innerText += ` ${glass}`

    descriptionContainer.append(descriptionLabel, description)
    display.appendChild(descriptionContainer)

    drinkIngredients.className = "box"
    drinkIngredients.id = "ingredients"
    ingredientLabel.className = "label"
    ingredientLabel.innerText = "Ingredients: "
    ingredientContainer.className = "container"

    ingredientContainer.append(ingredientLabel, drinkIngredients)

    for (let i = 1; i <= 15; i++) {
        let measure = ""
        if (drink[`strMeasure${+i}`] !== null && drink[`strMeasure${+i}`] !== "") {
            measure = drink[`strMeasure${+i}`]
        }
        let ingredient = ""
        if (drink[`strIngredient${+i}`] !== null && drink[`strIngredient${+i}`] !== "") {
            ingredient = drink[`strIngredient${+i}`]
        }
        if (measure || ingredient) {
            drinkIngredients.innerHTML += `
            <li>
            ${measure + ingredient}
            </li>
            `
        }

        display.appendChild(ingredientContainer)
    }

    instructionLabel.className = "label"
    instructionLabel.innerText = "How to Make: "
    drinkInstructions.className = "box"
    drinkInstructions.innerText = drink.strInstructions
    instructionContainer.className = "container"

    instructionContainer.append(instructionLabel, drinkInstructions)

    display.appendChild(instructionContainer)
}