<template>
  <main class="register-page">
    <div class="container">
      <div class="page-header">
        <h1>상품 등록</h1>
        <p>새로운 공동구매 상품을 등록하세요</p>
      </div>

      <form @submit.prevent="handleSubmit" class="register-form">
        <div class="form-section">
          <h3>기본 정보</h3>
          <div class="form-group">
            <label for="title">상품명 *</label>
            <input
              id="title"
              v-model="form.title"
              type="text"
              placeholder="상품명을 입력하세요"
              required
            />
          </div>
          <div class="form-group">
            <label for="subtitle">부제목</label>
            <input
              id="subtitle"
              v-model="form.subtitle"
              type="text"
              placeholder="상품에 대한 간단한 설명"
            />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="category">카테고리 *</label>
              <select id="category" v-model="form.category" required>
                <option value="">카테고리를 선택하세요</option>
                <option value="전자제품">전자제품</option>
                <option value="패션">패션</option>
                <option value="식품">식품</option>
                <option value="뷰티">뷰티</option>
                <option value="홈/리빙">홈/리빙</option>
                <option value="기타">기타</option>
              </select>
            </div>
            <div class="form-group">
              <label for="targetCount">목표 참여 인원 *</label>
              <input
                id="targetCount"
                v-model.number="form.targetCount"
                type="number"
                placeholder="예: 50"
                required
                min="1"
              />
            </div>
          </div>
        </div>

        <div class="form-section">
          <h3>가격 정보</h3>
          <div class="form-row">
            <div class="form-group">
              <label for="originalPrice">정가 *</label>
              <input
                id="originalPrice"
                v-model.number="form.originalPrice"
                type="number"
                placeholder="원래 가격"
                required
                min="0"
              />
            </div>
            <div class="form-group">
              <label for="currentPrice">공동구매 가격 *</label>
              <input
                id="currentPrice"
                v-model.number="form.currentPrice"
                type="number"
                placeholder="할인된 가격"
                required
                min="0"
              />
            </div>
          </div>
          <div v-if="form.originalPrice && form.currentPrice" class="discount-info">
            <span>할인율: {{ discountRate }}%</span>
          </div>
        </div>

        <div class="form-section">
          <h3>상품 이미지</h3>
          <div class="form-group">
            <label>대표 이미지 *</label>
            <input
              type="url"
              v-model="form.mainImage"
              placeholder="이미지 URL을 입력하세요"
              required
            />
            <div v-if="form.mainImage" class="image-preview">
              <img :src="form.mainImage" alt="대표 이미지 미리보기" />
            </div>
          </div>
          <div class="form-group">
            <label>추가 이미지 (최대 5개)</label>
            <div v-for="(img, index) in form.additionalImages" :key="index" class="image-input-row">
              <input
                type="url"
                v-model="form.additionalImages[index]"
                placeholder="추가 이미지 URL"
              />
              <button
                v-if="form.additionalImages.length > 1"
                type="button"
                class="btn-remove"
                @click="removeImage(index)"
              >
                삭제
              </button>
            </div>
            <button
              v-if="form.additionalImages.length < 5"
              type="button"
              class="btn-add-image"
              @click="addImageField"
            >
              + 이미지 추가
            </button>
          </div>
        </div>

        <div class="form-section">
          <h3>상품 설명</h3>
          <div class="form-group">
            <label for="description">상품 설명 *</label>
            <textarea
              id="description"
              v-model="form.description"
              rows="5"
              placeholder="상품에 대한 상세한 설명을 작성해주세요"
              required
            ></textarea>
          </div>
          <div class="form-group">
            <label for="detailedDescription">상세 설명 (HTML 지원)</label>
            <textarea
              id="detailedDescription"
              v-model="form.detailedDescription"
              rows="8"
              placeholder="HTML 태그를 사용하여 더 자세한 설명을 작성할 수 있습니다"
            ></textarea>
          </div>
        </div>

        <div class="form-section">
          <h3>상품 옵션</h3>
          <div class="form-group">
            <label>스펙/옵션 (줄바꿈으로 구분)</label>
            <textarea
              v-model="specsText"
              rows="4"
              placeholder="예:&#10;스토리지 256GB&#10;색상: 네이비 티타늄&#10;정품 등록 보장"
            ></textarea>
            <p class="form-hint">각 항목은 줄바꿈으로 구분됩니다</p>
          </div>
        </div>

        <div class="form-section">
          <h3>배송 정보</h3>
          <div class="form-group">
            <label for="shipping">배송 안내 *</label>
            <input
              id="shipping"
              v-model="form.shipping"
              type="text"
              placeholder="예: 무료배송 / 전국 당일 발송"
              required
            />
          </div>
          <div class="form-group">
            <label for="timeLeft">마감 시간 *</label>
            <input
              id="timeLeft"
              v-model="form.timeLeft"
              type="text"
              placeholder="예: 3일 남음"
              required
            />
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-outline" @click="handleCancel">취소</button>
          <button type="submit" class="btn btn-primary" :disabled="loading || !isFormValid">
            {{ loading ? '등록 중...' : '상품 등록하기' }}
          </button>
        </div>
      </form>
    </div>
  </main>
</template>

