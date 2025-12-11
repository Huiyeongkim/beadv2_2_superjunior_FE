<template>
  <main class="products-page">
    <section class="page-hero">
      <div class="container">
        <div>
          <p class="eyebrow">공동구매 마켓</p>
          <h1>지금 인기 있는 상품을 만나보세요</h1>
          <p class="subtitle">
            카테고리, 할인율, 마감 임박 순으로 필터링하고 바로 장바구니에 담을 수 있어요.
          </p>
        </div>
        <div class="stats">
          <div class="stat">
            <strong>{{ sampleProducts.length }}</strong>
            <span>등록된 상품</span>
          </div>
          <div class="stat">
            <strong>₩{{ totalSavings.toLocaleString() }}</strong>
            <span>예상 절약액</span>
          </div>
          <div class="stat">
            <strong>{{ participantsCount.toLocaleString() }}명</strong>
            <span>참여 중</span>
          </div>
        </div>
      </div>
    </section>

    <section class="filters">
      <div class="container">
        <div class="filter-row">
          <div class="chips">
            <button
              v-for="section in sections"
              :key="section.id"
              type="button"
              class="chip"
              :class="{ active: selectedSection === section.id }"
              @click="setSection(section.id)"
            >
              {{ section.label }}
            </button>
          </div>
          <div class="search">
            <input
              v-model.trim="keyword"
              type="search"
              placeholder="상품명을 입력하세요"
              @keyup.enter="search"
            />
            <button class="btn btn-outline" @click="search">검색</button>
          </div>
        </div>

        <div class="filter-row secondary">
          <div class="categories">
            <button
              v-for="category in categories"
              :key="category.id"
              type="button"
              class="category-btn"
              :class="{ active: selectedCategory === category.id }"
              @click="filterByCategory(category.id)"
            >
              <span class="icon">{{ category.icon }}</span>
              <span>{{ category.name }}</span>
            </button>
          </div>
          <div class="sort">
            <label>
              정렬
              <select v-model="sortBy">
                <option value="popular">인기순</option>
                <option value="discount">할인율 높은순</option>
                <option value="priceLow">가격 낮은순</option>
                <option value="priceHigh">가격 높은순</option>
                <option value="deadline">마감 임박순</option>
              </select>
            </label>
          </div>
        </div>
      </div>
    </section>

    <section class="product-grid-section">
      <div class="container">
        <div v-if="filteredProducts.length === 0" class="empty-state">
          <p>조건에 맞는 상품이 없습니다. 다른 필터를 시도해 주세요.</p>
          <button class="btn btn-primary" @click="resetFilters">필터 초기화</button>
        </div>
        <div v-else class="product-grid">
          <article
            v-for="product in filteredProducts"
            :key="product.id"
            class="product-card"
          >
            <div class="image-wrapper">
              <img :src="product.image" :alt="product.title" loading="lazy" />
              <div class="badge-group">
                <span v-for="badge in product.badges" :key="badge" class="badge">
                  {{ badge }}
                </span>
              </div>
              <button
                type="button"
                class="bookmark"
                :class="{ active: wishlist.has(product.id) }"
                @click="toggleWishlist(product.id)"
              >
                {{ wishlist.has(product.id) ? '★' : '☆' }}
              </button>
            </div>
            <div class="card-body">
              <p class="category">{{ product.category }}</p>
              <h2>{{ product.title }}</h2>
              <p class="subtitle">{{ product.subtitle }}</p>
              <div class="price-row">
                <div>
                  <p class="current-price">₩{{ product.currentPrice.toLocaleString() }}</p>
                  <p class="meta">
                    <span class="discount">{{ product.discountRate }}% OFF</span>
                    <span class="original">₩{{ product.originalPrice.toLocaleString() }}</span>
                  </p>
                </div>
                <button class="btn btn-outline" @click="goToDetail(product.id)">
                  상세보기
                </button>
              </div>
              <div class="progress">
                <div class="progress-head">
                  <span>{{ product.currentCount }}명 참여</span>
                  <span>목표 {{ product.targetCount }}명</span>
                </div>
                <div class="progress-bar">
                  <div
                    class="progress-fill"
                    :style="{ width: `${Math.min(product.currentCount / product.targetCount * 100, 100)}%` }"
                  ></div>
                </div>
              </div>
              <div class="card-footer">
                <span class="time">⏰ {{ product.timeLeft }}</span>
                <button class="btn btn-primary" @click="addToCart(product)">
                  장바구니 담기
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import { sampleProducts } from '@/data/products'

