// ===== Blog Data API =====

const BlogDB = {
  getAllPosts() {
    return BLOG_DATA.posts;
  },

  getPostById(id) {
    return BLOG_DATA.posts.find(p => p.id === id);
  },

  getPostsByCategory(category) {
    if (!category || category === '全部') return this.getAllPosts();
    return BLOG_DATA.posts.filter(p => p.category === category);
  },

  getPostsByTag(tag) {
    return BLOG_DATA.posts.filter(p => p.tags.includes(tag));
  },

  getAllCategories() {
    const cats = [...new Set(BLOG_DATA.posts.map(p => p.category))];
    return ['全部', ...cats];
  },

  getAllTags() {
    return [...new Set(BLOG_DATA.posts.flatMap(p => p.tags))];
  },

  searchPosts(keyword) {
    if (!keyword) return this.getAllPosts();
    const kw = keyword.toLowerCase();
    return BLOG_DATA.posts.filter(p =>
      p.title.toLowerCase().includes(kw) ||
      p.summary.toLowerCase().includes(kw) ||
      p.tags.some(t => t.toLowerCase().includes(kw))
    );
  },

  getSkills() {
    return BLOG_DATA.skills;
  },

  getTimeline() {
    return BLOG_DATA.timeline;
  }
};
