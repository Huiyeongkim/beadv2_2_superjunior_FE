<template>
  <main class="page">
    <div class="container">
      <h1>사람들</h1>
      <div class="filters">
        <input v-model="q" placeholder="닉네임 검색" />
        <select v-model="genre">
          <option value="">선호 장르(전체)</option>
          <option v-for="g in genres" :key="g" :value="g">{{ g }}</option>
        </select>
        <button class="btn btn-primary" @click="search">검색</button>
      </div>
      <ul class="list">
        <li v-for="u in filtered" :key="u.id" class="card">
          <div class="left">
            <div class="avatar">{{ u.name[0] }}</div>
            <div>
              <div class="title">{{ u.name }}</div>
              <div class="muted">선호: {{ u.genres.join(', ') }} · 스타일: {{ u.styles.join(', ') }}</div>
            </div>
          </div>
          <div class="actions">
            <button class="btn btn-outline" @click="toggleFollow(u)">{{ u.following ? '언팔로우' : '팔로우' }}</button>
            <router-link class="btn" :to="`/me/profile?user=${u.id}`">프로필</router-link>
          </div>
        </li>
      </ul>
    </div>
  </main>
</template>

<script>
export default {
  name: 'UserDirectory',
  data() {
    return {
      q: '',
      genre: '',
      genres: ['액션','RPG','FPS','전략'],
      users: [
        { id: 1, name: '홍길동', genres: ['RPG'], styles: ['전략형'], following: true },
        { id: 2, name: '아라', genres: ['FPS','전략'], styles: ['공격형'], following: false },
        { id: 3, name: '민수', genres: ['액션'], styles: ['서포터'], following: false }
      ]
    }
  },
  computed: {
    filtered() {
      return this.users
        .filter(u => (this.genre ? u.genres.includes(this.genre) : true))
        .filter(u => (this.q ? u.name.toLowerCase().includes(this.q.toLowerCase()) : true))
    }
  },
  methods: {
    search() {},
    toggleFollow(u) { u.following = !u.following }
  }
}
</script>

<style scoped>
.page { background: #0c0d10; color: #e9ecef; min-height: 100vh; }
.container { max-width: 880px; margin: 0 auto; padding: 24px 16px; }
.filters { display: flex; gap: 8px; margin-bottom: 12px; }
input, select { height: 36px; background: #0f1116; color: #e9ecef; border: 1px solid #2a2f37; border-radius: 8px; padding: 0 10px; }
.btn { height: 32px; padding: 0 12px; border-radius: 8px; border: 1px solid transparent; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; }
.btn-primary { background: #5865f2; color: white; }
.btn-outline { background: transparent; color: #e2e6ea; border-color: #3a3f46; }
.list { list-style: none; padding: 0; margin: 0; display: grid; gap: 12px; }
.card { display: flex; align-items: center; justify-content: space-between; background: #12141a; border: 1px solid #1d2230; border-radius: 10px; padding: 10px; }
.left { display: flex; gap: 10px; align-items: center; }
.avatar { width: 40px; height: 40px; border-radius: 50%; background: #182038; display: grid; place-items: center; color: #d7def1; font-weight: 700; }
.title { color: #e6ebf5; }
.muted { color: #98a2b3; font-size: 12px; }
</style>


