import React, { useState, useEffect } from 'react';
import { ShoppingBag, Plus, LogIn, LogOut, User, X, Tag, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';

export default function ShoeStore() {
  const [products, setProducts] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [filter, setFilter] = useState('all');
  const [credentials, setCredentials] = useState({ user: '', pass: '' });
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    category: 'mujer',
    images: [],
    isOffer: false,
    oldPrice: ''
  });
  const [currentImageIndex, setCurrentImageIndex] = useState({});

  // Cargar productos al iniciar
  useEffect(() => {
    const stored = localStorage.getItem('shoeProducts');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Convertir productos antiguos con 'image' a 'images'
        const updated = parsed.map(p => ({
          ...p,
          images: p.images || (p.image ? [p.image] : ['https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400'])
        }));
        setProducts(updated);
        localStorage.setItem('shoeProducts', JSON.stringify(updated));
      } catch (e) {
        console.error('Error loading products:', e);
        loadInitialProducts();
      }
    } else {
      loadInitialProducts();
    }
  }, []);

  const loadInitialProducts = () => {
    const initial = [
      {
        id: 1,
        name: 'Elegance Heel',
        price: 350000,
        oldPrice: 520000,
        description: 'Tacones elegantes perfectos para ocasiones especiales',
        category: 'mujer',
        images: ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400'],
        isOffer: true
      },
      {
        id: 2,
        name: 'Urban Sneaker',
        price: 290000,
        description: 'Zapatillas urbanas con estilo contemporáneo',
        category: 'hombre',
        images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400'],
        isOffer: false
      },
      {
        id: 3,
        name: 'Classic Boot',
        price: 480000,
        description: 'Botas clásicas de cuero premium',
        category: 'hombre',
        images: ['https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=400'],
        isOffer: false
      }
    ];
    setProducts(initial);
    localStorage.setItem('shoeProducts', JSON.stringify(initial));
  };

  const handleLogin = () => {
    if (credentials.user === 'MSUV' && credentials.pass === 'MSUV123@*') {
      setIsAdmin(true);
      setShowLogin(false);
      setCredentials({ user: '', pass: '' });
    } else {
      alert('Credenciales incorrectas');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const readers = files.map(file => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });
      
      Promise.all(readers).then(images => {
        setNewProduct({ ...newProduct, images: [...newProduct.images, ...images] });
      });
    }
  };

  const removeImage = (index) => {
    const updated = newProduct.images.filter((_, i) => i !== index);
    setNewProduct({ ...newProduct, images: updated });
  };

  const nextImage = (productId) => {
    const product = products.find(p => p.id === productId);
    if (product && product.images.length > 1) {
      setCurrentImageIndex({
        ...currentImageIndex,
        [productId]: ((currentImageIndex[productId] || 0) + 1) % product.images.length
      });
    }
  };

  const prevImage = (productId) => {
    const product = products.find(p => p.id === productId);
    if (product && product.images.length > 1) {
      setCurrentImageIndex({
        ...currentImageIndex,
        [productId]: ((currentImageIndex[productId] || 0) - 1 + product.images.length) % product.images.length
      });
    }
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.description || newProduct.images.length === 0) {
      alert('Por favor completa todos los campos requeridos y agrega al menos una imagen');
      return;
    }
    const product = {
      ...newProduct,
      id: Date.now(),
      price: parseFloat(newProduct.price),
      oldPrice: newProduct.oldPrice ? parseFloat(newProduct.oldPrice) : null
    };
    const updated = [...products, product];
    setProducts(updated);
    localStorage.setItem('shoeProducts', JSON.stringify(updated));
    setNewProduct({
      name: '',
      price: '',
      description: '',
      category: 'mujer',
      images: [],
      isOffer: false,
      oldPrice: ''
    });
    setShowAddProduct(false);
  };

  const handleDeleteProduct = (id) => {
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    localStorage.setItem('shoeProducts', JSON.stringify(updated));
  };

  const filteredProducts = products.filter(p => 
    filter === 'all' ? true : 
    filter === 'offers' ? p.isOffer : 
    p.category === filter
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-8 h-8 text-gray-800" />
            <h1 className="text-2xl font-bold text-gray-800">Elegance Steps</h1>
          </div>
          <div className="flex gap-3">
            {isAdmin ? (
              <>
                <button
                  onClick={() => setShowAddProduct(true)}
                  className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
                >
                  <Plus className="w-5 h-5" />
                  Agregar
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  <LogOut className="w-5 h-5" />
                  Salir
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
              >
                <User className="w-5 h-5" />
                Admin
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-3 justify-center">
          {['all', 'mujer', 'hombre', 'offers'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2 rounded-full font-medium transition ${
                filter === f
                  ? 'bg-gray-800 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-200'
              }`}
            >
              {f === 'all' ? 'Todos' : f === 'offers' ? 'Ofertas' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => {
            const productImages = product.images || (product.image ? [product.image] : []);
            const currentIdx = currentImageIndex[product.id] || 0;
            const displayImage = productImages[currentIdx] || productImages[0] || 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400';
            
            return (
            <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="relative">
                <img
                  src={displayImage}
                  alt={product.name}
                  className="w-full h-64 object-cover"
                />
                {productImages.length > 1 && (
                  <>
                    <button
                      onClick={() => prevImage(product.id)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => nextImage(product.id)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                      {productImages.map((_, idx) => (
                        <div
                          key={idx}
                          className={`w-2 h-2 rounded-full ${
                            idx === currentIdx
                              ? 'bg-white'
                              : 'bg-white bg-opacity-50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
                {product.isOffer && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full flex items-center gap-1 font-bold">
                    <Tag className="w-4 h-4" />
                    Oferta
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-gray-800 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {product.category === 'mujer' ? 'Mujer' : 'Hombre'}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                <div className="flex items-center gap-2 mb-4">
                  {product.isOffer && product.oldPrice && (
                    <span className="text-gray-400 line-through text-lg">
                      ${Math.round(product.oldPrice).toLocaleString('es-CO')} COP
                    </span>
                  )}
                  <span className="text-2xl font-bold text-gray-800">
                    ${Math.round(product.price).toLocaleString('es-CO')} COP
                  </span>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    Eliminar
                  </button>
                )}
              </div>
            </div>
          )})}
        </div>
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No hay productos en esta categoría</p>
          </div>
        )}
      </div>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Inicio de Sesión</h2>
              <button onClick={() => setShowLogin(false)}>
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            <div>
              <input
                type="text"
                placeholder="Usuario"
                value={credentials.user}
                onChange={(e) => setCredentials({ ...credentials, user: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-gray-800"
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={credentials.pass}
                onChange={(e) => setCredentials({ ...credentials, pass: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-gray-800"
              />
              <button
                onClick={handleLogin}
                className="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-700 transition"
              >
                <LogIn className="w-5 h-5 inline mr-2" />
                Iniciar Sesión
              </button>
              <p className="text-sm text-gray-500 mt-3 text-center">
                
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl p-6 max-w-md w-full my-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Agregar Producto</h2>
              <button onClick={() => setShowAddProduct(false)}>
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            <div>
              <input
                type="text"
                placeholder="Nombre del producto"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-gray-800"
              />
              <input
                type="number"
                step="0.01"
                placeholder="Precio"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-gray-800"
              />
              <textarea
                placeholder="Descripción"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-gray-800 h-20"
              />
              <select
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-gray-800"
              >
                <option value="mujer">Mujer</option>
                <option value="hombre">Hombre</option>
              </select>
              <div className="mb-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newProduct.isOffer}
                    onChange={(e) => setNewProduct({ ...newProduct, isOffer: e.target.checked })}
                    className="w-5 h-5"
                  />
                  <span className="text-gray-700">Marcar como oferta</span>
                </label>
              </div>
              {newProduct.isOffer && (
                <input
                  type="number"
                  step="0.01"
                  placeholder="Precio anterior (opcional)"
                  value={newProduct.oldPrice}
                  onChange={(e) => setNewProduct({ ...newProduct, oldPrice: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-gray-800"
                />
              )}
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-gray-800"
              />
              <p className="text-sm text-gray-500 mb-3">Puedes subir múltiples imágenes</p>
              {newProduct.images.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {newProduct.images.map((img, idx) => (
                    <div key={idx} className="relative">
                      <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-24 object-cover rounded-lg" />
                      <button
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <button
                onClick={handleAddProduct}
                className="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-700 transition"
              >
                Agregar Producto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}