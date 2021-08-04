document.addEventListener("DOMContentLoaded", () => {
    navBar();

    const navButtons = document.querySelectorAll('ul li a')
    
    navButtons.forEach((element) => {
        element.addEventListener('click', () => eval(element.dataset.function)())
    })

})

function navBar(){
    const navBar = document.getElementById('nav-bar')
    navBar.innerHTML = `
        <ul>
            <li><a href="#" class="nav" data-function="displayHome">Home</a></li>
            <li><a href="#" class="nav" data-function="randomDrink">Random Drink Generator</a></li>
            <li><a href="#" class="nav" data-function="generateLetters">Browse By Letter</a></li>
            <li><a href="#" class="nav" data-function="addSearchBar">Drink Lookup</a></li>
        </ul>
        `
        listenForNav();
}

function listenForNav(){
    const buttons = document.querySelectorAll('a');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            buttons.forEach(active =>{
                active.classList.remove("active")
            })
            document.getElementsByClassName
            button.classList.add("active")
        })
    })
}

function displayHome(){
    const display = document.getElementById('display')
    display.innerHTML = ''
}

function randomDrink() {
    const display = document.getElementById('display');
    display.innerHTML = ''
    const drinkContainer = document.createElement('div')
    const whatToDrink = document.createElement('div')
    whatToDrink.innerHTML = `
        <h2>What drink should I have?</h2>
        <button id="randomButton">Generate</button>
        `
    display.append(whatToDrink, drinkContainer)
    const drinkButton = document.getElementById('randomButton')

    drinkButton.addEventListener('click', () => {
        fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php')
        .then(response => response.json())
        .then(data => {
            drinkContainer.innerHTML = ''
            showDrink(data, drinkContainer, 0)
        })
    })
}

function generateLetters() {
    const display = document.getElementById('display')
    const browse = document.createElement('h3')
    const alphabet = document.createElement('div')
    const list = document.createElement('div')
    list.className = 'results'
    browse.innerText = "Browse By Letter"
    display.innerHTML = ''
    alphabet.className = "alphabet"
    display.append(browse, alphabet, list)

    for (let i = 65; i <= 90; i++) {
        alphabet.innerHTML += `
        <a href="#">${String.fromCharCode(i)}</a>
        `
    }
    
    const letters = display.querySelectorAll('a')
    letters.forEach((letter) => {
        letter.addEventListener('click', () => {
            list.innerHTML = ''
            fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${letter.innerText}`)
                .then(response => response.json())
                .then(data => {
                    if (data.drinks !== null) {
                        list.innerHTML += `<h4 class="title">Drinks starting with the letter ${letter.innerText}: </h4>`
                        makeList(data, list)
                    }
                    else {
                        alert(`Sorry I guess there aren't any drinks starting with the letter '${letter.innerText}' yet\n Try another one`)
                    }
                })
        })
    })
}

function addSearchBar() {
    const display = document.getElementById('display')
    const newDiv = document.createElement('div')
    display.innerHTML = ''
    display.appendChild(newDiv)

    newDiv.innerHTML = `
    <form id="drink-search" action="" method="POST">
      <label for="search-bar">Search for a drink: </label>
      <input type="text" id="search-bar" name="search-bar" placeholder="Enter text here">
      <input type="submit" value="Search">
    </form>`

    const form = document.getElementById('drink-search')
    const results = document.createElement('div')
    results.className = 'results'
    form.after(results)

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        results.innerHTML = ''
        const searchBar = document.getElementById('search-bar')

        fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchBar.value}`)
            .then(response => response.json())
            .then(data => {
                if (data.drinks !== null) {
                    results.innerHTML += `
                        <h4 class="title">Drink results matching "${searchBar.value}": </h4>
                        `
                    makeList(data, results)
                }
                else {
                    alert(`Sorry I guess there aren't any drinks named '${searchBar.value}' yet\n Try searching for another one`)
                }
            })
    })
}

function makeList(data, display){
    const div = document.createElement('div')
    display.appendChild(div)
    data.drinks.forEach((drink, index) => {
        div.innerHTML += `
    <li>
        <a href="#" class="list"data-id="${index}">${drink.strDrink}</a>
    </li>
    `
    })
    for (const el of div.children) {
        el.addEventListener('click', (e) => {
            display.innerHTML = ''
            showDrink(data, display, e.target.dataset.id)
        })
    }
}

function showDrink(data, display, num) {
    const drinkTitle = document.createElement('h3')
    const drink = data.drinks[num]
    const name = drink.strDrink
    const isAlcoholic = drink.strAlcoholic
    const category = drink.strCategory
    const glass = drink.strGlass

    const descriptionContainer = document.createElement('div')
    const description = document.createElement('p')
    const descriptionLabel = document.createElement('p')

    const ingredientContainer = document.createElement('div')
    const drinkIngredients = document.createElement('p')
    const ingredientLabel = document.createElement('p')

    const instructionLabel = document.createElement('p')
    const drinkInstructions = document.createElement('p')
    const instructionContainer = document.createElement('div')

    const image = document.createElement('img')
    const showMe = document.createElement('button')
    showMe.innerText = "Show Me"
    image.src = `${drink.strDrinkThumb}/preview`

    drinkTitle.innerText = name
    display.append(drinkTitle, showMe)

    showMe.addEventListener('click', () => {
        showMe.after(image)
        showMe.remove()
    })

    descriptionContainer.className = "container"
    descriptionLabel.className = "label"
    description.className = "box"
    descriptionLabel.innerText = "Description: "

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

    ingredientContainer.className = "container"
    ingredientLabel.className = "label"
    drinkIngredients.className = "box"
    ingredientLabel.innerText = "Ingredients: "

    for (let i = 1; i <= 15; i++) {
        let measure = ""
        if (drink[`strMeasure${+i}`] !== null && drink[`strMeasure${+i}`] !== "") {
            measure = drink[`strMeasure${+i}`]
        }
        if(measure.charAt(measure.length-1) !== " "){
            measure += " "
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
    }

    ingredientContainer.append(ingredientLabel, drinkIngredients)
    display.appendChild(ingredientContainer)

    instructionContainer.className = "container"
    instructionLabel.className = "label"
    drinkInstructions.className = "box"
    instructionLabel.innerText = "How to Make: "
    drinkInstructions.innerText = drink.strInstructions

    instructionContainer.append(instructionLabel, drinkInstructions)
    display.appendChild(instructionContainer)
}
