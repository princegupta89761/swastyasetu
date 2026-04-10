import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  ShoppingCart, 
  Filter, 
  Plus, 
  Minus, 
  Star, 
  Truck, 
  ShieldCheck, 
  Clock,
  ChevronRight,
  X,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  image: string;
  discount: string;
}

const products: Product[] = [
  {
    id: '1',
    name: 'Dolo 650 Tablet',
    category: 'Pain Relief',
    price: 30,
    originalPrice: 35,
    rating: 4.8,
    reviews: 1250,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400&h=400',
    discount: '15% OFF'
  },
  {
    id: '2',
    name: 'Vicks Vaporub 50g',
    category: 'Cold & Cough',
    price: 145,
    originalPrice: 160,
    rating: 4.9,
    reviews: 3400,
    image: 'https://images.unsplash.com/photo-1631549916768-4119b295f789?auto=format&fit=crop&q=80&w=400&h=400',
    discount: '10% OFF'
  },
  {
    id: '3',
    name: 'Revital H Capsule 30s',
    category: 'Multivitamins',
    price: 280,
    originalPrice: 350,
    rating: 4.7,
    reviews: 890,
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=400&h=400',
    discount: '20% OFF'
  },
  {
    id: '4',
    name: 'Dettol Antiseptic 500ml',
    category: 'First Aid',
    price: 185,
    originalPrice: 210,
    rating: 4.9,
    reviews: 5600,
    image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&q=80&w=400&h=400',
    discount: '12% OFF'
  },
  {
    id: '5',
    name: 'Volini Gel 75g',
    category: 'Pain Relief',
    price: 220,
    originalPrice: 245,
    rating: 4.8,
    reviews: 2100,
    image: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&q=80&w=400&h=400',
    discount: '10% OFF'
  },
  {
    id: '6',
    name: 'Himalaya Ashvagandha',
    category: 'Ayurvedic',
    price: 150,
    originalPrice: 180,
    rating: 4.6,
    reviews: 1500,
    image: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&q=80&w=400&h=400',
    discount: '16% OFF'
  }
];

const categories = [
  'All', 'Pain Relief', 'Cold & Cough', 'Multivitamins', 'First Aid', 'Ayurvedic', 'Diabetes', 'Heart Care'
];

