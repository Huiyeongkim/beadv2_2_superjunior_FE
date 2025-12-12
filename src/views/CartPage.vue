<template>
  <main class="cart-page">
    <div class="container">
      <header class="cart-header">
        <div>
          <p class="eyebrow">장바구니</p>
          <h1>담아둔 공동구매 상품</h1>
          <p class="subtitle">
            공동구매는 참여 인원이 채워져야 확정됩니다. 결제 전까지 수량과 옵션을 자유롭게 수정하세요.
          </p>
        </div>
        <div class="summary-box">
          <p>총 {{ totalQuantity }}개</p>
          <strong>₩{{ totalPrice.toLocaleString() }}</strong>
        </div>
      </header>

      <section class="cart-content">
        <article class="cart-items">
          <div v-if="items.length === 0" class="empty-state">
            <p>장바구니가 비어 있어요.</p>
            <router-link class="btn btn-primary" to="/products">상품 둘러보기</router-link>
          </div>
          <div
            v-for="item in items"
            :key="item.productId"
            class="cart-item"
          >
            <img :src="item.product.image" :alt="item.product.title" />
            <div class="item-body">
              <div class="item-head">
                <p class="category">{{ item.product.category }}</p>
                <h2>{{ item.product.title }}</h2>
                <p class="option">{{ item.option }}</p>
              </div>
              <div class="item-meta">
                <p class="price">₩{{ (item.product.currentPrice * item.quantity).toLocaleString() }}</p>
                <p class="quantity-label">수량</p>
                <div class="quantity-control">
                  <button @click="changeQuantity(item.productId, -1)">-</button>
                  <span>{{ item.quantity }}</span>
                  <button @click="changeQuantity(item.productId, 1)">+</button>
                </div>
              </div>
              <div class="item-footer">
                <span>목표 {{ item.product.targetCount }}명 중 {{ item.product.currentCount }}명 참여</span>
                <button class="link-btn" @click="removeItem(item.productId)">삭제</button>
              </div>
            </div>
          </div>
        </article>

        <aside class="checkout">
          <div class="checkout-card">
            <h3>결제 요약</h3>
            <div class="row">
              <span>상품 금액</span>
              <strong>₩{{ totalPrice.toLocaleString() }}</strong>
            </div>
            <div class="row">
              <span>할인 금액</span>
              <strong class="discount">-₩{{ totalDiscount.toLocaleString() }}</strong>
            </div>
            <div class="row">
              <span>배송비</span>
              <strong>무료</strong>
            </div>
            <hr />
            <div class="row total">
              <span>총 결제 예정 금액</span>
              <strong>₩{{ finalPrice.toLocaleString() }}</strong>
            </div>
            <button class="btn btn-primary" :disabled="items.length === 0">결제하기</button>
            <p class="notice">공동구매 미달성 시 결제금액은 자동 환불됩니다.</p>
          </div>
        </aside>
      </section>
    </div>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import { cartItemsMock, getProductById } from '@/data/products'

const items = ref(loadCartItems())

function loadCartItems() {
  const stored = JSON.parse(localStorage.getItem('cart') || 'null')
  const source = stored && stored.length > 0 ? stored : cartItemsMock
  return source
    .map((item) => {
      const product = getProductById(item.productId)
      if (!product) return null
      return {
        ...item,
        option: item.option || '기본 옵션',
        product
      }
    })
    .filter(Boolean)
}

const totalPrice = computed(() => {
  return items.value.reduce(
    (sum, item) => sum + item.product.currentPrice * item.quantity,
    0
  )
})

const totalDiscount = computed(() => {
  return items.value.reduce(
    (sum, item) =>
      sum + (item.product.originalPrice - item.product.currentPrice) * item.quantity,
    0
  )
})

const finalPrice = computed(() => {
  return totalPrice.value
})

const totalQuantity = computed(() => {
  return items.value.reduce((sum, item) => sum + item.quantity, 0)
})

