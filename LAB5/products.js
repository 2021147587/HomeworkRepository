fetch('product.json')
  .then( response => {
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    return response.json();
  })
  .then( json => initialize(json) )
  .catch( err => console.error(`Fetch problem: ${err.message}`) );
  
  categoryGroup = [];
  finalGroup = [];
  viewGroup = [];
  ccount = 0;
  const LOADING_COUNT = 4;

function initialize(products) {

  const category = document.querySelector('#category');
  const searchTerm = document.querySelector('#searchTerm');
  const searchBtn = document.querySelector('button');
  const main = document.querySelector('main');

  let lastCategory = category.value;
  let lastSearch = '';

  let categoryGroup;
  let finalGroup;

  finalGroup = products;
  updateDisplay();

  searchBtn.addEventListener('click', selectCategory);

  window.addEventListener('scroll',()=>{
    console.log("scrolled", window.scrollY + window.innerHeight) //scrolled from top
    console.log(document.body.offsetHeight)
    if(window.scrollY + window.innerHeight + 20 >= document.body.offsetHeight){
        updateDisplay2();
    }
  })

  function selectCategory(e) {
    e.preventDefault();

    categoryGroup = [];
    finalGroup = [];

    if (category.value === lastCategory && searchTerm.value.trim() === lastSearch) {
      return;
    } else {
      lastCategory = category.value;
      lastSearch = searchTerm.value.trim();

      if (category.value === 'All') {
        categoryGroup = products;
        selectProducts();

      }
      
      else {
        const lowerCaseType = category.value.toLowerCase();
        categoryGroup = products.filter( product => product.character === lowerCaseType );
        selectProducts();
      }
    }
  }

  function selectProducts() {

    if (searchTerm.value.trim() === '') {
      finalGroup = categoryGroup;
    }
    else {
      const lowerCaseSearchTerm = searchTerm.value.trim().toLowerCase();
      finalGroup = categoryGroup.filter( product => product.name.includes(lowerCaseSearchTerm));
    }
    updateDisplay();
  }

  function updateDisplay() {
    ccount = 0;

    while (main.firstChild) {
      main.removeChild(main.firstChild);
    }

    if (finalGroup.length === 0) {
      const para = document.createElement('p');
      para.textContent = 'No results to display!';
      main.appendChild(para);
    }
    else {
        viewGroup = finalGroup.slice(ccount, ccount + LOADING_COUNT);
        ccount += LOADING_COUNT; 
      for (const product of viewGroup) {
        fetchBlob(product);
      }
    }
  }

    function updateDisplay2() {
      console.info(viewGroup, finalGroup)
      if (finalGroup.length === 0) {
        const para = document.createElement('p');
        para.textContent = 'No results to display!';
        main.appendChild(para);
      }
      else {
        viewGroup = finalGroup.slice(ccount, ccount + LOADING_COUNT);
        ccount += LOADING_COUNT;
        for (const product of viewGroup) {
          fetchBlob(product);
        }
      }
    }

  function fetchBlob(product) {
    const url = `images/${product.image}`;
    fetch(url)
      .then( response => {
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        return response.blob();
      })
      .then( blob => showProduct(blob, product) )
      .catch( err => console.error(`Fetch problem: ${err.message}`) );
  }

  function showProduct(blob, product) {
    const objectURL = URL.createObjectURL(blob);
    const section = document.createElement('section');
    const heading = document.createElement('h2');
    const para = document.createElement('p');
    const image = document.createElement('img');

    section.setAttribute('class', product.type);
    heading.setAttribute('class', "showhide");
    para.setAttribute('class', "showhide");
    heading.textContent = product.name.replace(product.name.charAt(0), product.name.charAt(0).toUpperCase());

    para.textContent = product.price;

    image.src = objectURL;
    image.alt = product.name;

    main.appendChild(section);

    section.appendChild(image);    
    section.appendChild(heading);
    section.appendChild(para);

    section.addEventListener('click', showhide_context);

    function showhide_context(e) {
      e.preventDefault();
      h = this.querySelector('h2');
      p = this.querySelector('p');
      if (p.getAttribute('class') === 'showhide') {
        h.removeAttribute('class', "showhide");
        p.removeAttribute('class', "showhide");
      }
      else {
        h.setAttribute('class', "showhide");
        p.setAttribute('class', "showhide");
      }
    }
  }
}

