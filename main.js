let bookList = [];
const updateBook = 'update-book-list';

document.addEventListener('DOMContentLoaded', function() {
    const submitForm = document.querySelector('#inputDataBuku');
    submitForm.addEventListener('submit', function(event){
        event.preventDefault();
        addBookList();
    });

    const searchForm = document.getElementById('searchBook');
    searchForm.addEventListener('submit', searchBooks);

    loadSavedData();
    renderBookList();
});

function addBookList() {
    const bookTitle = document.querySelector("#judulBuku");
    const authorName = document.querySelector("#namaPengarang");
    const publicationYear = document.querySelector("#tahunTerbit");
    const bookIsComplete = document.querySelector("#inputBookIsComplete");

    const bookObject = {
        id: +new Date,
        title: bookTitle.value,
        author: authorName.value,
        year: publicationYear.value,
        isComplete: false,
    };
    bookList.push(bookObject);

    document.dispatchEvent(new Event(updateBook));
    saveData();
};

function makeBookList(bookObject){
    const titleBook = document.createElement("h3");
    titleBook.innerText = bookObject.title;
    
    const bookAuthor = document.createElement("p");
    bookAuthor.innerText = "Penulis: " + bookObject.author;
    
    const bookYear = document.createElement("p");
    bookYear.innerText = "Tahun: " + bookObject.year;
    
    const textContainer = document.createElement("div");
    textContainer.classList.add("text-item");
    textContainer.append(titleBook, bookAuthor, bookYear); 

    const bookContainer = document.createElement("article");
    bookContainer.classList.add("book-item");
    bookContainer.append(textContainer);
    bookContainer.setAttribute('id', `book-${bookObject.id}`);

    const deleteButton = document.createElement('button');
    deleteButton.innerText = "Hapus Buku";
    deleteButton.classList.add('btn');

    deleteButton.addEventListener('click', function(){
        const isConfirm = window.confirm("Yakin untuk Menghapus Buku?");
        if(isConfirm) {
            deleteBook(bookObject.id);
        }
    });

    if(bookObject.isComplete) {
        const incompleteButton = document.createElement('button');
        incompleteButton.innerText = "Belum Selesai Dibaca";
        incompleteButton.classList.add('btn');
        
        incompleteButton.addEventListener('click', function(){
            markAsIncomplete(bookObject.id);
        });
        bookContainer.append(incompleteButton);
    } else {
        const completeButton = document.createElement('button');
        completeButton.innerText = "Selesai Dibaca";
        completeButton.classList.add('btn');
        
        completeButton.addEventListener('click', function(){
            markAsComplete(bookObject.id);
        });
        bookContainer.append(completeButton, deleteButton);
    }

    bookContainer.append(deleteButton);

    return bookContainer;
};

function findBooks(bookId) {
    for (const bookItem of bookList) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}

function findBookIndex(bookId) {
    for (const index in bookList) {
        if(bookList[index].id === bookId) {
            return index;
        }
    }
    return -1;
}

function markAsComplete(bookId) {
    const bookTarget = findBooks(bookId);

    if (bookTarget == null) return;

    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(updateBook));
    saveData();
}

function markAsIncomplete(bookId) {
    const bookTarget = findBooks(bookId);

    if (bookTarget == null) return;

    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(updateBook));
    saveData();
}

function deleteBook(bookId) {
    const bookTarget = findBooks(bookId);

    if (bookTarget == -1) return;

    bookList.splice(bookTarget, 1);
    document.dispatchEvent(new Event(updateBook));
    saveData();
}

function searchBooks(event) {
    event.preventDefault();
    const titleInput = document.querySelector("#searchBookByTitle");
    const search = titleInput.value;

    if(search) {
        const filteredBook = bookList.filter(function(book){
            return book.title.toLowerCase().includes(search.toLowerCase());
        });

        const incompleteBook = document.querySelector('#incompleteList');
        incompleteBook.innerHTML = '';
        const completeBook = document.querySelector('#completeList');
        completeBook.innerHTML = '';
        
        for (const bookItem of filteredBook) {
            const bookElement = makeBookList(bookItem);
            if (!bookItem.isComplete) {
                incompleteBook.append(bookElement);
            } else {
                completeBook.append(bookElement);
            }
        }
    } else {
        document.dispatchEvent(new Event(updateBook));
    }
}

function saveData() {
    localStorage.setItem('bookList', JSON.stringify(bookList));
}

function loadSavedData() {
    const savedBookList = localStorage.getItem('bookList');

    if(savedBookList) {
        bookList = JSON.parse(savedBookList);
        renderBookList();
    }
}

function renderBookList() {
    const incompleteBook = document.querySelector('#incompleteList');
    const completeBook = document.querySelector('#completeList');
    incompleteBook.innerHTML = '';
    completeBook.innerHTML = '';

    for (const bookItem of bookList) {
        const bookElement = makeBookList(bookItem);
        if (!bookItem.isComplete) {
            incompleteBook.append(bookElement);
        } else {
            completeBook.append(bookElement);
        }
    }
}

document.addEventListener(updateBook, function(){
    const incompleteBook = document.querySelector('#incompleteList');
    incompleteBook.innerHTML = '';
    const completeBook = document.querySelector('#completeList');
    completeBook.innerHTML = '';

    for (const bookItem of bookList) {
        const bookElement = makeBookList(bookItem);
        if(!bookItem.isComplete){
            incompleteBook.append(bookElement);
        } else {
            completeBook.append(bookElement);
        }
    }
});