const Pharmacy = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<Record<string, number>>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });

  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => setToast({ ...toast, visible: false }), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.visible]);

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.trim().toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (id: string, name: string) => {
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    setToast({ message: `${name} added to cart`, visible: true });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[id] > 1) {
        newCart[id] -= 1;
      } else {
        delete newCart[id];
      }
      return newCart;
    });
  };

  const clearCart = () => setCart({});

  const cartItems = Object.entries(cart).map(([id, quantity]) => {
    const product = products.find(p => p.id === id);
    return { ...product, quantity };
  }).filter(item => item.id !== undefined);

  const cartCount = Object.values(cart).reduce((a, b) => (a as number) + (b as number), 0) as number;
  const cartTotal = cartItems.reduce((total: number, item) => {
    const p = item.price || 0;
    const q = item.quantity as number;
    return total + (p * q);
  }, 0);

  const handleCheckout = () => {
    if (cartCount === 0) {
      setToast({ message: 'Please add items to cart first', visible: true });
      return;
    }
    navigate('/checkout', { state: { cartItems, cartTotal } });
  };

  const handlePrescriptionUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPrescriptionFile(e.target.files[0]);
    }
  };

  const submitPrescription = () => {
    if (!prescriptionFile) return;
    setIsPrescriptionModalOpen(false);
    setPrescriptionFile(null);
    setToast({ message: 'Prescription uploaded successfully! Our pharmacist will review it.', visible: true });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-300">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Online Pharmacy</h1>
          <p className="text-slate-600 dark:text-slate-400">Get medicines delivered to your doorstep</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative flex-grow md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search medicines, health products..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value.length > 0) {
                  setSelectedCategory('All');
                }
              }}
              className="w-full pl-10 pr-10 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white dark:placeholder-slate-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group"
          >
            <ShoppingCart className="w-6 h-6 text-slate-700 dark:text-slate-300 group-hover:text-blue-600 transition-colors" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
        <button 
          onClick={() => setIsPrescriptionModalOpen(true)}
          className="flex items-center justify-between p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-blue-500 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-xl text-blue-600 dark:text-blue-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-slate-900 dark:text-white">Upload Prescription</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Order medicines with a photo</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
        </button>

        <button 
          onClick={handleCheckout}
          className="flex items-center justify-between p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-blue-500 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-xl text-green-600 dark:text-green-400">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-slate-900 dark:text-white">Quick Checkout</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{cartCount} items in your cart</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-green-600 transition-colors" />
        </button>
      </div>

      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 mb-12 text-white relative overflow-hidden shadow-lg shadow-blue-200 dark:shadow-none">
        <div className="relative z-10 max-w-lg">
          <span className="bg-blue-500/30 px-3 py-1 rounded-full text-xs font-bold mb-4 inline-block backdrop-blur-sm">
            LIMITED TIME OFFER
          </span>
          <h2 className="text-4xl font-bold mb-4 leading-tight">Flat 20% OFF on First Medicine Order</h2>
          <p className="text-blue-100 mb-6">Use code: <span className="font-mono font-bold text-white bg-white/20 px-2 py-1 rounded">SWASTHYA20</span></p>
          <button className="bg-white text-blue-700 px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition-all">
            Order Now
          </button>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 bg-white/10 skew-x-12 translate-x-1/2" />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="lg:w-64 shrink-0">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 sticky top-24 transition-colors duration-300">
            <h3 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Filter className="w-4 h-4" /> Categories
            </h3>
            <div className="space-y-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
                    selectedCategory === cat
                      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">Why choose us?</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Truck className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span className="text-xs text-slate-600 dark:text-slate-400">Express delivery in 2 hours</span>
                </div>
                <div className="flex gap-3">
                  <ShieldCheck className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
                  <span className="text-xs text-slate-600 dark:text-slate-400">100% Genuine Medicines</span>
                </div>
                <div className="flex gap-3">
                  <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span className="text-xs text-slate-600 dark:text-slate-400">24/7 Support Available</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-grow">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={product.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg transition-all group"
              >
                <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg">
                    {product.discount}
                  </div>
                </div>
                
                <div className="p-5">
                  <div className="text-xs text-blue-600 dark:text-blue-400 font-bold mb-1 uppercase tracking-wider">
                    {product.category}
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2 line-clamp-1">{product.name}</h3>
                  
                  <div className="flex items-center gap-1 mb-4">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{product.rating}</span>
                    <span className="text-xs text-slate-400 dark:text-slate-500">({product.reviews} reviews)</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-slate-900 dark:text-white">₹{product.price}</span>
                        <span className="text-sm text-slate-400 dark:text-slate-500 line-through">₹{product.originalPrice}</span>
                      </div>
                    </div>

                    {cart[product.id] ? (
                      <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl px-2 py-1 border border-blue-100 dark:border-blue-800">
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800 rounded-lg transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-bold text-blue-700 dark:text-blue-300 min-w-[20px] text-center">
                          {cart[product.id]}
                        </span>
                        <button
                          onClick={() => addToCart(product.id, product.name)}
                          className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800 rounded-lg transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(product.id, product.name)}
                        className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-100 dark:shadow-none"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <div className="bg-slate-100 dark:bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-slate-400 dark:text-slate-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No products found</h3>
              <p className="text-slate-500 dark:text-slate-400">Try adjusting your search or category filters.</p>
            </div>
          )}
        </div>
      </div>

      {/* Prescription Banner */}
      <div className="mt-16 bg-slate-900 dark:bg-slate-950 rounded-3xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 transition-colors duration-300">
        <div className="max-w-xl">
          <h2 className="text-3xl font-bold mb-4">Have a Prescription?</h2>
          <p className="text-slate-400 mb-0">Upload your prescription and we will help you find the right medicines and fulfill your order.</p>
        </div>
        <button 
          onClick={() => setIsPrescriptionModalOpen(true)}
          className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 whitespace-nowrap"
        >
          Upload Prescription <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Floating Checkout Button for Mobile/Quick Access */}
      <AnimatePresence>
        {cartCount > 0 && !isCartOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={() => setIsCartOpen(true)}
            className="fixed bottom-24 right-6 md:hidden z-50 bg-blue-600 text-white p-4 rounded-full shadow-2xl flex items-center gap-2"
          >
            <ShoppingCart className="w-6 h-6" />
            <span className="font-bold">{cartCount}</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Prescription Modal */}
      <AnimatePresence>
        {isPrescriptionModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPrescriptionModalOpen(false)}
              className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm z-[80]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-slate-900 z-[90] rounded-3xl shadow-2xl p-8 transition-colors duration-300"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Upload Prescription</h2>
                <button 
                  onClick={() => setIsPrescriptionModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors group">
                  <input
                    type="file"
                    id="prescription-upload"
                    className="hidden"
                    accept="image/*,.pdf"
                    onChange={handlePrescriptionUpload}
                  />
                  <label 
                    htmlFor="prescription-upload"
                    className="cursor-pointer flex flex-col items-center gap-4"
                  >
                    <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-full text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                      <ShieldCheck className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">
                        {prescriptionFile ? prescriptionFile.name : 'Click to upload prescription'}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Supports JPG, PNG, PDF (Max 5MB)</p>
                    </div>
                  </label>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
                  <p className="text-xs text-blue-800 dark:text-blue-400 leading-relaxed">
                    Our registered pharmacists will review your prescription and contact you within 15 minutes to confirm your order.
                  </p>
                </div>

                <button
                  onClick={submitPrescription}
                  disabled={!prescriptionFile}
                  className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-200 dark:shadow-none"
                >
                  Confirm & Upload
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-slate-900 z-[70] shadow-2xl flex flex-col transition-colors duration-300"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Your Cart</h2>
                  <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-md text-xs font-bold">
                    {cartCount} items
                  </span>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-6 space-y-6">
                {cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">{item.name}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{item.category}</p>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-blue-600 dark:text-blue-400">₹{item.price}</span>
                          <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 rounded-lg px-2 py-1">
                            <button 
                              onClick={() => removeFromCart(item.id!)}
                              className="text-slate-500 hover:text-blue-600"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold w-4 text-center dark:text-white">{item.quantity}</span>
                            <button 
                              onClick={() => addToCart(item.id!, item.name!)}
                              className="text-slate-500 hover:text-blue-600"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="bg-slate-50 dark:bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mb-4">
                      <ShoppingCart className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Your cart is empty</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">Looks like you haven't added anything yet.</p>
                    <button 
                      onClick={() => setIsCartOpen(false)}
                      className="text-blue-600 font-bold hover:underline"
                    >
                      Continue Shopping
                    </button>
                  </div>
                )}
              </div>

              {cartItems.length > 0 && (
                <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-4">
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span>Subtotal</span>
                    <span className="font-bold text-slate-900 dark:text-white">₹{cartTotal}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span>Delivery Fee</span>
                    <span className="text-green-600 font-bold uppercase text-xs">Free</span>
                  </div>
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <span className="text-lg font-bold text-slate-900 dark:text-white">Total</span>
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">₹{cartTotal}</span>
                  </div>
                  <button 
                    onClick={handleCheckout}
                    className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 dark:shadow-none mt-4"
                  >
                    Checkout Now
                  </button>
                  <button 
                    onClick={clearCart}
                    className="w-full text-slate-400 hover:text-red-500 text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" /> Clear Cart
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast.visible && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-8 left-1/2 z-[100] bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 min-w-[300px]"
          >
            <div className="bg-green-500 p-1 rounded-full">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-medium">{toast.message}</span>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="ml-auto text-blue-400 dark:text-blue-600 font-bold text-sm hover:underline"
            >
              View Cart
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Pharmacy;
