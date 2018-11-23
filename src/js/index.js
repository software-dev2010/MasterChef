import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader } from './views/base';

/*
  Global state of the app
  - Search object
  - Current recipe object
  - Shopping list object
  - Liked recipes
*/
const state = {};

const controlSearch = async () => {
    // 1) Get query from view
    const query = searchView.getInput();  

    if (query) {
        // 2) New search object and add to state
        state.search = new Search(query);

        // 3) Prepare UI for result
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes); 

        // 4) Search for recipes
        await state.search.getResults();

        // 5) Render results on UI
        clearLoader();
        searchView.renderResults(state.search.result);
    }
};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault()  // It stops the page from refreshing itself when clicking on the search button
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');

    /*
    If I click on the span or on the icon but it will find the closest element with the button inline class.
    So no matter where I click we only get the button which is exactly where this data-goto is located. 
    So, what we're interested for is the button where we have stored the page nummber. We really need to
    just select this exact element and not anny of their child elements
    */
    
    if (btn) {
        // This is a very good way to having access to data, and 10 is base 10
        const goToPage = parseInt(btn.dataset.goto, 10); 
        searchView.clearResults(); 
        searchView.renderResults(state.search.result, goToPage);
    }
});

