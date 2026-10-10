import {StrictMode, useState} from 'react';
import {createRoot} from 'react-dom/client';
import './styles.css';

const MOCK_BOOKS = [
  {id: 1, title: 'Товар 1', author: 'Автор 1', price: 900},
  {id: 2, title: 'Товар 2', author: 'Автор 2', price: 1200},
  {id: 3, title: 'Товар 3', author: 'Автор 3', price: 1500},
];

function App() {
  const [cart, setCart] = useState([]);

  const addToCart = (book) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === book.id);
      if (existing) {
        return prev.map((item) =>
          item.id === book.id ? {...item, quantity: item.quantity + 1} : item,
        );
      }
      return [...prev, {...book, quantity: 1}];
    });
  };

  const increaseQuantity = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? {...item, quantity: item.quantity + 1} : item,
      ),
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const totalSum = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <div className="container">
      <h1>Магазин книг</h1>

      <div className="books-grid">
        {MOCK_BOOKS.map((book) => (
          <div key={book.id} data-testid="book-card" className="book-card">
            <h2>{book.title}</h2>
            <p className="author">{book.author}</p>
            <p className="price">{book.price} ₽</p>
            <button data-testid="cart-add" onClick={() => addToCart(book)}>
              Добавить в корзину
            </button>
          </div>
        ))}
      </div>

      <hr />

      <h2>Корзина</h2>

      <div
        data-testid="cart-list"
        style={{display: cart.length > 0 ? 'block' : 'none'}}
      >
        <ul className="cart-items">
          {cart.map((item) => (
            <li key={item.id} data-testid="cart-item" className="cart-item">
              <span className="item-title">{item.title}</span>
              <span className="item-calc">
                {item.price} ₽ x {item.quantity} шт.
              </span>
              <div className="cart-actions">
                <button onClick={() => increaseQuantity(item.id)}>+</button>
                <button onClick={() => removeFromCart(item.id)}>Удалить</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {cart.length === 0 && <p className="empty-msg">Корзина пока пуста</p>}

      <div data-testid="cart-total" className="cart-total">
        Общая сумма: <strong>{totalSum} ₽</strong>
      </div>
    </div>
  );
}

const rootElement = document.querySelector('[data-testid="app"]');

if (!rootElement) {
  throw new Error('Корневой элемент приложения не найден.');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
