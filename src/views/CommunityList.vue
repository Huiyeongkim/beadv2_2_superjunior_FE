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
        <li v-for="p in postsData" :key="p.id" class="item" @click="router.push(`/community/${p.id}`)">
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

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const cat = ref('free')
const page = ref(0)
const pageSize = 10
const postsData = ref([])
const loading = ref(false)
const error = ref('')
const done = ref(false)

const fetchPosts = async (reset = false) => {
  try {
    if (reset) { page.value = 0; postsData.value = []; done.value = false }
    loading.value = true
    error.value = ''
    // 목업 API 호출 대체
    await new Promise(r => setTimeout(r, 400))
    const start = page.value * pageSize
    const items = Array.from({ length: pageSize }, (_, i) => ({
      id: start + i + 1,
      title: `${cat.value.toUpperCase()} 글 ${start + i + 1}`,
      user: ['홍길동','아라','루나'][i % 3],
      time: '방금',
      comments: Math.floor(Math.random()*10)
    }))
    postsData.value = [...postsData.value, ...items]
    done.value = items.length < pageSize
    page.value += 1
  } catch (e) {
    error.value = '목록을 불러오지 못했습니다'
  } finally {
    loading.value = false
  }
}

const loadMore = () => {
  if (!loading.value && !done.value) fetchPosts(false)
}

onMounted(() => {
  fetchPosts(true)
})

watch(cat, () => {
  fetchPosts(true)
})
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



