<template>
  <div v-if="isOpen" class="floating-cart">
    <div class="cart-header">
      <h3>장바구니</h3>
      <button class="btn-close" @click="closeCart">×</button>
    </div>
    <div class="cart-body">
      <div v-if="items.length === 0" class="empty-cart">
        <p>장바구니가 비어있습니다</p>
        <router-link to="/products" class="btn btn-outline" @click="closeCart">상품 둘러보기</router-link>
      </div>
      <div v-else class="cart-items">
        <div v-for="item in items" :key="item.productId" class="cart-item">
          <img :src="item.product.image" :alt="item.product.title" />
          <div class="item-info">
            <h4>{{ item.product.title }}</h4>
            <p class="item-price">₩{{ (item.product.currentPrice * item.quantity).toLocaleString() }}</p>
            <div class="quantity-control">
              <button @click.stop="changeQuantity(item.productId, -1)">-</button>
              <span>{{ item.quantity }}</span>
              <button @click.stop="changeQuantity(item.productId, 1)">+</button>
            </div>
          </div>
          <button class="btn-delete" @click.stop="removeItem(item.productId)">×</button>
        </div>
      </div>
    </div>
    <div v-if="items.length > 0" class="cart-footer">
      <div class="cart-summary">
        <span>총 {{ totalQuantity }}개</span>
        <strong>₩{{ totalPrice.toLocaleString() }}</strong>
      </div>
      <router-link to="/cart" class="btn btn-primary" @click="closeCart">장바구니 보기</router-link>
    </div>
  </div>
  <button v-else class="floating-cart-button" @click="openCart">
    <span class="cart-icon">🛒</span>
    <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
  </button>
</template>

<script>
import { getProductById } from '@/data/products'

export default {
  name: 'FloatingCart',
  data() {
    return {
      isOpen: false,
      items: []
    }
  },
  computed: {
    cartCount() {
      return this.items.reduce((sum, item) => sum + item.quantity, 0)
    },
    totalQuantity() {
      return this.items.reduce((sum, item) => sum + item.quantity, 0)
    },
    totalPrice() {
      return this.items.reduce((sum, item) => sum + item.product.currentPrice * item.quantity, 0)
    }
  },
  mounted() {
    this.loadCartItems()
    // localStorage 변경 감지
    window.addEventListener('storage', this.handleStorageChange)
    // 주기적으로 장바구니 업데이트
    this.cartUpdateInterval = setInterval(() => {
      this.loadCartItems()
    }, 1000)
  },
  beforeUnmount() {
    window.removeEventListener('storage', this.handleStorageChange)
    if (this.cartUpdateInterval) {
      clearInterval(this.cartUpdateInterval)
    }
  },
  methods: {
    loadCartItems() {
      const stored = JSON.parse(localStorage.getItem('cart') || '[]')
      this.items = stored
        .map((item) => {
          const product = getProductById(item.productId)
          if (!product) return null
          return {
            ...item,
            product
          }
        })
        .filter(Boolean)
    },
    openCart() {
      this.isOpen = true
      this.loadCartItems()
    },
    closeCart() {
      this.isOpen = false
    },
    changeQuantity(productId, delta) {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      const updatedCart = cart.map(item => {
        if (item.productId === productId) {
          const quantity = Math.max(1, (item.quantity || 1) + delta)
          return { ...item, quantity }
        }
        return item
      })
      localStorage.setItem('cart', JSON.stringify(updatedCart))
      this.loadCartItems()
    },
    removeItem(productId) {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      const updatedCart = cart.filter(item => item.productId !== productId)
      localStorage.setItem('cart', JSON.stringify(updatedCart))
      this.loadCartItems()
    },
    handleStorageChange(e) {
      if (e.key === 'cart') {
        this.loadCartItems()
      }
    }
  }
}
</script>

<style scoped>
.floating-cart {
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: 380px;
  max-height: 600px;
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  z-index: 1000;
  overflow: hidden;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #2a2a2a;
}

.cart-header h3 {
  margin: 0;
  color: #ffffff;
  font-size: 18px;
  font-weight: 700;
}

.btn-close {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: #999;
  font-size: 24px;
  cursor: pointer;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-close:hover {
  background: #2a2a2a;
  color: #ffffff;
}

.cart-body {
  flex: 1;
  overflow-y: auto;
  max-height: 400px;
  padding: 16px;
}

.empty-cart {
  text-align: center;
  padding: 40px 20px;
}

.empty-cart p {
  color: #999;
  margin-bottom: 16px;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cart-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: #0f0f0f;
  border: 1px solid #2a2a2a;
  border-radius: 12px;
  position: relative;
}

.cart-item img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-info h4 {
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-price {
  color: #ffffff;
  font-size: 15px;
  font-weight: 700;
  margin: 4px 0;
}

.quantity-control {
  display: inline-flex;
  align-items: center;
  border: 1px solid #2a2a2a;
  border-radius: 6px;
  overflow: hidden;
  background: #0f0f0f;
  margin-top: 4px;
}

.quantity-control button {
  width: 24px;
  height: 24px;
  border: none;
  background: #1a1a1a;
  color: #ffffff;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quantity-control button:hover {
  background: #2a2a2a;
}

.quantity-control span {
  padding: 0 8px;
  color: #ffffff;
  font-size: 13px;
  min-width: 30px;
  text-align: center;
}

.btn-delete {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: #999;
  font-size: 20px;
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-delete:hover {
  background: #2a2a2a;
  color: #ff6b6b;
}

.cart-footer {
  padding: 16px 20px;
  border-top: 1px solid #2a2a2a;
  background: #0f0f0f;
}

.cart-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  color: #999;
  font-size: 14px;
}

.cart-summary strong {
  color: #ffffff;
  font-size: 20px;
  font-weight: 700;
}

.floating-cart-button {
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #ffffff;
  border: none;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  transition: all 0.3s;
}

.floating-cart-button:hover {
  transform: scale(1.1);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
}

.cart-icon {
  font-size: 28px;
}

.cart-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: #ff4757;
  color: white;
  font-size: 12px;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 12px;
  min-width: 20px;
  text-align: center;
}

.btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  display: inline-block;
  text-align: center;
}

.btn-outline {
  background: transparent;
  border: 1px solid #3a3a3a;
  color: #ffffff;
}

.btn-outline:hover {
  background: #2a2a2a;
  border-color: #4a4a4a;
}

.btn-primary {
  background: #ffffff;
  color: #0a0a0a;
}

.btn-primary:hover {
  background: #f0f0f0;
}

@media (max-width: 480px) {
  .floating-cart {
    width: calc(100% - 40px);
    right: 20px;
    left: 20px;
    max-height: 70vh;
  }
}
</style>






