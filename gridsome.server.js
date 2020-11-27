// Server API makes it possible to hook into various parts of Gridsome
// on server-side and add custom data to the GraphQL data layer.
// Learn more: https://gridsome.org/docs/server-api/

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`
const {readFileSync} = require('fs');
const axios = require('axios');
module.exports = function (api) {
  api.loadSource(async ({ addCollection }) => {
    const baseUrl = 'https://api.github.com/'

    const input = readFileSync('./static/configuration.json', 'utf8');
    const user = JSON.parse(input)
    const {githubUsername="GitHub-Laziji"} = user;

    const [{data:userData},{data:blogsData},{data:followersData},{data:followingsData},{data:reposData}] = await Promise.all([
      axios.get(`${baseUrl}users/${githubUsername}`),
      axios.get(`${baseUrl}users/${githubUsername}/gists`), 
      axios.get(`${baseUrl}users/${githubUsername}/followers`), 
      axios.get(`${baseUrl}users/${githubUsername}/following`), 
      axios.get(`${baseUrl}users/${githubUsername}/repos`)
    ])

    const users = addCollection('user')
    users.addNode({
      ...user,
      avatar_url: userData.avatar_url,
      name:userData.name,
      location: userData.location,
      blog: userData.blog,
      followers: userData.followers,
      following: userData.following,
      mini: false,
      audioAutoPlay:false,
    })

    const blogs = addCollection('blog')
    for(const item of blogsData){
      const files = Object.values(item.files) || []
      blogs.addNode({
        id: item.id,
        public: item.public,
        updated_at: item.updated_at,
        created_at: item.created_at,
        description: item.description,
        ...files[0]
      })
    }

    const followers = addCollection('follower')
    for(const item of followersData){
      followers.addNode({
        ...item
      })
    }

    const followings = addCollection('following')
    for(const item of followingsData){
      followings.addNode({
        ...item
      })
    }

    const repos = addCollection('repo')
    for(const item of reposData){
      repos.addNode({
        ...item
      })
    }

    const {id} = blogsData[0] 
    const singleBlog = addCollection('single')
    const {data: singleData} = await axios.get(`${baseUrl}gists/${id}`)
    console.log({singleData})
    const files = Object.values(singleData.files) || []
    singleBlog.addNode({
      updated_at: singleData.updated_at,
      created_at: singleData.created_at,
      description: singleData.description,
      ...files[0]
    })
  })

  api.createPages(({ createPage }) => {
    createPage({
      path: '/',
      component: './src/pages/new/Index.vue'
    })
    // Use the Pages API here: https://gridsome.org/docs/pages-api/
  })
}
