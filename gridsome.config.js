// This is where project configuration and plugin options are located.
// Learn more: https://gridsome.org/docs/config

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

module.exports = {
  siteName: 'Blog',
  plugins: [],
  templates:{
    follower: [
      { 
        path: '/social/details/:login', 
        component: './src/templates/Social.vue' 
      }
    ],
    blog: [
      { 
        path: '/blog/details/:id', 
        component: './src/templates/Detail.vue' 
      }
    ],
    repo: [
      { 
        path: '/project/details/:name', 
        component: './src/templates/Project.vue' 
      }
    ]
  }
}
