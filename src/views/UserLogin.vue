<template>
  <main class="login-page">
    <div class="container">
      <div class="login-card">
        <div class="login-header">
          <h1>로그인</h1>
          <p>0982 공구팔이에 오신 것을 환영합니다</p>
        </div>
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="email">이메일</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              placeholder="이메일을 입력하세요"
              required
            />
          </div>
          <div class="form-group">
            <label for="password">비밀번호</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>
          <div class="form-options">
            <label class="checkbox-label">
              <input type="checkbox" v-model="rememberMe" />
              <span>로그인 상태 유지</span>
            </label>
            <router-link to="/forgot-password" class="forgot-link">비밀번호 찾기</router-link>
          </div>
          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? '로그인 중...' : '로그인' }}
          </button>
          <!-- <div class="divider">
            <span>또는</span>
          </div>
          <div class="social-login">
            <button type="button" class="btn btn-social btn-google">
              <span>🔍</span> Google로 로그인
            </button>
            <button type="button" class="btn btn-social btn-kakao">
              <span>💬</span> Kakao로 로그인
            </button>
          </div> -->
          <div class="signup-link">
            <span>계정이 없으신가요?</span>
            <router-link to="/register">회원가입</router-link>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  name: 'UserLogin',
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      rememberMe: false,
      loading: false
    }
  },
  methods: {
    async handleLogin() {
      this.loading = true
      try {
        // TODO: 실제 API 호출로 교체
        // 목업: 로그인 성공 시뮬레이션
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // 토큰 저장 (목업)
        localStorage.setItem('access_token', 'mock_token_' + Date.now())
        localStorage.setItem('user_role', this.form.email.includes('seller') ? 'seller' : 'user')
        localStorage.setItem('user_email', this.form.email)
        
        if (this.rememberMe) {
          localStorage.setItem('remember_me', 'true')
        }
        
        // 이전 페이지로 리다이렉트 또는 홈으로
        const redirect = this.$route.query.redirect || '/'
        this.$router.push(redirect)
      } catch (error) {
        alert('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.')
        console.error('Login error:', error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.login-page {
  background: #0a0a0a;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.container {
  width: 100%;
  max-width: 440px;
}

.login-card {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 8px;
}

.login-header p {
  color: #a0a0a0;
  font-size: 15px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
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

.form-group input {
  padding: 14px 16px;
  background: #0f0f0f;
  border: 2px solid #2a2a2a;
  border-radius: 12px;
  font-size: 15px;
  color: #ffffff;
  transition: border-color 0.2s;
}

.form-group input::placeholder {
  color: #666;
}

.form-group input:focus {
  outline: none;
  border-color: #ffffff;
  background: #151515;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #e0e0e0;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.forgot-link {
  color: #ffffff;
  text-decoration: none;
  font-weight: 500;
}

.forgot-link:hover {
  text-decoration: underline;
}

.btn {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
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

.divider {
  position: relative;
  text-align: center;
  margin: 8px 0;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #2a2a2a;
}

.divider span {
  position: relative;
  background: #1a1a1a;
  padding: 0 16px;
  color: #666;
  font-size: 14px;
}

.social-login {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.btn-social {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #0f0f0f;
  border: 2px solid #2a2a2a;
  color: #e0e0e0;
}

.btn-social:hover {
  border-color: #3a3a3a;
  background: #151515;
}

.btn-google {
  border-color: #db4437;
  color: #db4437;
}

.btn-google:hover {
  background: #fff5f5;
}

.btn-kakao {
  border-color: #fee500;
  color: #3c1e1e;
}

.btn-kakao:hover {
  background: #fffef0;
}

.signup-link {
  text-align: center;
  margin-top: 8px;
  font-size: 14px;
  color: #a0a0a0;
}

.signup-link a {
  color: #ffffff;
  font-weight: 600;
  text-decoration: none;
  margin-left: 4px;
}

.signup-link a:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .login-card {
    padding: 32px 24px;
  }

  .login-header h1 {
    font-size: 28px;
  }
}
</style>

