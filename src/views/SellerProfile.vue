<template>
  <main class="seller-profile-page">
    <div class="container">
      <section class="seller-hero">
        <div class="hero-content">
          <div class="seller-info">
            <h1>{{ seller.name }}</h1>
            <p class="description">{{ seller.description }}</p>
            <div class="badges">
              <span v-for="badge in seller.badges" :key="badge" class="badge">{{ badge }}</span>
            </div>
          </div>
          <div class="hero-stats">
            <div class="stat">
              <strong>{{ seller.rating }}</strong>
              <span>평점</span>
            </div>
            <div class="stat">
              <strong>{{ seller.followers.toLocaleString() }}</strong>
              <span>팔로워</span>
            </div>
            <div class="stat">
              <strong>{{ seller.totalSales.toLocaleString() }}</strong>
              <span>누적 판매</span>
            </div>
            <div class="stat">
              <strong>{{ seller.responseRate * 100 }}%</strong>
              <span>응답률</span>
            </div>
          </div>
        </div>
      </section>

      <section class="seller-products-section">
        <h2>판매 상품</h2>
        <div v-if="sellerProducts.length === 0" class="empty-state">
          <p>등록된 상품이 없습니다.</p>
        </div>
        <div v-else class="products-grid">
          <div
            v-for="product in sellerProducts"
            :key="product.id"
            class="product-card"
            @click="goToProduct(product.id)"
          >
            <div class="product-image-wrapper">
              <img :src="product.image || product.images?.[0]" :alt="product.title" />
            </div>
            <div class="product-info">
              <p class="product-category">{{ product.category }}</p>
              <h3 class="product-title">{{ product.title }}</h3>
              <p class="product-subtitle">{{ product.subtitle }}</p>
              <div class="product-price-info">
                <span class="current-price">₩{{ product.currentPrice?.toLocaleString() || product.price?.toLocaleString() }}</span>
                <span v-if="product.originalPrice" class="original-price">₩{{ product.originalPrice.toLocaleString() }}</span>
              </div>
              <div class="product-progress">
                <div class="progress-info">
                  <span class="progress-text">
                    {{ product.currentCount || 0 }} / {{ product.targetCount }}명 참여
                  </span>
                  <span class="progress-percent">
                    {{ Math.round(((product.currentCount || 0) / product.targetCount) * 100) }}%
                  </span>
                </div>
                <div class="progress-bar">
                  <div
                    class="progress-fill"
                    :style="{ width: `${Math.min(((product.currentCount || 0) / product.targetCount) * 100, 100)}%` }"
                  ></div>
                </div>
              </div>
              <div class="product-meta">
                <span class="rating">⭐ {{ product.rating || 0 }}</span>
                <span class="reviews">리뷰 {{ product.reviewCount || 0 }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="seller-notices-section">
        <h2>공지 사항</h2>
        <ul class="notice-list">
          <li v-for="notice in notices" :key="notice.id" class="notice-item">
            <span class="notice-tag">{{ notice.type }}</span>
            <span class="notice-title">{{ notice.title }}</span>
            <span class="notice-date">{{ notice.date }}</span>
          </li>
        </ul>
      </section>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { sellerProfile, getSellerProducts } from '@/data/products'

// const props = defineProps({
//   sellerId: {
//     type: String,
//     default: null
//   }
// })

const router = useRouter()
const seller = ref({ ...sellerProfile })
const sellerProducts = ref([])

const loadSellerInfo = () => {
  // localStorage에서 저장된 판매자 정보 가져오기
  const savedSeller = JSON.parse(localStorage.getItem('seller_profile') || 'null')
  if (savedSeller) {
    seller.value = {
      ...seller.value,
      ...savedSeller,
      // 통계 정보는 기본값 유지
      rating: seller.value.rating,
      followers: seller.value.followers,
      totalSales: seller.value.totalSales,
      responseRate: seller.value.responseRate
    }
  }
}

const loadProducts = () => {
  // 판매자 이름으로 상품 가져오기
  const sellerName = seller.value.name
  const sampleProducts = getSellerProducts(sellerName)
  
  // localStorage에서 등록한 상품도 가져오기
  const registeredProducts = JSON.parse(localStorage.getItem('seller_products') || '[]')
  
  // 두 목록 합치기 (중복 제거)
  const allProducts = [...sampleProducts, ...registeredProducts]
  const uniqueProducts = allProducts.filter((product, index, self) =>
    index === self.findIndex(p => p.id === product.id)
  )
  
  sellerProducts.value = uniqueProducts.slice(0, 12) // 최대 12개만 표시
}

const goToProduct = (id) => {
  router.push({ name: 'product-detail', params: { id } })
}

onMounted(() => {
  loadSellerInfo()
  loadProducts()
})
</script>

<style scoped>
.seller-profile-page {
  background: #0a0a0a;
  min-height: 100vh;
  padding: 32px 0 60px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.seller-hero {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 28px;
  padding: 32px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
  margin-bottom: 32px;
}

.hero-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.seller-info h1 {
  font-size: 32px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 12px 0;
}

.description {
  color: #e0e0e0;
  font-size: 16px;
  line-height: 1.6;
  margin: 0 0 16px 0;
}

.badges {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.badge {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 999px;
  padding: 8px 14px;
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
}

.hero-stats {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.stat {
  flex: 1;
  min-width: 120px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  padding: 16px;
  text-align: center;
}

.stat strong {
  display: block;
  font-size: 26px;
  color: #ffffff;
  font-weight: 700;
}

.stat span {
  display: block;
  font-size: 14px;
  color: #a0a0a0;
  margin-top: 4px;
}

.seller-products-section,
.seller-notices-section {
  margin-bottom: 32px;
}

.seller-products-section h2,
.seller-notices-section h2 {
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 20px;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #a0a0a0;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.product-card {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
}

.product-card:hover {
  border-color: #4a4a4a;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  transform: translateY(-2px);
}

.product-image-wrapper {
  width: 100%;
  height: 200px;
  background: #0f0f0f;
  overflow: hidden;
}

.product-image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.product-category {
  font-size: 12px;
  color: #ffffff;
  font-weight: 600;
  margin: 0;
}

.product-title {
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  line-height: 1.4;
}

.product-subtitle {
  font-size: 13px;
  color: #a0a0a0;
  margin: 0;
  line-height: 1.4;
}

.product-price-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.current-price {
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
}

.original-price {
  font-size: 13px;
  color: #666;
  text-decoration: line-through;
}

.product-progress {
  margin-top: 8px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.progress-text {
  font-size: 12px;
  color: #e0e0e0;
}

.progress-percent {
  font-size: 12px;
  color: #ffffff;
  font-weight: 600;
}

.progress-bar {
  height: 6px;
  background: #0f0f0f;
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #ffffff;
  border-radius: inherit;
  transition: width 0.3s;
}

.product-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #a0a0a0;
}

.rating {
  color: #ffffff;
}

.notice-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.notice-item {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 14px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.notice-tag {
  background: #2a2a2a;
  color: #ffffff;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.notice-title {
  flex: 1;
  color: #ffffff;
  font-weight: 500;
}

.notice-date {
  color: #999;
  font-size: 13px;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: 1fr;
  }

  .hero-stats {
    flex-direction: column;
  }
}
</style>