export default {
  name: 'ProductsList',
  data() {
    return {
      sampleProducts: [],
      keyword: '',
      selectedSection: 'popular',
      selectedCategory: null,
      sortBy: 'popular',
      wishlist: new Set(),
      categories: [
        { id: 1, name: '전체', icon: '✨' },
        { id: 2, name: '전자제품', icon: '📱' },
        { id: 3, name: '패션', icon: '👟' },
        { id: 4, name: '식품', icon: '🍎' },
        { id: 5, name: '뷰티', icon: '💄' }
      ],
      sections: [
        { id: 'popular', label: '인기' },
        { id: 'new', label: '신규' },
        { id: 'ending', label: '마감 임박' },
        { id: 'discount', label: '할인율 높은 순' }
      ]
    }
  },
  mounted() {
    this.loadProducts()
  },
  computed: {
    participantsCount() {
      return this.sampleProducts.reduce((sum, product) => sum + product.currentCount, 0)
    },
    totalSavings() {
      return this.sampleProducts.reduce(
        (sum, product) => sum + (product.originalPrice - product.currentPrice) * product.currentCount,
        0
      )
    },
    filteredProducts() {
      let result = [...this.sampleProducts]

      if (this.keyword) {
        const keyword = this.keyword.toLowerCase()
        result = result.filter(
          (product) =>
            product.title.toLowerCase().includes(keyword) ||
            product.subtitle.toLowerCase().includes(keyword)
        )
      }

      if (this.selectedCategory && this.selectedCategory !== 1) {
        const category = this.categories.find((item) => item.id === this.selectedCategory)?.name
        result = result.filter((product) => product.category === category)
      }

      if (this.selectedSection === 'new') {
        result = result.slice(-4)
      } else if (this.selectedSection === 'ending') {
        result = result.filter((product) => product.timeLeft.includes('시간'))
      } else if (this.selectedSection === 'discount') {
        result = result.sort((a, b) => b.discountRate - a.discountRate)
      }

      switch (this.sortBy) {
        case 'discount':
          result.sort((a, b) => b.discountRate - a.discountRate)
          break
        case 'priceLow':
          result.sort((a, b) => a.currentPrice - b.currentPrice)
          break
        case 'priceHigh':
          result.sort((a, b) => b.currentPrice - a.currentPrice)
          break
        case 'deadline':
          result.sort((a, b) => {
            const aTime = a.timeLeft.includes('시간') ? 0 : 1
            const bTime = b.timeLeft.includes('시간') ? 0 : 1
            return aTime - bTime
          })
          break
        default:
          result.sort((a, b) => b.currentCount / b.targetCount - a.currentCount / a.targetCount)
      }
      return result
    }
  },
  watch: {
    '$route.query.section': {
      immediate: true,
      handler(section) {
        if (section && this.sections.some((item) => item.id === section)) {
          this.selectedSection = section
        }
      }
    }
  },
  methods: {
    loadProducts() {
      // 기본 샘플 상품과 등록된 상품 합치기
      const registeredProducts = JSON.parse(localStorage.getItem('all_products') || '[]')
      this.sampleProducts = [...sampleProducts, ...registeredProducts]
    },
    setSection(section) {
      this.selectedSection = section
      this.$router.replace({ query: { ...this.$route.query, section } })
    },
    filterByCategory(categoryId) {
      this.selectedCategory = this.selectedCategory === categoryId ? null : categoryId
    },
    search() {
      // 메서드 존재로 입력값과 동기화만 수행
    },
    resetFilters() {
      this.keyword = ''
      this.selectedCategory = null
      this.selectedSection = 'popular'
      this.sortBy = 'popular'
    },
    toggleWishlist(productId) {
      if (this.wishlist.has(productId)) {
        this.wishlist.delete(productId)
      } else {
        this.wishlist.add(productId)
      }
      this.wishlist = new Set(this.wishlist)
    },
    goToDetail(productId) {
      this.$router.push({ name: 'product-detail', params: { id: productId } })
    },
    addToCart(product) {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      cart.push({ productId: product.id, quantity: 1 })
      localStorage.setItem('cart', JSON.stringify(cart))
      this.$router.push({ name: 'cart' })
    }
  }
}
</script>

