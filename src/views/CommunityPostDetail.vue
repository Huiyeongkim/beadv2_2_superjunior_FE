<template>
  <main class="page">
    <div class="container">
      <button class="link" @click="router.back()">← 목록으로</button>
      <article class="post">
        <div class="head">
          <h1 class="title">{{ post.title }}</h1>
          <div class="meta">{{ post.user }} · {{ post.time }} · {{ categoryLabel(post.category) }}</div>
        </div>
        <div class="content" v-html="post.content"></div>
        <div v-if="post.attachments && post.attachments.length" class="attachments">
          <h4>첨부파일</h4>
          <ul>
            <li v-for="(f, idx) in post.attachments" :key="idx">
              <a :href="f.url" target="_blank" rel="noopener">{{ f.name }}</a> ({{ formatSize(f.size) }})
            </li>
          </ul>
        </div>
      </article>

      <section class="comments">
        <h2>댓글 {{ flatCount }}</h2>
        <ul class="list">
          <li v-for="c in comments" :key="c.id" class="item">
            <div class="row">
              <div class="avatar">{{ c.user[0] }}</div>
              <div class="grow">
                <div class="line"><b>{{ c.user }}</b> <span class="muted">· {{ c.time }}</span></div>
                <p>{{ c.text }}</p>

                <button class="link small" @click="toggleReply(c.id)">{{ replyOpenId === c.id ? '취소' : '답글 달기' }}</button>
                <form v-if="replyOpenId === c.id" class="reply-form" @submit.prevent="addReply(c.id)">
                  <input v-model="replyText" placeholder="답글을 입력하세요" />
                  <button class="btn btn-outline" type="submit">등록</button>
                </form>

                <ul class="replies" v-if="c.replies && c.replies.length">
                  <li v-for="r in c.replies" :key="r.id" class="reply">
                    <div class="row">
                      <div class="avatar small">{{ r.user[0] }}</div>
                      <div>
                        <div class="line"><b>{{ r.user }}</b> <span class="muted">· {{ r.time }}</span></div>
                        <p>{{ r.text }}</p>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </li>
        </ul>

        <form class="comment-form" @submit.prevent="addComment">
          <input v-model="newComment" placeholder="댓글을 입력하세요" />
          <button class="btn btn-primary" type="submit">등록</button>
        </form>
      </section>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, defineProps } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({ id: String })
const router = useRouter()

const post = ref({
  id: props.id,
  title: '예시 게시글 제목',
  user: '홍길동',
  time: '어제',
  category: 'free',
  content: '본문 내용 (목업) 입니다.<br/>이미지/링크 등이 올 수 있습니다.',
  attachments: [
    { name: 'guide.pdf', size: 234567, url: '#' }
  ]
})

const comments = ref([
  { id: 1, user: '아라', time: '방금', text: '좋은 정보 감사합니다!', replies: [
    { id: 11, user: '나', time: '방금', text: '감사합니다!' }
  ] },
  { id: 2, user: '민수', time: '1시간 전', text: '질문 있는데 DM 드려도 될까요?', replies: [] }
])

const newComment = ref('')
const replyOpenId = ref(0)
const replyText = ref('')

const flatCount = computed(() => {
  return comments.value.reduce((acc, c) => acc + 1 + (c.replies ? c.replies.length : 0), 0)
})

const categoryLabel = (c) => {
  return c === 'free' ? '자유' : c === 'info' ? '정보' : '모집'
}

const formatSize = (bytes) => {
  if (!bytes && bytes !== 0) return ''
  const units = ['B','KB','MB','GB']
  let i = 0
  let v = bytes
  while (v >= 1024 && i < units.length - 1) { v /= 1024; i++ }
  return `${v.toFixed(1)} ${units[i]}`
}

const addComment = () => {
  const text = newComment.value.trim()
  if (!text) return
  comments.value.unshift({ id: Date.now(), user: '나', time: '방금', text, replies: [] })
  newComment.value = ''
}

const toggleReply = (id) => {
  replyOpenId.value = replyOpenId.value === id ? 0 : id
  replyText.value = ''
}

const addReply = (parentId) => {
  const text = replyText.value.trim()
  if (!text) return
  const parent = comments.value.find(c => c.id === parentId)
  if (!parent) return
  parent.replies = parent.replies || []
  parent.replies.push({ id: Date.now(), user: '나', time: '방금', text })
  replyText.value = ''
  replyOpenId.value = 0
}
</script>

<style scoped>
.page { background: #0c0d10; color: #e9ecef; min-height: 100vh; }
.container { max-width: 800px; margin: 0 auto; padding: 24px 16px; }
.link { background: transparent; color: #9aa3af; border: 0; cursor: pointer; margin-bottom: 12px; }
.post { background: #12141a; border: 1px solid #1d2230; border-radius: 12px; padding: 16px; }
.title { margin: 0; }
.meta { color: #98a2b3; font-size: 12px; margin-top: 6px; }
.content { margin-top: 12px; line-height: 1.6; }
.attachments { margin-top: 16px; }
.attachments ul { margin: 8px 0 0; padding-left: 18px; }
.comments { margin-top: 20px; }
.list { list-style: none; padding: 0; margin: 0; display: grid; gap: 12px; }
.item { background: #12141a; border: 1px solid #1d2230; border-radius: 10px; padding: 10px; }
.row { display: flex; gap: 10px; }
.grow { flex: 1; }
.avatar { width: 32px; height: 32px; border-radius: 50%; background: #182038; display: grid; place-items: center; color: #d7def1; font-weight: 700; }
.avatar.small { width: 24px; height: 24px; font-size: 12px; }
.line { display: flex; gap: 6px; align-items: baseline; }
.muted { color: #98a2b3; font-size: 12px; }
.comment-form { margin-top: 12px; display: flex; gap: 8px; }
.comment-form input { flex: 1; height: 36px; background: #0f1116; color: #e9ecef; border: 1px solid #2a2f37; border-radius: 8px; padding: 0 10px; }
.btn { height: 36px; padding: 0 14px; border-radius: 8px; border: 1px solid transparent; cursor: pointer; }
.btn-primary { background: #5865f2; color: white; }
.btn-outline { background: transparent; color: #e2e6ea; border: 1px solid #3a3f46; }
.link.small { border: 0; background: transparent; color: #9aa3af; cursor: pointer; padding: 0; margin-top: 6px; }
.replies { margin-top: 8px; display: grid; gap: 10px; }
.reply-form { display: flex; gap: 8px; margin-top: 8px; }
</style>


