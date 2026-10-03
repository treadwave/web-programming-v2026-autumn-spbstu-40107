export class Library {
  constructor(name, books) {
    this.name = name;
    this.books = books;
  }

  addBook(book) {
    this.books.push(book);
  }

  removeBook(title) {
    let obj = this.books.find((book) => book.title === title);
    let index = this.books.indexOf(obj);

    if (index != -1) {
      this.books.splice(index, 1);
    }
  }

  get booksCount() {
    return this.books.length;
  }
}

export function groupBooksByGenre(libs) {
  let flatBooks = libs.flatMap((libs) => libs.books);
  let map = Map.groupBy(flatBooks, (book) => book.genre);

  return map;
}

export function uniqueList(libs) {
  let set = new Set();
  let flatBooks = libs.flatMap((libs) => libs.books);

  for (const book of flatBooks) {
    set.add(book.author);
  }

  return Array.from(set);
}

export function groupByYear(libs) {
  let flatBooks = libs.flatMap((libs) => libs.books);
  let map = Map.groupBy(flatBooks, (book) => book.year);

  return map;
}

export function uniqueYears(libs) {
  let set = new Set();
  let flatBooks = libs.flatMap((libs) => libs.books);

  for (const book of flatBooks) {
    set.add(book.year);
  }

  return Array.from(set);
}

export function specificBooksOfAuthor(libs, author) {
  let booksOfAuthor = [];
  let flatBooks = libs.flatMap((libs) => libs.books);

  for (const book of flatBooks) {
    if (book.author === author) {
      booksOfAuthor.push(book);
    }
  }

  return booksOfAuthor;
}
