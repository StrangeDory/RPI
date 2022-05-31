function onSearchClick() {
    const author = document.getElementById('TextAuthor');
    const Title = document.getElementById('TextTitle');
    const category = document.getElementById('TextCategory');
    checkFields(author, Title, category);
    if(Title.value != "")
        find(author.value, category.value, Title.value);
    else
    {
        var openRequest = indexedDB.open("books", 3);
        openRequest.onsuccess = function() {
            var html = '<font size="4" face="MV BOLI">Searching results:</font>';
            html+= "\n";
            html += '<style>' +
                '   table {' +
                '    border: 4px double #333;' +
                '    border-collapse: separate;' +
                '    width: 100%;' +
                '    border-spacing: 7px 11px;' +
                '   }' +
                '  </style>';
            html += '<table>';
            html += '<tr>';
            html += '<td>' + '<font size="2" face="MV BOLI">Author</font>' + '</td>';
            html += '<td>' + '<font size="2" face="MV BOLI">Title</font>' + '</td>';
            html += '<td>' + '<font size="2" face="MV BOLI">Category</font>' + '</td>';
            html += '</tr>';
            var request = indexedDB.open("books", 3);
            request.onsuccess = function() {
                books = request.result;
                books.transaction(["books"], "readwrite")
                    .objectStore("books").openCursor().onsuccess = function (event) {
                    var cursor = event.target.result;
                    if (cursor) {
                        if (cursor) {
                            html += '<tr>';
                            html += '<td>' + cursor.value.author + '</td>';
                            html += '<td>' + cursor.key + '</td>';
                            html += '<td>' + cursor.value.category + '</td>';
                            html += '</tr>';
                            cursor.continue();
                        }
                        html += '</table>';
                        window.open("", "_blank", "top=100,left=100,width=600,height=400, popup").document.write(html);
                    }
                };
            };
        };
    };

}

function checkFields(author, Title, category) {
    if (/[^a-zA-ZА-я ]/.test(author.value)) {
        author.classList.add('input--error');
        return;
    }
    if (/[^a-zA-ZА-я ]/.test(Title.value)) {
        author.classList.add('input--error');
        return;
    }
    if(/[^a-zA-ZА-я ]/.test(category.value)) {
        author.classList.add('input--error');
        return;
    }
}

function find(author, category, Title) {
    var openRequest = indexedDB.open("books", 3);
    openRequest.onsuccess = function() {
        var html = '<font size="4" face="MV BOLI">Searching results:</font>';
        html+= "\n";
        html += '<style>' +
            '   table {' +
            '    border: 4px double #333;' +
            '    border-collapse: separate;' +
            '    width: 100%;' +
            '    border-spacing: 7px 11px;' +
            '   }' +
            '  </style>';
        html += '<table>';
        html += '<tr>';
        html += '<td>' + '<font size="2" face="MV BOLI">Author</font>' + '</td>';
        html += '<td>' + '<font size="2" face="MV BOLI">Title</font>' + '</td>';
        html += '<td>' + '<font size="2" face="MV BOLI">Category</font>' + '</td>';
        html += '</tr>';
        var keyRangeValue = IDBKeyRange.only(Title);
        var request = indexedDB.open("books", 3);
        request.onsuccess = function() {
            books = request.result;
            books.transaction(["books"], "readwrite")
                .objectStore("books").openCursor(keyRangeValue).onsuccess = function (event) {
                var cursor = event.target.result;
                if (cursor) {
                    if (cursor) {
                        html += '<tr>';
                        html += '<td>' + cursor.value.author + '</td>';
                        html += '<td>' + cursor.key + '</td>';
                        html += '<td>' + cursor.value.category + '</td>';
                        html += '</tr>';
                        cursor.continue();
                    }
                    html += '</table>';
                    window.open("", "_blank", "top=100,left=100,width=600,height=400, popup").document.write(html);
                } else {
                    alert('Nothing found!')
                }
                ;
            };
        };
    };
}

function onInputChange() {
    let inputs = document.getElementsByClassName('text-input');
    for (let element of inputs) {
        if (element.classList.contains('input--error')) {
            element.classList.remove('input--error');
        }
    }
}

let books;
function openDB() {
    var request = indexedDB.open("books", 3);
    request.onerror = function() {
        console.error("Error", request.error);
    };
    request.onupgradeneeded = function(event) {
        books = request.result;
        if (!books.objectStoreNames.contains('books')) {
            books.createObjectStore('books', {keyPath: 'Title'});
        }
    };
    request.onsuccess = function() {
        books = request.result;
    };
}

function addBook() {
    openDB();
    const author = document.getElementById('TextAuthor');
    const Title = document.getElementById('TextTitle');
    const category = document.getElementById('TextCategory');
    if(author.value == "" || Title.value == "" || category.value == "")
    {
        alert("All fields must be filled!");
        return;
    }
    //checkFields(author, Title, category);

    var openRequest = indexedDB.open("books", 3);
    openRequest.onsuccess = function() {
        var request2 = books.transaction(["books"], "readwrite")
            .objectStore("books")
            .add({ Title: Title.value, author: author.value, category: category.value });

        request2.onerror = function(event) {
            if (request2.error.name == "ConstraintError") {
                alert("Эта книга уже есть в базе данных!");
                event.preventDefault();
            }
        }
        var filteredBooks = "";
        books.transaction(["books"], "readwrite")
            .objectStore("books").openCursor().onsuccess = function(event) {
            var html = '<font size="4" face="MV BOLI">Searching results:</font>';
            html += "\n";
            html += '<style>' +
                '   table {' +
                '    border: 4px double #333;' +
                '    border-collapse: separate;' +
                '    width: 100%;' +
                '    border-spacing: 7px 11px;' +
                '   }' +
                '  </style>';
            html += '<table>';
            html += '<tr>';
            html += '<td>' + '<font size="2" face="MV BOLI">Author</font>' + '</td>';
            html += '<td>' + '<font size="2" face="MV BOLI">Title</font>' + '</td>';
            html += '<td>' + '<font size="2" face="MV BOLI">Category</font>' + '</td>';
            html += '</tr>';
            var cursor = event.target.result;
            if(cursor) {

                if (cursor) {
                    filteredBooks += JSON.stringify(cursor.value.author | cursor.key | cursor.value.category);
                    html += '<tr>';
                    html += '<td>' + cursor.value.author + '</td>';
                    html += '<td>' + cursor.key + '</td>';
                    html += '<td>' + cursor.value.category + '</td>';
                    html += '</tr>';
                    cursor.continue();
                }
                html += '</table>';
                window.open("", "_blank", "top=100,left=100,width=600,height=400, popup").document.write(html);
            };
        };
    };
}