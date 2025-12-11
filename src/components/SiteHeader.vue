<template>
  <header class="site-header">
    <div class="container">
      <div class="brand" @click="$router.push('/')">
        <span class="brand-icon">🛒</span>
        <span class="brand-text">0982 공구팔이</span>
      </div>
      <nav class="nav">
        <router-link class="nav-link" to="/">홈</router-link>
        <router-link class="nav-link" to="/products">상품</router-link>
        <router-link class="nav-link" to="/community">커뮤니티</router-link>
      </nav>
      <div class="actions">
        <button class="icon-btn cart-btn" @click="goToCart">
          <span class="icon">🛒</span>
          <span v-if="cartCount > 0" class="badge">{{ cartCount }}</span>
        </button>
        <button class="icon-btn" @click="goToNotifications">
          <span class="icon">🔔</span>
          <span v-if="notificationCount > 0" class="badge">{{ notificationCount }}</span>
        </button>
        <router-link v-if="!isLoggedIn" class="btn btn-outline" to="/login">로그인</router-link>
        <router-link v-if="!isLoggedIn" class="btn btn-primary" to="/register">회원가입</router-link>
        <div v-if="isLoggedIn" class="user-menu">
          <button class="btn btn-outline" @click="goToMyPage">마이페이지</button>
          <button class="btn btn-primary" @click="goToSellerPage">판매자 페이지</button>
          <button class="btn btn-outline" @click="handleLogout">로그아웃</button>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'SiteHeader',
  data() {
    return {
      isLoggedIn: false, // 추후 인증 상태로 변경
      cartCount: 0,
      notificationCount: 0
    }
  },
  mounted() {
    // 추후 실제 데이터로 교체
    this.checkAuthStatus()
    this.loadCartCount()
    this.loadNotificationCount()
    
    // 로그인 상태 변경 감지 (다른 탭에서의 변경)
    window.addEventListener('storage', this.handleStorageChange)
    
    // 같은 탭에서의 변경 감지를 위한 주기적 체크
    this.authCheckInterval = setInterval(() => {
      const token = localStorage.getItem('access_token')
      if (!!token !== this.isLoggedIn) {
        this.checkAuthStatus()
      }
    }, 1000)
  },
  beforeUnmount() {
    window.removeEventListener('storage', this.handleStorageChange)
    if (this.authCheckInterval) {
      clearInterval(this.authCheckInterval)
    }
  },
  methods: {
    checkAuthStatus() {
      const token = localStorage.getItem('access_token')
      this.isLoggedIn = !!token
      // 로그인 상태가 변경되면 컴포넌트 업데이트
      this.$forceUpdate()
    },
    loadCartCount() {
      // 추후 API 호출로 교체
      this.cartCount = 3
    },
    loadNotificationCount() {
      // 추후 API 호출로 교체
      this.notificationCount = 2
    },
    goToCart() {
      this.$router.push('/cart')
    },
    goToNotifications() {
      this.$router.push('/me/notifications')
    },
    goToMyPage() {
      this.$router.push('/me/profile')
    },
    goToSellerPage() {
      this.$router.push('/seller')
    },
    handleStorageChange(e) {
      if (e.key === 'access_token') {
        this.checkAuthStatus()
      }
    },
    handleLogout() {
      if (confirm('로그아웃 하시겠습니까?')) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('user_role')
        localStorage.removeItem('user_email')
        localStorage.removeItem('user_data')
        localStorage.removeItem('user_profile')
        this.isLoggedIn = false
        this.$router.push('/')
      }
    }
  }
}
</script>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: #1a1a1a;
  border-bottom: 1px solid #2a2a2a;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 20px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
  transition: opacity 0.2s;
}

.brand:hover {
  opacity: 0.8;
}

.brand-icon {
  font-size: 28px;
}

.brand-text {
  color: #ffffff;
}

.nav {
  display: flex;
  gap: 32px;
  margin-left: 40px;
}

.nav-link {
  color: #999;
  text-decoration: none;
  font-weight: 500;
  font-size: 15px;
  position: relative;
  transition: color 0.2s;
}

.nav-link:hover {
  color: #ffffff;
}

.nav-link.router-link-active {
  color: #ffffff;
}

.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -20px;
  left: 0;
  right: 0;
  height: 2px;
  background: #ffffff;
}

.actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.icon-btn {
  position: relative;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-btn:hover {
  background: #2a2a2a;
}

.icon {
  font-size: 20px;
}

.badge {
  position: absolute;
  top: 4px;
  right: 4px;
  background: #ff4757;
  color: white;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
  line-height: 1.4;
}

.btn {
  height: 36px;
  padding: 0 16px;
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid transparent;
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-outline {
  background: transparent;
  color: #ffffff;
  border-color: #3a3a3a;
}

.btn-outline:hover {
  background: #2a2a2a;
  border-color: #4a4a4a;
}

.btn-primary {
  background: #ffffff;
  color: #0a0a0a;
  border: none;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.2);
  background: #f0f0f0;
}

.user-menu {
  display: flex;
  gap: 8px;
}

@media (max-width: 768px) {
  .nav {
    display: none;
  }

  .brand-text {
    font-size: 20px;
  }

  .actions {
    gap: 8px;
  }

  .btn {
    padding: 0 12px;
    font-size: 13px;
  }

  .user-menu {
    flex-direction: column;
    gap: 4px;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 12px 16px;
  }

  .brand-text {
    display: none;
  }

  .btn-outline {
    display: none;
  }
}
</style>


