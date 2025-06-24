//I need to store my API key so JavaScript can use it to talk to the NYT servers
// Source: W3Schools Variables - https://www.w3schools.com/js/js_variables.asp
const apiKey = "du2HiyY8ayGnsIFSFCij50so6OL2l0tA";

//the main web address for the New York Times Books API
// Source: MDN Fetch API - https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
const baseURL = "https://api.nytimes.com/svc/books/v3/lists";

//I want to get the most recent (current) best sellers list, not an old one from last week, but I could also put a specific date here like "2024-06-15" if I wanted old data
const listTime = "current";

/*const listTime = "2024-01-01"; 
const listTime = "2023-12-25"; 
const listTime = "2024-06-01";  */

//I'm asking specifically for hardcover fiction books (novels in hard cover, but could change this to "paperback-nonfiction" or other categories the API offers
const listName = "hardcover-fiction";
/*      
const listName = "paperback-nonfiction";          
const listName = "children-picture-books";        
const listName = "young-adult-hardcover";     
const listName = "mass-market-paperback";         
const listName = "combined-print-and-e-book-fiction"; */

// main function gets books from the internet using an arrow function which is a newer, shorter way to write functions
// Source: MDN Arrow Functions - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions
const getBooks = () => {
  // building the complete web address by combining pieces of info using template literals to insert variables into strings
  // Source: W3Schools Template Literals - https://www.w3schools.com/js/js_string_templates.asp
  const url = `${baseURL}/${listTime}/${listName}.json?api-key=${apiKey}`;

  //printing the web address to my browser's console , if something goes wrong, I can check if the URL sounds right
  // Source: W3Schools Console - https://www.w3schools.com/jsref/met_console_log.asp
  console.log("Fetching data from:", url);

  //asking the internet data using fetch()
  // Source: MDN Fetch API - https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
  fetch(url)
    // converting the server's response into readable JSON data, the arrow function syntax: response => response.json( means "take response, return response.json()"
    // Source: MDN Arrow Functions - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions
    .then((response) => response.json())
    //taking the data and do something useful with it
    .then((data) => {
      //printing api call results to the console
      console.log(data);
      // callin display function and passing the books, data.results.books is the array I want
      showData(data.results.books);
    })
    // If anything goes wrong (internet is down, API is broken, etc), this catches the error
    //showing a message instead of letting the website crash
    // Source: MDN Promise.catch() - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch
    .catch((error) => {
      console.error("Error fetching data:", error);
      const container = document.getElementById("books");
      container.innerHTML =
        '<div class="loading">Sorry, failed to load books. Please try again later.</div>';
    });
};

// taking tje array of book data and turning it into cards on the webpage
// using arrow function syntax again,  const functionName = (parameter) => { code }
// Source: MDN Arrow Functions - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions
const showData = (books) => {
  // finding the HTML container where I am puttin my book cards
  // getElementById finds the element with id="books" in my HTML
  // Source: W3Schools getElementById - https://www.w3schools.com/jsref/met_document_getelementbyid.asp
  const container = document.getElementById("books");

  // clearing out any old content to start fresh
  // innerHTML = "" means "make this element empty"
  container.innerHTML = "";

  /*
const amazonUrl = document.createElement("a");
amazonUrl.href = book.amazon_product_url;
amazonUrl.textContent = "Buy on Amazon";
amazonUrl.target = "_blank";*/

  // I need to make sure I actually have books to display, an if statement prevents the code from crashing if something went wrong
  //!books means "if books doesn't exist" and books.length === 0 means "if the array is empty"
  // The || means "OR" - so if EITHER condition is true, it will show an error message
  // Source: MDN Logical Operators - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_OR
  if (!books || books.length === 0) {
    // If there are no books, show a message instead of a blank page
    container.innerHTML = `<div class="loading">No books found.</div>`;
    // return stops the function so it doesnt continue displaying books that don't exist
    return;
  }

  //looping through each book in the array and creatign a card for it, forEach is like saying "for each book in the list, do this",  using arrow function syntax again book => { } instead of function(book) { }
  // Source: MDN Array.forEach - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
  books.forEach((book) => {
    // creating a new HTML div element to hold all the info for one book, visualizing it as an index card for each book
    // Source: W3Schools createElement - https://www.w3schools.com/jsref/met_document_createelement.asp
    const card = document.createElement("div");
    // giving the card a CSS class so the stylesheet can make it look nice
    card.className = "book-card";

    //attributes to help screen readers and keyboard
    // tabindex="0" means keyboard users can focus on this card by pressing Tab
    // Source: MDN tabindex - https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex
    card.setAttribute("tabindex", "0");
    // role="region" tells my screen readers this is a meaningful section of content
    // Source: MDN ARIA roles - https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles
    card.setAttribute("role", "region");
    // aria-label provides a spoken description for screen readers
    //using template literals (${}) to insert the book's title and author
    // template literals are cleaner than using + to combine strings
    // Source: MDN Template Literals - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
    card.setAttribute("aria-label", `${book.title} by ${book.author}`);

    //individual HTML elements for each piece of book information
    // an h3 for the book title
    const title = document.createElement("h3");
    // textContent puts text inside the element
    // Source: MDN textContent - https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent
    title.textContent = book.title;

    // a paragraph element for the author's name
    const author = document.createElement("p");
    // Using template literals again to create "by AuthorName" text
    author.textContent = `by ${book.author}`;

    //  a paragraph for the book description
    const description = document.createElement("p");
    // the || operator means if book.description exists, use it, otherwise use the backup text
    // prevents showing "undefined" if a book has no description
    // Source: MDN Logical OR - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_OR
    description.textContent = book.description || "No description available.";

    //  a paragraph for publisher information
    const publisher = document.createElement("p");
    //template literal to create "Publisher: PublisherName" text
    publisher.textContent = `Publisher: ${book.publisher}`;

    //  a paragraph for the book's ranking on the bestseller list
    const rank = document.createElement("p");
    // template literal to create "Rank: #1" style text
    rank.textContent = `Rank: #${book.rank}`;

    //  an img element to show the book cover
    const image = document.createElement("img");
    // src attribute tells the browser where to find the image
    image.src = book.book_image;
    // alt attribute describes the image for screen readers and if the image fails to load
    // template literal to create "Cover of BookTitle" description
    // source: MDN img element - https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img
    image.alt = `Cover of ${book.title}`;
    // adding CSS class so the image gets styled properly
    image.className = "book-image";

    // put all elements inside my card in the order I want them to appear
    // appendChild means add this element as a child inside the parent element
    // Source: W3Schools appendChild - https://www.w3schools.com/jsref/met_node_appendchild.asp
    card.appendChild(title); // title goes at the top
    card.appendChild(author); // author goes under the title
    card.appendChild(description); // description in the middle
    card.appendChild(publisher); // publisher info
    card.appendChild(rank); // ranking number
    card.appendChild(image); // book cover image at the bottom

    // add completed card to main container on webpage, the card actually appear on the screen
    container.appendChild(card);
  });
};

// waiting for the HTML page to finish loading before running JavaScript
// DOMContentLoaded means "wait until all the HTML elements exist before trying to use them"
// using an arrow function () => { } as my event handler
// Source: MDN DOMContentLoaded - https://developer.mozilla.org/en-US/docs/Web/API/Document/DOMContentLoaded_event
document.addEventListener("DOMContentLoaded", () => {
  // Once the page is ready, the process  starts by calling the getBooks function, which kicks off the API call and eventually displays all the books
  getBooks();
});
