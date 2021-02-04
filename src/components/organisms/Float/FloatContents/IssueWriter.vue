<!-----------------------------------------------------------------------------
  - Copyright (c) 2020.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div style="width: 100%;height: 100%;overflow-y: scroll;">
    <p>
      <a href="https://github.com/tsrkzy/hiace/issues" target="_blank"
        >Issue/Github(外部ページ)</a
      >
    </p>
    <fieldset>
      <legend>報告内容</legend>
      <div>
        <ha-select
          mandatory
          :items="categoryItems"
          :value="category"
          @change="onCategory"
        ></ha-select>
      </div>
      <div>
        <ha-input-form
          placeholder="タイトル(必須)"
          v-model="title"
        ></ha-input-form>
      </div>
      <div>
        <ha-textarea
          rows="5"
          resizeable
          placeholder="本文"
          v-model="body"
        ></ha-textarea>
      </div>
      <ha-button @click="onClickCreateIssue" :disabled="disableCreate"
        >送信</ha-button
      >
    </fieldset>
    <details open>
      <summary>Issues</summary>
      <ul>
        <li :key="item.url" v-for="item in issueItems">
          <span
            ><a :href="item.url" target="_blank">{{ item.text }}</a></span
          >
        </li>
      </ul>
    </details>
  </div>
</template>

<script>
import HaButton from "@/components/atoms/HaButton";
import HaInputForm from "@/components/atoms/HaInputForm";
import HaSelect from "@/components/atoms/HaSelect";
import HaTextarea from "@/components/atoms/HaTextarea";
import { Notify } from "@/scripts/Notify";
import { octokit } from "@/scripts/Octokit";

export default {
  name: "IssueWriter",
  components: { HaSelect, HaButton, HaTextarea, HaInputForm },
  props: {
    floatId: {
      type: Number,
      require: true
    }
  },
  async created() {
    this.issueList = await this.fetchIssues();
  },
  data() {
    return {
      category: null,
      title: "",
      body: "",
      issueList: []
    };
  },
  methods: {
    async fetchIssues() {
      try {
        const r = await octokit.request("GET /repos/{owner}/{repo}/issues", {
          owner: "tsrkzy",
          repo: "hiace",
          state: "open",
          sort: "updated",
          direction: "desc",
          per_page: 10
        });
        return r.data;
      } catch (e) {
        console.error(e);
      }
    },
    async onClickCreateIssue() {
      console.log("IssueWriter.onClickCreateIssue"); // @DELETEME
      const title = this.title;
      const body = this.issueJson;
      await octokit.request("POST /repos/{owner}/{repo}/issues", {
        owner: "tsrkzy",
        repo: "hiace",
        title,
        body
      });
      this.clear();
      this.issueList = await this.fetchIssues();
      Notify.Log("Issue.create()");
    },
    clear() {
      this.category = null;
      this.title = "";
      this.body = "";
    },
    onCategory(category) {
      console.log("IssueWriter.onCategory", category); // @DELETEME
      this.category = category;
    }
  },
  computed: {
    categoryItems() {
      return [
        { value: "bug", text: "不具合" },
        { value: "feature", text: "機能追加" }
      ];
    },
    issueJson() {
      const c = "```";
      const room = this.$store.getters["room/info"]?.id;
      const { title, category, body } = this;
      return `${c}\n/* raw message */\ntitle: ${title}\nroom: ${room}\ncategory: ${category}\nbody: ${body}\n${c}`;
    },
    disableCreate() {
      const category = this.category;
      const title = this.title;
      const body = this.body;
      return !category || !title || !body;
    },
    issueItems() {
      return this.issueList.map(issue => {
        const { number, title, html_url: url } = issue;
        return { text: `#${number}: ${title}`, url };
      });
    }
  }
};
</script>

<style scoped></style>