<style scoped>
.products-page {
  background: #0a0a0a;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.page-hero {
  padding: 48px 0 32px;
}

.page-hero .eyebrow {
  color: #ffffff;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.page-hero h1 {
  font-size: 36px;
  margin-bottom: 12px;
  color: #ffffff;
}

.page-hero .subtitle {
  color: #999;
}

.stats {
  display: flex;
  gap: 32px;
  margin-top: 24px;
}

.stat {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  padding: 16px 20px;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  flex: 1;
}

.stat strong {
  display: block;
  font-size: 20px;
  color: #ffffff;
}

.stat span {
  color: #999;
  font-size: 14px;
}

.filters {
  background: #0a0a0a;
  border-top: 1px solid #2a2a2a;
  border-bottom: 1px solid #2a2a2a;
  padding: 24px 0;
}

.filter-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}

.filter-row.secondary {
  margin-top: 16px;
}

.chips {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.chip {
  padding: 10px 18px;
  border-radius: 999px;
  border: 1px solid #2a2a2a;
  background: #1a1a1a;
  color: #ffffff;
  cursor: pointer;
  font-weight: 600;
}

.chip.active {
  border-color: #ffffff;
  color: #0a0a0a;
  background: #ffffff;
}

.search {
  display: flex;
  gap: 8px;
}

.search input {
  padding: 10px 14px;
  background: #0f0f0f;
  border: 1px solid #2a2a2a;
  border-radius: 8px;
  min-width: 260px;
  color: #ffffff;
}

.search input::placeholder {
  color: #666;
}

.search input:focus {
  outline: none;
  border-color: #ffffff;
  background: #151515;
}

.categories {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  flex: 1;
}

.category-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 10px 14px;
  border-radius: 999px;
  border: 1px solid #2a2a2a;
  background: #1a1a1a;
  color: #ffffff;
  cursor: pointer;
}

.category-btn.active {
  border-color: #ffffff;
  color: #ffffff;
}

.sort {
  color: #ffffff;
}

.sort select {
  margin-left: 8px;
  padding: 10px 14px;
  background: #0f0f0f;
  border: 1px solid #2a2a2a;
  border-radius: 8px;
  color: #ffffff;
  cursor: pointer;
}

.sort select:focus {
  outline: none;
  border-color: #ffffff;
}

.product-grid-section {
  padding: 40px 0 80px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.product-card {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
}

.image-wrapper {
  position: relative;
  padding-top: 72%;
}

.image-wrapper img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.badge-group {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  gap: 6px;
}

.badge {
  background: rgba(0, 0, 0, 0.65);
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
}

.bookmark {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  font-size: 18px;
  cursor: pointer;
}

.bookmark.active {
  color: #f59f00;
}

.card-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card-body h2 {
  font-size: 20px;
  margin: 0;
  color: #ffffff;
}

.card-body .subtitle {
  color: #999;
  font-size: 14px;
}

.category {
  color: #ffffff;
  font-weight: 600;
  font-size: 13px;
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.current-price {
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
}

.meta {
  font-size: 13px;
  color: #999;
}

.discount {
  color: #ffffff;
  font-weight: 600;
  margin-right: 8px;
}

.original {
  text-decoration: line-through;
  color: #666;
}

.progress-head {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #ffffff;
}

.progress-bar {
  height: 8px;
  background: #0f0f0f;
  border-radius: 999px;
  overflow: hidden;
  margin-top: 8px;
}

.progress-fill {
  height: 100%;
  background: #ffffff;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.time {
  font-size: 13px;
  color: #999;
}

.btn {
  border: none;
  border-radius: 10px;
  padding: 10px 16px;
  cursor: pointer;
  font-weight: 600;
}

.btn-primary {
  background: #ffffff;
  color: #0a0a0a;
}

.btn-primary:hover {
  background: #f0f0f0;
}

.btn-outline {
  border: 1px solid #3a3a3a;
  background: transparent;
  color: #ffffff;
}

.btn-outline:hover {
  background: #2a2a2a;
  border-color: #4a4a4a;
}

.empty-state {
  text-align: center;
  padding: 80px 0;
  color: #ffffff;
}

.empty-state p {
  color: #999;
  margin-bottom: 16px;
}

@media (max-width: 768px) {
  .stats {
    flex-direction: column;
  }

  .search {
    width: 100%;
  }

  .search input {
    flex: 1;
    min-width: auto;
  }

  .price-row {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>


