<template>
  <Layout style="min-height: 600px">
    <section>
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
          icon="el-icon-share"
          type="warning"
          style="margin-left: 10px"
          plain
          circle
        ></el-button>
      </el-card>

      <div v-if="projects && projects.length > 0">
        <el-card
          shadow="hover"
          v-for="(item, index) in projects"
          :key="'pro' + index"
          style="margin-bottom: 20px"
        >
          <div slot="header">
            <el-row>
              <el-col :span="16">
                <span>
                  <g-link
                    style="text-decoration: none; cursor: pointer"
                    :to="'/project/details/' + item.node.name+'?login='+item.node.owner.login"
                  >
                    <i class="el-icon-service"></i>&nbsp;&nbsp;
                    {{ item.node.name }}
                  </g-link>
                </span>
              </el-col>
              <el-col :span="8">
                <div style="text-align: right">
                  <el-button
                    @click="goGithub(item.node.html_url)"
                    style="padding: 3px 0"
                    type="text"
                    icon="el-icon-back"
                    >前往GitHub</el-button
                  >
                  <el-button
                    @click="$share('/project/details/' + item.node.name+'?login='+item.node.owner.login)"
                    style="padding: 3px 0"
                    type="text"
                    icon="el-icon-share"
                  ></el-button>
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
          <div
            style="font-size: 1.1rem; color: #303133; padding: 10px 0px 0px 0px"
          >
            <el-row>
              <el-col :span="16" style="padding-top: 5px">
                <el-tooltip
                  effect="dark"
                  :content="'star ' + item.node.stargazers_count"
                  placement="bottom"
                >
                  <i
                    class="el-icon-star-off"
                    style="margin: 0px 5px 0px 0px"
                  ></i>
                </el-tooltip>
                {{ item.node.stargazers_count }}
                <el-tooltip
                  effect="dark"
                  :content="'watch ' + item.node.watchers_count"
                  placement="bottom"
                >
                  <i class="el-icon-view" style="margin: 0px 5px 0px 15px"></i>
                </el-tooltip>
                {{ item.node.watchers_count }}
                <el-tooltip
                  effect="dark"
                  :content="'fork ' + item.node.forks_count"
                  placement="bottom"
                >
                  <i class="el-icon-bell" style="margin: 0px 5px 0px 15px"></i>
                </el-tooltip>
                {{ item.node.forks_count }}
              </el-col>
              <el-col :span="8" style="text-align: right">
                <el-tag
                  size="small"
                  type="danger"
                  v-if="item.node.license"
                  >{{ item.node.license.spdx_id }}</el-tag
                >
                <el-tag size="small" type="success">{{
                  item.node.language
                }}</el-tag>
              </el-col>
            </el-row>
          </div>
        </el-card>
        <div style="text-align: center">
          <el-pagination
            @current-change="onSelect"
            background
            layout="prev, pager, next"
            :current-page="$page.allRepo.pageInfo.currentPage"
            :page-size="5"
            :total="$page.allRepo.pageInfo.totalPages * 5"
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
        v-if="!projects || projects.length == 0"
      >
        <font style="font-size: 30px; color: #dddddd">
          <b>还没有开源项目 (╯°Д°)╯︵ ┻━┻</b>
        </font>
      </el-card>
    </section>
  </Layout>
</template>
<page-query>
query ($page: Int) {
    allRepo(perPage: 5, page: $page) @paginate{
        edges{
            node {
                id
                private
                name
                html_url
                updated_at
                forks_count
                watchers_count
                description
                stargazers_count
                language
                license{
                    key
                    name
                    url
                    node_id
                    spdx_id
                }
								owner{
									login
								}
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
  name: "projectPage",
  data() {
    return {
      searchKey: "",
      projects: [],
    };
  },
  watch: {
    "$page.allRepo.edges": function (newVal) {
      this.projects = newVal.filter((item) => !item.node.private);
    },
	},
	created () {
		this.projects = this.$page.allRepo.edges.filter((item) => !item.node.private);
	},
  methods: {
    search() {
      this.projects = this.$page.allRepo.edges.filter(item=>!item.node.private && item.node.name.indexOf(this.searchKey) !== -1)
    },
    goDetails(name) {
      this.$router.push("/user/project/details/" + name);
    },
    goGithub(url) {
      window.open(url);
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