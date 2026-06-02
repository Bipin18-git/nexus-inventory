import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:9090';

// --- SVGs for a Premium Look (No install needed) ---
const Icons = {
  Box: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
  Users: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  Cart: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
  Alert: () => <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
  Check: () => <svg className="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
};

function App() {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const prodRes = await axios.get(`${API_URL}/products/`);
      const custRes = await axios.get(`${API_URL}/customers/`);
      setProducts(prodRes.data);
      setCustomers(custRes.data);
    } catch (err) {
      console.error("Error fetching data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Calculate Dashboard Stats
  const totalStockValue = products.reduce((acc, curr) => acc + (curr.price * curr.stock_quantity), 0);
  const lowStockCount = products.filter(p => p.stock_quantity < 10).length;

  const inputClass = "block w-full rounded-md border-0 py-2.5 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all";
  const labelClass = "block text-sm font-medium leading-6 text-gray-900 mb-1";
  const btnClass = "flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all disabled:opacity-50";

  // --- CUSTOMER COMPONENT ---
  const CustomersView = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await axios.post(`${API_URL}/customers/`, { name, email });
        fetchData();
        setName(''); setEmail('');
      } catch (err) {
        alert('❌ ' + (err.response?.data?.detail || 'Error'));
      }
    };

    return (
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
        <div className="px-4 py-6 sm:p-8">
          <h3 className="text-base font-semibold leading-7 text-gray-900">Add New Customer</h3>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Ensure email addresses are unique per user.</p>
          <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6 border-b border-gray-900/10 pb-8">
            <div className="sm:col-span-3">
              <label className={labelClass}>Full Name</label>
              <input value={name} required onChange={e => setName(e.target.value)} className={inputClass} placeholder="Jane Doe" />
            </div>
            <div className="sm:col-span-3">
              <label className={labelClass}>Email Address</label>
              <input value={email} type="email" required onChange={e => setEmail(e.target.value)} className={inputClass} placeholder="jane@company.com" />
            </div>
            <div className="sm:col-span-6 flex justify-end">
              <button type="submit" className={btnClass}>Save Customer</button>
            </div>
          </form>
          
          <div className="mt-8 flow-root">
            <table className="min-w-full divide-y divide-gray-300">
              <thead><tr><th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">ID</th><th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Name</th><th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">#{c.id}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{c.name}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{c.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // --- PRODUCT COMPONENT ---
  const ProductsView = () => {
    const [sku, setSku] = useState('');
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await axios.post(`${API_URL}/products/`, { sku, name, price: parseFloat(price), stock_quantity: parseInt(stock) });
        fetchData();
        setSku(''); setName(''); setPrice(''); setStock('');
      } catch (err) {
        alert('❌ ' + (err.response?.data?.detail || 'Error'));
      }
    };

    return (
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
        <div className="px-4 py-6 sm:p-8">
          <h3 className="text-base font-semibold leading-7 text-gray-900">Inventory Registry</h3>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Add new products to the warehouse. SKU must be unique.</p>
          <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-4 border-b border-gray-900/10 pb-8">
            <div>
              <label className={labelClass}>SKU</label>
              <input value={sku} required onChange={e => setSku(e.target.value)} className={inputClass} placeholder="PRD-001" />
            </div>
            <div>
              <label className={labelClass}>Name</label>
              <input value={name} required onChange={e => setName(e.target.value)} className={inputClass} placeholder="Wireless Mouse" />
            </div>
            <div>
              <label className={labelClass}>Price ($)</label>
              <input value={price} type="number" step="0.01" required onChange={e => setPrice(e.target.value)} className={inputClass} placeholder="29.99" />
            </div>
            <div>
              <label className={labelClass}>Stock Qty</label>
              <input value={stock} type="number" required onChange={e => setStock(e.target.value)} className={inputClass} placeholder="100" />
            </div>
            <div className="sm:col-span-4 flex justify-end">
              <button type="submit" className={btnClass}>Add to Inventory</button>
            </div>
          </form>

          <div className="mt-8 flow-root">
            <table className="min-w-full divide-y divide-gray-300">
              <thead><tr><th className="py-3.5 pl-4 text-left text-sm font-semibold text-gray-900">SKU</th><th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Product</th><th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Price</th><th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap py-4 pl-4 text-sm font-medium text-indigo-600">{p.sku}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{p.name}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${p.price.toFixed(2)}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${p.stock_quantity > 10 ? 'bg-green-50 text-green-700 ring-green-600/20' : 'bg-red-50 text-red-700 ring-red-600/10'}`}>
                        {p.stock_quantity > 10 ? 'In Stock' : 'Low Stock'} ({p.stock_quantity})
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // --- ORDER COMPONENT ---
  const OrdersView = () => {
    const [customerId, setCustomerId] = useState('');
    const [productId, setProductId] = useState('');
    const [quantity, setQuantity] = useState('');

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const res = await axios.post(`${API_URL}/orders/`, { customer_id: parseInt(customerId), product_id: parseInt(productId), quantity: parseInt(quantity) });
        alert(`✅ ${res.data.message}. Stock left: ${res.data.remaining_stock}`);
        fetchData();
        setQuantity('');
      } catch (err) {
        alert('❌ ' + (err.response?.data?.detail || 'Error'));
      }
    };

    return (
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl max-w-2xl mx-auto">
        <div className="px-4 py-6 sm:p-8">
          <h3 className="text-base font-semibold leading-7 text-gray-900 flex items-center gap-2">
            <Icons.Cart /> Create Order Transaction
          </h3>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500 mb-6">Process a new order. Inventory rules will automatically validate stock levels.</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={labelClass}>Select Customer</label>
              <select required value={customerId} onChange={e => setCustomerId(e.target.value)} className={inputClass}>
                <option value="" disabled>-- Select a Customer --</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.email})</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Select Product</label>
              <select required value={productId} onChange={e => setProductId(e.target.value)} className={inputClass}>
                <option value="" disabled>-- Select a Product --</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name} - Available: {p.stock_quantity}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Quantity</label>
              <input value={quantity} type="number" required min="1" onChange={e => setQuantity(e.target.value)} className={inputClass} placeholder="Enter amount" />
            </div>
            <button type="submit" className={`${btnClass} w-full py-3 mt-4`}>
              <Icons.Check /> Process Order
            </button>
          </form>
        </div>
      </div>
    );
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-pulse text-indigo-600 font-bold">Loading System...</div></div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Top Navbar */}
      <nav className="bg-indigo-600 shadow-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg text-white"><Icons.Box /></div>
              <span className="text-white font-bold text-xl tracking-wide">Nexus<span className="font-light">Inventory</span></span>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Dashboard Stat Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
          <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 border border-gray-100">
            <dt className="truncate text-sm font-medium text-gray-500 flex items-center gap-2"><Icons.Box /> Total Products</dt>
            <dd className="mt-2 text-3xl font-bold tracking-tight text-gray-900">{products.length}</dd>
          </div>
          <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 border border-gray-100">
            <dt className="truncate text-sm font-medium text-gray-500 flex items-center gap-2"><Icons.Users /> Total Customers</dt>
            <dd className="mt-2 text-3xl font-bold tracking-tight text-gray-900">{customers.length}</dd>
          </div>
          <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 border border-gray-100 relative">
            <dt className="truncate text-sm font-medium text-gray-500 flex items-center gap-2"><Icons.Alert /> Low Stock Alerts</dt>
            <dd className={`mt-2 text-3xl font-bold tracking-tight ${lowStockCount > 0 ? 'text-red-600' : 'text-green-600'}`}>{lowStockCount}</dd>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {[
              { id: 'products', name: 'Products & Inventory', icon: Icons.Box },
              { id: 'customers', name: 'Customer Directory', icon: Icons.Users },
              { id: 'orders', name: 'Process Orders', icon: Icons.Cart },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium transition-colors
                  ${activeTab === tab.id 
                    ? 'border-indigo-500 text-indigo-600' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }
                `}
              >
                <span className={`mr-2 ${activeTab === tab.id ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'}`}>
                  <tab.icon />
                </span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Render Active Component */}
        <div className="transition-all duration-300">
          {activeTab === 'products' && <ProductsView />}
          {activeTab === 'customers' && <CustomersView />}
          {activeTab === 'orders' && <OrdersView />}
        </div>

      </main>
    </div>
  );
}

export default App;