const changeQuantity = (productId, delta) => {
  items.value = items.value
    .map((item) => {
      if (item.productId !== productId) return item
      const quantity = Math.max(1, item.quantity + delta)
      return { ...item, quantity }
    })
  localStorage.setItem(
    'cart',
    JSON.stringify(items.value.map(({ productId: id, quantity }) => ({ productId: id, quantity })))
  )
}

const removeItem = (productId) => {
  items.value = items.value.filter((item) => item.productId !== productId)
  localStorage.setItem(
    'cart',
    JSON.stringify(items.value.map(({ productId: id, quantity }) => ({ productId: id, quantity })))
  )
}
</script>

<style scoped>
.cart-page {
  background: #0a0a0a;
  min-height: 100vh;
  padding: 32px 0 60px;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 32px;
  align-items: flex-start;
}

.eyebrow {
  text-transform: uppercase;
  color: #ffffff;
  font-weight: 700;
  letter-spacing: 0.05em;
  margin-bottom: 8px;
}

.cart-header h1 {
  color: #ffffff;
}

.subtitle {
  color: #999;
}

.summary-box {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 16px;
  padding: 16px 20px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
  text-align: right;
}

.summary-box p {
  margin: 0;
  color: #999;
}

.summary-box strong {
  font-size: 24px;
  color: #ffffff;
}

.cart-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cart-item {
  display: flex;
  gap: 16px;
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
}

.cart-item img {
  width: 160px;
  height: 160px;
  object-fit: cover;
  border-radius: 12px;
}

.item-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.category {
  color: #ffffff;
  font-weight: 600;
}

.item-body h2 {
  color: #ffffff;
}

.option {
  color: #999;
}

.item-meta {
  display: flex;
  align-items: center;
  gap: 16px;
}

.item-meta .quantity-label {
  color: #999;
}

.price {
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
}

.quantity-control {
  display: inline-flex;
  align-items: center;
  border: 1px solid #2a2a2a;
  border-radius: 999px;
  overflow: hidden;
  background: #0f0f0f;
}

.quantity-control button {
  width: 36px;
  height: 36px;
  border: none;
  background: #1a1a1a;
  color: #ffffff;
  cursor: pointer;
}

.quantity-control button:hover {
  background: #2a2a2a;
}

.quantity-control span {
  padding: 0 16px;
  color: #ffffff;
}

.item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #999;
}

.link-btn {
  background: none;
  border: none;
  color: #ff6b6b;
  cursor: pointer;
  font-weight: 600;
}

.checkout-card {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.checkout-card h3 {
  margin-bottom: 16px;
  color: #ffffff;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 12px 0;
  color: #e0e0e0;
}

.row span {
  color: #999;
}

.row strong {
  color: #ffffff;
}

.row.total strong {
  font-size: 22px;
  color: #ffffff;
}

.discount {
  color: #ffffff;
}

.checkout-card hr {
  border: none;
  border-top: 1px solid #2a2a2a;
  margin: 16px 0;
}

.btn {
  width: 100%;
  border: none;
  border-radius: 12px;
  padding: 14px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 16px;
}

.btn-primary {
  background: #ffffff;
  color: #0a0a0a;
}

.btn-primary:hover:not(:disabled) {
  background: #f0f0f0;
}

.btn-primary:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.notice {
  font-size: 13px;
  color: #999;
  margin-top: 12px;
}

.empty-state {
  text-align: center;
  padding: 60px 0;
  color: #ffffff;
}

.empty-state p {
  color: #999;
  margin-bottom: 16px;
}

@media (max-width: 960px) {
  .cart-content {
    grid-template-columns: 1fr;
  }

  .cart-header {
    flex-direction: column;
  }
}

@media (max-width: 640px) {
  .cart-item {
    flex-direction: column;
  }

  .cart-item img {
    width: 100%;
    height: 220px;
  }

  .item-meta {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>

