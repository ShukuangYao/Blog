<template>
  <Layout style="min-height: 600px">
    <div>
      <el-card shadow="never" style="margin-bottom: 20px">
        <el-input
          placeholder="请输入关键字"
          v-model="searchKey"
          clearable
          style="width: 300px"
        ></el-input>
        <el-button
          @click="search"
          icon="el-icon-search"
          style="margin-left: 10px"
          circle
          plain
        ></el-button>
        <el-button
          @click="$share()"
          style="margin-left: 10px"
          icon="el-icon-share"
          type="warning"
          plain
          circle
        ></el-button>
        <!-- <el-button
          type="primary"
          icon="el-icon-edit"
          round
          plain
          style="float: right"
          @click="goAdd"
          >写博文</el-button
        > -->
      </el-card>

      <div v-if="blogs.length > 0">
        <el-card
          shadow="hover"
          v-for="(item, index) in blogs"
          :key="'p' + index"
          style="margin-bottom: 20px"
        >
          <div slot="header">
            <el-row>
              <el-col :span="16">
                <span>
                  <g-link
                    style="text-decoration: none; cursor: pointer"
                    :to="'/blog/details/'+item.node.id"
                  >
                    <i class="el-icon-edit-outline"></i>&nbsp;&nbsp;
                    {{ item.node.filename }}
                  </g-link>
                </span>
              </el-col>
              <el-col :span="8">
                <div style="text-align: right">
                  <el-button
                    @click="$share('/blog/details/' + item.node.id)"
                    style="padding: 3px 0"
                    type="text"
                    icon="el-icon-share"
                  ></el-button>
                  <!-- <el-button
                    @click="editBlog(index)"
                    style="padding: 3px 0"
                    type="text"
                    icon="el-icon-edit"
                    v-if="token"
                  ></el-button>
                  <el-button
                    @click="deleteBlog(index)"
                    style="padding: 3px 0"
                    type="text"
                    icon="el-icon-delete"
                    v-if="token"
                  ></el-button> -->
                </div>
              </el-col>
            </el-row>
          </div>
          <div style="font-size: 0.9rem; line-height: 1.5; color: #606c71">
            最近更新 {{ $util.utcToLocal(item.node.updated_at) }}
          </div>
          <div
            style="
              font-size: 1.1rem;
              line-height: 1.5;
              color: #303133;
              padding: 10px 0px 0px 0px;
            "
          >
            {{ item.node.description }}
          </div>
        </el-card>
        <div style="text-align: center">
          <el-pagination
            @current-change="onSelect"
            background
            layout="prev, pager, next"
            :current-page="$page.allBlog.pageInfo.currentPage"
            :page-size="5"
            :total="$page.allBlog.pageInfo.totalPages * 5"
          >
          </el-pagination>
        </div>
      </div>

      <el-card
        shadow="never"
        style="
          margin-bottom: 20px;
          padding: 20px 0px 20px 0px;
          text-align: center;
        "
        v-if="!blogs || blogs.length == 0"
      >
        <font style="font-size: 30px; color: #dddddd">
          <b>还没有博客 (╯°Д°)╯︵ ┻━┻</b>
        </font>
      </el-card>
    </div>
  </Layout>
</template>
<page-query>
query ($page: Int) {
    allBlog (perPage: 5, page: $page) @paginate{
        edges{
            node {
                id
                public
                filename
                updated_at
                description
            }
        }
        pageInfo {
            totalPages
            currentPage
        }
    }
}

</page-query>
<script>
export default {
  name: "blogPage",
  data() {
    return {
			searchKey: "",
			blogs:[],
    };
	},
	// computed: {
	// 	blogs(){
	// 		return this.blogs = this.$page.allBlog.edges.filter((item) => item.node.public)
	// 	}
	// },
	watch: {
		'$page.allBlog.edges':function(newVal){
			this.blogs = newVal.filter((item) => item.node.public);
		}
	},
	created () {
		this.blogs = this.$page.allBlog.edges.filter((item) => item.node.public);
	},
  methods: {
    search() {
			this.blogs = this.$page.allBlog.edges.filter(item=>item.node.public && item.node.filename.indexOf(this.searchKey) !== -1)
    },
    onSelect(page) {
      this.$router.push({
        url: "/blog",
        params: {
          page: page === 1 ? null : page,
        },
      });
    },
  },
};
</script>