<script>
export default {
  name: 'ProductRegister',
  data() {
    return {
      form: {
        title: '',
        subtitle: '',
        category: '',
        originalPrice: null,
        currentPrice: null,
        mainImage: '',
        additionalImages: [''],
        description: '',
        detailedDescription: '',
        specs: [],
        shipping: '',
        timeLeft: '',
        targetCount: null
      },
      specsText: '',
      loading: false
    }
  },
  computed: {
    discountRate() {
      if (!this.form.originalPrice || !this.form.currentPrice) return 0
      return Math.round(((this.form.originalPrice - this.form.currentPrice) / this.form.originalPrice) * 100)
    },
    isFormValid() {
      return (
        this.form.title &&
        this.form.category &&
        this.form.originalPrice &&
        this.form.currentPrice &&
        this.form.mainImage &&
        this.form.description &&
        this.form.shipping &&
        this.form.timeLeft &&
        this.form.targetCount
      )
    }
  },
  mounted() {
    // 판매자 권한 체크
    //const role = localStorage.getItem('user_role')
    // if (role !== 'seller') {
    //   alert('판매자만 상품을 등록할 수 있습니다.')
    //   this.$router.push('/seller/application')
    // }
  },
  methods: {
    addImageField() {
      if (this.form.additionalImages.length < 5) {
        this.form.additionalImages.push('')
      }
    },
    removeImage(index) {
      this.form.additionalImages.splice(index, 1)
    },
    handleCancel() {
      if (confirm('작성 중인 내용이 사라집니다. 정말 취소하시겠습니까?')) {
        this.$router.push('/seller')
      }
    },
    async handleSubmit() {
      if (!this.isFormValid) {
        alert('모든 필수 항목을 입력해주세요.')
        return
      }

      // 스펙 텍스트를 배열로 변환
      this.form.specs = this.specsText
        .split('\n')
        .map(s => s.trim())
        .filter(s => s.length > 0)

      // 추가 이미지 필터링
      const images = [
        this.form.mainImage,
        ...this.form.additionalImages.filter(img => img.trim().length > 0)
      ]

      this.loading = true
      try {
        // TODO: 실제 API 호출로 교체
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // 판매자 정보 가져오기
        const sellerProfile = JSON.parse(localStorage.getItem('seller_profile') || '{}')
        const sellerName = sellerProfile.name || '테크샵'
        
        const productData = {
          ...this.form,
          images,
          image: this.form.mainImage, // 대표 이미지
          id: Date.now(), // 임시 ID
          seller: sellerName,
          currentCount: 0,
          rating: 0,
          reviewCount: 0,
          badges: ['신규'],
          discountRate: this.discountRate,
          createdAt: new Date().toISOString()
        }
        
        // 목업: 상품 데이터 저장 (판매자용)
        const existingProducts = JSON.parse(localStorage.getItem('seller_products') || '[]')
        existingProducts.push(productData)
        localStorage.setItem('seller_products', JSON.stringify(existingProducts))
        
        // 전체 상품 목록에도 추가 (일반 사용자도 볼 수 있도록)
        const allProducts = JSON.parse(localStorage.getItem('all_products') || '[]')
        allProducts.push(productData)
        localStorage.setItem('all_products', JSON.stringify(allProducts))
        
        alert('공동구매 상품이 성공적으로 등록되었습니다!')
        this.$router.push('/seller/products')
      } catch (error) {
        alert('상품 등록에 실패했습니다. 다시 시도해주세요.')
        console.error('Product registration error:', error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.register-page {
  background: #0a0a0a;
  min-height: 100vh;
  padding: 32px 0 60px;
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 20px;
}

.page-header {
  margin-bottom: 32px;
}

.page-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 8px;
}

.page-header p {
  color: #999;
  font-size: 15px;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.form-section {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-section h3 {
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 8px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  color: #e0e0e0;
  font-size: 14px;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 14px 16px;
  background: #0f0f0f;
  border: 2px solid #2a2a2a;
  border-radius: 12px;
  font-size: 15px;
  color: #ffffff;
  transition: border-color 0.2s;
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: #666;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #ffffff;
  background: #151515;
}

.form-group select {
  cursor: pointer;
}

.discount-info {
  padding: 12px;
  background: #0f0f0f;
  border-radius: 8px;
  color: #ffffff;
  font-weight: 600;
}

.image-preview {
  margin-top: 12px;
  border-radius: 12px;
  overflow: hidden;
  max-width: 300px;
}

.image-preview img {
  width: 100%;
  height: auto;
  display: block;
}

.image-input-row {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.image-input-row input {
  flex: 1;
}

.btn-remove {
  padding: 14px 20px;
  background: transparent;
  border: 1px solid #3a3a3a;
  border-radius: 12px;
  color: #ff6b6b;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}

.btn-remove:hover {
  background: #2a2a2a;
  border-color: #ff6b6b;
}

.btn-add-image {
  padding: 12px 20px;
  background: transparent;
  border: 2px dashed #3a3a3a;
  border-radius: 12px;
  color: #ffffff;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-add-image:hover {
  border-color: #ffffff;
  background: #1a1a1a;
}

.form-hint {
  font-size: 12px;
  color: #666;
  margin-top: -4px;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn {
  padding: 14px 32px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
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

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 255, 255, 0.2);
  background: #f0f0f0;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>




