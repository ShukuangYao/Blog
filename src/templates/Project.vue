<template>
  <Layout style="min-height: 600px" v-loading="loading">
    <el-card shadow="never" style="min-height: 400px">
      <div slot="header">
        <el-row>
          <el-col :span="12">
            <span>{{ project.name }}</span>
          </el-col>
          <el-col :span="12">
            <div style="text-align: right">
              <el-button
                @click="$share()"
                style="padding: 3px 0"
                type="text"
                icon="el-icon-share"
                >分享</el-button
              >
              <el-button
                @click="goGithub(project.html_url)"
                style="padding: 3px 0"
                type="text"
                icon="el-icon-back"
                >前往GitHub</el-button
              >
              <el-button
                @click="more"
                style="padding: 3px 0"
                type="text"
                icon="el-icon-more-outline"
                >更多项目</el-button
              >
            </div>
          </el-col>
        </el-row>
      </div>
      <div style="font-size: 0.9rem; line-height: 1.5; color: #606c71">
        发布 {{ project.createTime }} <br />
        更新 {{ project.updateTime }}
      </div>
      <div
        style="
          font-size: 1.1rem;
          line-height: 1.5;
          color: #303133;
          padding: 20px 0px 0px 0px;
        "
      >
        {{ project.description }}
      </div>
      <div
        style="
          font-size: 1.1rem;
          color: #303133;
          padding: 15px 0px 15px 0px;
          border-bottom: 1px solid #e4e7ed;
        "
      >
        <el-row>
          <el-col :span="16" style="padding-top: 5px">
            <el-tooltip
              effect="dark"
              :content="'star ' + project.stargazers_count"
              placement="bottom"
            >
              <i class="el-icon-star-off" style="margin: 0px 5px 0px 0px"></i>
            </el-tooltip>
            {{ project.stargazers_count }}
            <el-tooltip
              effect="dark"
              :content="'watch ' + project.watchers_count"
              placement="bottom"
            >
              <i class="el-icon-view" style="margin: 0px 5px 0px 15px"></i>
            </el-tooltip>
            {{ project.watchers_count }}
            <el-tooltip
              effect="dark"
              :content="'fork ' + project.forks_count"
              placement="bottom"
            >
              <i class="el-icon-bell" style="margin: 0px 5px 0px 15px"></i>
            </el-tooltip>
            {{ project.forks_count }}
          </el-col>
          <el-col :span="8" style="text-align: right">
            <el-tag size="small" type="danger" v-if="project.license">{{
              project.license.spdx_id
            }}</el-tag>
            <el-tag size="small" type="success">{{ project.language }}</el-tag>
          </el-col>
        </el-row>
      </div>
      <div
        v-html="project.content"
        v-if="project.content"
        class="markdown-body"
        style="padding-top: 20px"
      ></div>
      <div
        v-if="!project.content"
        style="padding: 20px 0px 20px 0px; text-align: center"
      >
        <font style="font-size: 30px; color: #dddddd">
          <b>还没有介绍 (╯°Д°)╯︵ ┻━┻</b>
        </font>
      </div>
    </el-card>
  </Layout>
</template>
<script>
import { request } from "@/utils/request";
import { Base64 } from "js-base64";
import mavonEditor from "mavon-editor";

export default {
  name: 'projectDetail',
  data() {
    return {
      project: {
        name: this.$route.params.name,
      },
      login: this.$route.query.login,
      loading: false,
    };
  },
  computed: {},
  async mounted() {
		this.loading = true;
    try {
      const [{ data }, { data: mdData }] = await Promise.all(
        [request.get(`repos/${this.login}/${this.project.name}`),
        request.get(
          `repos/${this.login}/${this.project.name}/contents/README.md`
        )]
      );
      this.project = {
        ...data,
        content: mavonEditor.markdownIt.render(Base64.decode(mdData.content)),
      };
    } finally {
      this.loading = false;
    }
  },
  methods: {
    goGithub(url) {
      window.open(url);
    },
    more() {
      this.$router.push("/project");
    },
  },
};
</script>