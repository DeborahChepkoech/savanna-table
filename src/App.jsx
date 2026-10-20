
import { useEffect, useState } from 'react';
import './index.css';
import { getMenu } from './services/api';

const featuredDishes = [
  {
    name: 'Nyama Choma',
    image:
      'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
  },
  {
    name: 'Grilled Chicken',
    image:
      'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=800',
  },
  {
    name: 'Fresh Garden Salad',
    image:
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
  },
];

function App() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState({
    name: '',
    phone: '',
    orderType: 'pickup',
    address: '',
    paymentMethod: 'mpesa',
  });
  const [orderMessage, setOrderMessage] = useState('');

  useEffect(() => {
    async function loadMenu() {
      try {
        const dishes = await getMenu();
        setMenu(dishes);
      } catch (err) {
        setError(
          'We could not load the menu. Please try again later.'
        );
        console.error('Menu loading error:', err);
      } finally {
        setLoading(false);
      }
    }

    loadMenu();
  }, []);

  function addToCart(dish) {
    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (item) => item.id === dish.id
      );

      if (existingItem) {
        return currentCart.map((item) =>
          item.id === dish.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...currentCart,
        {
          ...dish,
          price: Number(dish.price),
          quantity: 1,
        },
      ];
    });

    setOrderMessage('');
    setCartOpen(true);
  }

  function updateQuantity(dishId, change) {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === dishId
            ? { ...item, quantity: item.quantity + change }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cart.reduce(
    (total, item) =>
      total + Number(item.price) * item.quantity,
    0
  );

  function handleOrderChange(event) {
    const { name, value } = event.target;

    setOrderDetails((current) => ({
      ...current,
      [name]: value,
    }));

    setOrderMessage('');
  }

  function handleCheckout(event) {
    event.preventDefault();

    if (cart.length === 0) {
      setOrderMessage('Please add a dish to your cart first.');
      return;
    }

    setOrderMessage(
      'Your order details are ready. Order submission and payment will be connected to the backend in the next stage.'
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Navigation */}
      <header className="flex items-center justify-between px-6 py-5 md:px-16">
        <a
          href="#home"
          className="text-2xl font-bold tracking-tight"
        >
          Savanna<span className="text-amber-700">Table.</span>
        </a>

        <nav className="hidden gap-8 text-sm md:flex">
          <a href="#home" className="hover:text-amber-700">
            Home
          </a>
          <a href="#menu" className="hover:text-amber-700">
            Menu
          </a>
          <a href="#about" className="hover:text-amber-700">
            Our Story
          </a>
          <a
            href="#reservations"
            className="hover:text-amber-700"
          >
            Reservations
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setCartOpen(true)}
          className="rounded-full bg-amber-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-900"
        >
          Cart ({cartCount})
        </button>
      </header>

      <main>
        {/* Hero section */}
        <section
          id="home"
          className="grid items-center gap-10 px-6 py-12 md:grid-cols-2 md:px-16 md:py-20"
        >
          <div>
            <p className="mb-5 font-semibold uppercase tracking-[0.2em] text-amber-800">
              A taste of home
            </p>

            <h1 className="max-w-xl text-5xl font-bold leading-tight md:text-7xl">
              Good food.
              <br />
              Good people.
              <br />
              <span className="text-amber-800">
                Great memories.
              </span>
            </h1>

            <p className="mt-6 max-w-lg leading-7 text-stone-600">
              Discover the warmth of Kenyan hospitality, from
              freshly grilled favourites to meals made for sharing.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#menu"
                className="rounded-full bg-amber-800 px-7 py-4 font-semibold text-white hover:bg-amber-900"
              >
                Explore Our Menu
              </a>

              <a
                href="#reservations"
                className="rounded-full border border-stone-300 px-7 py-4 font-semibold hover:bg-stone-100"
              >
                Book a Table
              </a>
            </div>
          </div>

          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200"
            alt="Warm and welcoming restaurant interior"
            className="h-[350px] w-full rounded-3xl object-cover md:h-[520px]"
          />
        </section>

        {/* Menu section */}
        <section id="menu" className="px-6 py-16 md:px-16">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 font-semibold uppercase tracking-widest text-amber-800">
                Made with love
              </p>

              <h2 className="text-3xl font-bold md:text-4xl">
                Customer favourites
              </h2>
            </div>

            <p className="text-stone-600">
              A little taste of Savanna Table.
            </p>
          </div>

          {loading && (
            <p className="py-8 text-stone-600">
              Loading our delicious menu...
            </p>
          )}

          {error && (
            <div
              role="alert"
              className="rounded-xl bg-red-50 p-4 text-red-700"
            >
              {error}
            </div>
          )}

          {!loading && !error && menu.length === 0 && (
            <p className="py-8 text-stone-600">
              No dishes are available right now.
            </p>
          )}

          {!loading && !error && menu.length > 0 && (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {menu.map((dish) => {
                const featuredDish = featuredDishes.find(
                  (item) => item.name === dish.name
                );

                const image =
                  dish.image_url ||
                  featuredDish?.image ||
                  'https://images.unsplash.com/photo-1547592180-85f173990554?w=800';

                return (
                  <article
                    key={dish.id}
                    className="overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md"
                  >
                    <img
                      src={image}
                      alt={dish.name}
                      loading="lazy"
                      className="h-60 w-full object-cover"
                    />

                    <div className="p-6">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-amber-800">
                        {dish.category}
                      </p>

                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-xl font-bold">
                          {dish.name}
                        </h3>

                        <span className="shrink-0 font-bold text-amber-800">
                          KSh{' '}
                          {Number(dish.price).toLocaleString('en-KE')}
                        </span>
                      </div>

                      <p className="mt-3 text-sm leading-6 text-stone-600">
                        {dish.description}
                      </p>

                      <button
                        type="button"
                        onClick={() => addToCart(dish)}
                        className="mt-5 rounded-full bg-amber-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-900"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Shopping cart */}
        <section
          id="cart"
          className="bg-amber-50 px-6 py-16 md:px-16"
        >
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 flex items-center justify-between gap-4">
              <div>
                <p className="mb-2 font-semibold uppercase tracking-widest text-amber-800">
                  Your selection
                </p>
                <h2 className="text-3xl font-bold md:text-4xl">
                  Your Cart
                </h2>
              </div>

              <span className="rounded-full bg-white px-4 py-2 font-semibold text-amber-900 shadow-sm">
                {cartCount} {cartCount === 1 ? 'item' : 'items'}
              </span>
            </div>

            {cart.length === 0 ? (
              <p className="rounded-2xl bg-white p-6 text-stone-600">
                Your cart is empty. Add something delicious from our menu!
              </p>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <article
                    key={item.id}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-5 shadow-sm"
                  >
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold">{item.name}</h3>
                      <p className="mt-1 text-sm text-stone-600">
                        KSh {Number(item.price).toLocaleString('en-KE')} each
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, -1)}
                        aria-label={`Remove one ${item.name}`}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-300 font-bold hover:bg-stone-100"
                      >
                        −
                      </button>

                      <span className="min-w-5 text-center font-semibold">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, 1)}
                        aria-label={`Add one ${item.name}`}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-300 font-bold hover:bg-stone-100"
                      >
                        +
                      </button>
                    </div>

                    <p className="w-full text-right font-bold text-amber-800 sm:w-28">
                      KSh{' '}
                      {(Number(item.price) * item.quantity).toLocaleString('en-KE')}
                    </p>
                  </article>
                ))}

                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-amber-200 pt-6">
                  <div>
                    <p className="text-sm text-stone-600">Subtotal</p>
                    <p className="text-2xl font-bold text-amber-900">
                      KSh {cartTotal.toLocaleString('en-KE')}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setCartOpen(false);
                      document.getElementById('checkout')?.scrollIntoView({
                        behavior: 'smooth',
                      });
                    }}
                    className="rounded-full bg-amber-800 px-7 py-4 font-semibold text-white hover:bg-amber-900"
                  >
                    Continue to Checkout
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Checkout */}
        <section
          id="checkout"
          className="px-6 py-16 md:px-16"
        >
          <div className="mx-auto max-w-3xl">
            <p className="mb-2 font-semibold uppercase tracking-widest text-amber-800">
              Almost there
            </p>

            <h2 className="text-3xl font-bold md:text-4xl">
              Complete Your Order
            </h2>

            <p className="mt-3 text-stone-600">
              Enter your details to prepare your order.
            </p>

            <form
              onSubmit={handleCheckout}
              className="mt-8 space-y-6 rounded-2xl bg-white p-6 shadow-sm md:p-8"
            >
              <div>
                <label htmlFor="customer-name" className="mb-2 block text-sm font-semibold">
                  Full name
                </label>
                <input
                  id="customer-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={orderDetails.name}
                  onChange={handleOrderChange}
                  className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-amber-700"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label htmlFor="customer-phone" className="mb-2 block text-sm font-semibold">
                  Phone number
                </label>
                <input
                  id="customer-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  value={orderDetails.phone}
                  onChange={handleOrderChange}
                  className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-amber-700"
                  placeholder="e.g. 0712345678"
                />
              </div>

              <div>
                <label htmlFor="order-type" className="mb-2 block text-sm font-semibold">
                  Order type
                </label>
                <select
                  id="order-type"
                  name="orderType"
                  value={orderDetails.orderType}
                  onChange={handleOrderChange}
                  className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 outline-none focus:border-amber-700"
                >
                  <option value="pickup">Pickup</option>
                  <option value="delivery">Delivery</option>
                </select>
              </div>

              {orderDetails.orderType === 'delivery' && (
                <div>
                  <label htmlFor="delivery-address" className="mb-2 block text-sm font-semibold">
                    Delivery address
                  </label>
                  <textarea
                    id="delivery-address"
                    name="address"
                    required
                    value={orderDetails.address}
                    onChange={handleOrderChange}
                    className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-amber-700"
                    placeholder="Enter your delivery location"
                    rows={3}
                  />
                </div>
              )}

              <div>
                <label htmlFor="payment-method" className="mb-2 block text-sm font-semibold">
                  Preferred payment method
                </label>
                <select
                  id="payment-method"
                  name="paymentMethod"
                  value={orderDetails.paymentMethod}
                  onChange={handleOrderChange}
                  className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 outline-none focus:border-amber-700"
                >
                  <option value="mpesa">M-Pesa</option>
                  <option value="cash">Cash on pickup/delivery</option>
                </select>
              </div>

              <div className="rounded-xl bg-amber-50 p-5">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-stone-600">
                    Items ({cartCount})
                  </span>
                  <span className="font-semibold">
                    KSh {cartTotal.toLocaleString('en-KE')}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between gap-4 border-t border-amber-200 pt-3">
                  <span className="font-bold">Order subtotal</span>
                  <span className="text-xl font-bold text-amber-900">
                    KSh {cartTotal.toLocaleString('en-KE')}
                  </span>
                </div>
              </div>

              {orderMessage && (
                <p
                  role="status"
                  className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900"
                >
                  {orderMessage}
                </p>
              )}

              <button
                type="submit"
                className="w-full rounded-full bg-amber-800 px-7 py-4 font-semibold text-white transition hover:bg-amber-900"
              >
                Prepare Order
              </button>

              <p className="text-xs leading-5 text-stone-500">
                This is a frontend checkout preview. No order is submitted
                and no payment is collected until backend integration is added.
              </p>
            </form>
          </div>
        </section>

        {/* Our story */}
        <section
          id="about"
          className="bg-stone-900 px-6 py-16 text-white md:px-16"
        >
          <p className="mb-3 uppercase tracking-widest text-amber-400">
            Our story
          </p>

          <h2 className="max-w-2xl text-3xl font-bold md:text-4xl">
            A place where every meal feels like home.
          </h2>

          <p className="mt-5 max-w-2xl leading-7 text-stone-300">
            Savanna Table celebrates Kenyan flavours, thoughtful
            cooking and the joy of gathering around a table.
          </p>
        </section>

        {/* Reservations */}
        <section
          id="reservations"
          className="px-6 py-16 text-center md:px-16"
        >
          <h2 className="text-3xl font-bold">
            Save a seat at our table
          </h2>

          <p className="mt-4 text-stone-600">
            Planning lunch, dinner or a special celebration?
          </p>

          <p className="mt-2 text-sm text-stone-500">
            Our online reservation form is coming in the next stage.
          </p>
        </section>
      </main>

      {/* Slide-out cart */}
      {cartOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40"
          onClick={() => setCartOpen(false)}
        >
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            className="ml-auto flex h-full w-full max-w-md flex-col bg-white shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b p-6">
              <div>
                <h2 className="text-2xl font-bold">Your Cart</h2>
                <p className="mt-1 text-sm text-stone-500">
                  {cartCount} {cartCount === 1 ? 'item' : 'items'} selected
                </p>
              </div>

              <button
                type="button"
                onClick={() => setCartOpen(false)}
                aria-label="Close cart"
                className="rounded-full px-3 py-2 text-2xl hover:bg-stone-100"
              >
                ×
              </button>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="py-16 text-center">
                  <p className="text-lg font-semibold">
                    Your cart is empty
                  </p>
                  <p className="mt-2 text-sm text-stone-500">
                    Add some delicious dishes from our menu.
                  </p>
                  <button
                    type="button"
                    onClick={() => setCartOpen(false)}
                    className="mt-5 rounded-full bg-amber-800 px-5 py-3 text-white hover:bg-amber-900"
                  >
                    Explore Menu
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <article
                    key={item.id}
                    className="flex items-center justify-between gap-4 border-b border-stone-100 pb-5"
                  >
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="mt-1 text-sm text-stone-500">
                        KSh {Number(item.price).toLocaleString('en-KE')} each
                      </p>

                      <div className="mt-3 flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          aria-label={`Decrease ${item.name} quantity`}
                          className="h-8 w-8 rounded-full border hover:bg-stone-100"
                        >
                          −
                        </button>

                        <span className="min-w-4 text-center">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          aria-label={`Increase ${item.name} quantity`}
                          className="h-8 w-8 rounded-full border hover:bg-stone-100"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <p className="whitespace-nowrap font-semibold">
                      KSh{' '}
                      {(Number(item.price) * item.quantity).toLocaleString('en-KE')}
                    </p>
                  </article>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t bg-stone-50 p-6">
                <div className="flex items-center justify-between">
                  <span className="text-stone-600">Subtotal</span>
                  <span className="text-xl font-bold">
                    KSh {cartTotal.toLocaleString('en-KE')}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setCartOpen(false);
                    document.getElementById('checkout')?.scrollIntoView({
                      behavior: 'smooth',
                    });
                  }}
                  className="mt-5 w-full rounded-full bg-amber-800 py-3 font-semibold text-white transition hover:bg-amber-900"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </aside>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-stone-900 px-6 py-8 text-center text-sm text-stone-300">
        © {new Date().getFullYear()} Savanna Table.
        Made with love in Kenya.
      </footer>
    </div>
  );
}

export default App;
