<template>
  <main class="page">
    <div class="container">
      <div class="heading">
        <h1>커뮤니티</h1>
        <router-link class="btn btn-primary" to="/community/write">글쓰기</router-link>
      </div>
      <div class="tabs">
        <button :class="['tab', cat==='free' && 'active']" @click="cat='free'">자유</button>
        <button :class="['tab', cat==='info' && 'active']" @click="cat='info'">정보</button>
        <button :class="['tab', cat==='recruit' && 'active']" @click="cat='recruit'">모집</button>
      </div>
      <ul class="list">
        <li v-for="p in postsData" :key="p.id" class="item" @click="$router.push(`/community/${p.id}`)">
          <div class="title">{{ p.title }}</div>
          <div class="muted">{{ p.user }} · {{ p.time }} · 댓글 {{ p.comments }}</div>
        </li>
      </ul>
      <div class="status" v-if="loading || error">
        <span v-if="loading">로딩중...</span>
        <span v-else class="err">{{ error }}</span>
      </div>
      <div class="more">
        <button class="btn" :disabled="loading || done" @click="loadMore">더 보기</button>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  name: 'CommunityList',
  data() {
    return {
      cat: 'free',
      page: 0,
      pageSize: 10,
      postsData: [],
      loading: false,
      error: '',
      done: false
    }
  },
  created() { this.fetchPosts(true) },
  watch: {
    cat() { this.fetchPosts(true) }
  },
  methods: {
    async fetchPosts(reset = false) {
      try {
        if (reset) { this.page = 0; this.postsData = []; this.done = false }
        this.loading = true; this.error = ''
        // 목업 API 호출 대체
        await new Promise(r => setTimeout(r, 400))
        const start = this.page * this.pageSize
        const items = Array.from({ length: this.pageSize }, (_, i) => ({
          id: start + i + 1,
          title: `${this.cat.toUpperCase()} 글 ${start + i + 1}`,
          user: ['홍길동','아라','루나'][i % 3],
          time: '방금',
          comments: Math.floor(Math.random()*10)
        }))
        this.postsData = [...this.postsData, ...items]
        this.done = items.length < this.pageSize
        this.page += 1
      } catch (e) {
        this.error = '목록을 불러오지 못했습니다'
      } finally {
        this.loading = false
      }
    },
    loadMore() { if (!this.loading && !this.done) this.fetchPosts(false) }
  }
}
</script>

<style scoped>
.page { background: #0c0d10; color: #e9ecef; min-height: 100vh; }
.container { max-width: 880px; margin: 0 auto; padding: 24px 16px; }
.heading { display: flex; align-items: center; justify-content: space-between; }
.tabs { display: flex; gap: 8px; margin: 12px 0; }
.tab { background: #141823; color: #c9d1e5; border: 1px solid #1d2230; border-radius: 999px; padding: 6px 12px; cursor: pointer; }
.tab.active { background: #2a355e; border-color: #3a4a82; color: #ffffff; }
.list { list-style: none; padding: 0; margin: 0; }
.item { padding: 12px 0; border-top: 1px solid #171a22; }
.title { color: #e6ebf5; }
.muted { color: #98a2b3; font-size: 12px; margin-top: 6px; }
.btn { height: 32px; padding: 0 12px; border-radius: 8px; border: 1px solid transparent; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; }
.btn-primary { background: #5865f2; color: white; }
.status { margin-top: 12px; }
.err { color: #ff6b6b; }
.more { display: flex; justify-content: center; margin-top: 12px; }
</style>



