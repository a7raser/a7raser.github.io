class Book {
    constructor(title, author, pages, read) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read;
    }
}

class Library {
    myLibrary = [];

    addBookToLibrary(title, author, pages, read) {
        const book = new Book(title, author, pages, read);
        this.myLibrary.push(book);
        const index = this.myLibrary.indexOf(book);
        localStorage.setItem(index, JSON.stringify(book));
    }

    removeBookFromLibrary(book) {
        this.myLibrary.splice(book, 1);
        localStorage.removeItem(book);
    }

    readStatus(book) {
        this.myLibrary[book].read = (this.myLibrary[book].read === true) ? false : true;
        const temp = this.myLibrary[book];
        localStorage.removeItem(this.myLibrary[book]);
        localStorage.setItem(book, JSON.stringify(temp))
    }
}

class Interface {
    library = new Library();

    main = document.querySelector('#main');
    submitButton = document.querySelector('#submitBook');
    addBookModal = document.querySelector('#addBookModal');
    modalCover = document.querySelector('#modalCover');
    addBookButton = document.querySelector('#addBook');
    cancelButton = document.querySelector('#cancel');

    addBook() {
        window.addEventListener('click', (event) => {
            if (event.target == modalCover) {
                addBookModal.style.display = 'none';
                modalCover.style.display = 'none';
            }
        });
        this.addBookButton.addEventListener('click', () => {
            addBookModal.style.display = 'block';
            modalCover.style.display = 'block';
        });
        this.cancelButton.addEventListener('click', () => {
            addBookModal.style.display = 'none';
            modalCover.style.display = 'none';
        });
        this.submitButton.addEventListener('click', () => this.submitBook());
        window.addEventListener('keydown', (event) => {
            if (event.code == 'Enter' && addBookModal.style.display == 'block' && event.target != this.cancelButton && event.target != this.submitButton) {
                this.submitBook();
            }
        });
    }

    submitBook() {
        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;
        const pages = document.getElementById('pages').value;
        const read = document.getElementById('read').checked;

        if (this.validateFields(title, author, pages) === true) {
            if (this.validateEntry(title, author) === true) {
                alert('Book already exists!');
            } else {
                this.library.addBookToLibrary(title, author, pages, read);
                this.bookDisplay(this.library.myLibrary[this.library.myLibrary.length - 1]);
            }
        }
    }

    validateEntry(title, author) {
        for (let i = 0; i < this.library.myLibrary.length; i++) {
            if (title != this.library.myLibrary[i].title || author != this.library.myLibrary[i].author) {
                continue;
            }
            return true;
        }
    }

    validateFields(title, author, pages) {
        if (title == '' || author == '' || pages == '') {
            return alert('Please fill in all fields!')
        }
        return true;
    }

    bookDisplay(bookEntry) {
        const bookDiv = document.createElement('div');
        const infoDiv = document.createElement('div');
        const buttonDiv = document.createElement('div')
        const bookTitle = document.createElement('h2');
        const bookAuthor = document.createElement('h3');
        const bookPages = document.createElement('h4');
        const bookReadStatus = document.createElement('p');
        const removeBookButton = document.createElement('button');
        const readStatusButton = document.createElement('button');

        bookDiv.className = 'bookDiv';
        bookDiv.setAttribute('id', `${this.library.myLibrary.findIndex(i => i.title == bookEntry.title && i.author == bookEntry.author)}`);

        infoDiv.className = 'infoDiv';
        buttonDiv.className = 'buttonDiv';

        bookTitle.textContent = bookEntry.title;
        bookAuthor.textContent = bookEntry.author;
        bookPages.textContent = `${bookEntry.pages} pages`;
        bookReadStatus.textContent = (bookEntry.read == true) ? 'Read' : 'Not Read';

        removeBookButton.textContent = 'Remove';
        removeBookButton.className = 'removeBook';
        removeBookButton.addEventListener('click', () => {
            this.library.removeBookFromLibrary(bookDiv.id);
            main.removeChild(bookDiv);
        });

        readStatusButton.textContent = 'Status';
        readStatusButton.className = 'readStatus';
        readStatusButton.addEventListener('click', () => {
            this.library.readStatus(bookDiv.id);
            bookReadStatus.textContent = (this.library.myLibrary[bookDiv.id].read === true) ? 'Read' : 'Not Read';
        });

        main.appendChild(bookDiv);
        bookDiv.appendChild(infoDiv);
        bookDiv.appendChild(buttonDiv);
        infoDiv.appendChild(bookTitle);
        infoDiv.appendChild(bookAuthor);
        infoDiv.appendChild(bookPages);
        infoDiv.appendChild(bookReadStatus);
        buttonDiv.appendChild(removeBookButton);
        buttonDiv.appendChild(readStatusButton);
    }

    libraryDisplay(library) {
        for (let i = 0; i < library.length; i++) {
            this.bookDisplay(library[i]);
        }
    }

    init() {
        this.addBook();
        this.libraryDisplay(this.library.myLibrary);
    }
}

const interface = new Interface();

if (localStorage.length === 0) {
    interface.library.addBookToLibrary('1984', 'George Orwell', 355, true);
    interface.library.addBookToLibrary('The Hitchhiker\'s Guide to the Galaxy', 'Douglas Adams', 732, true);
    interface.library.addBookToLibrary('Brave New World', 'Aldous Huxley', 229, true);
    interface.library.addBookToLibrary('The Old Man and the Sea', 'Ernest Hemingway', 99, true);
} else {
    let nullCatch = 0;
    for (let i = 0; i < localStorage.length + nullCatch; i++) {
        const book = JSON.parse(localStorage.getItem(i));
        localStorage.removeItem(i);
        if (book !== null) {
            interface.library.addBookToLibrary(book.title, book.author, book.pages, book.read);
        } else {
            nullCatch++;
            continue;
        }
    }
}

interface.init();