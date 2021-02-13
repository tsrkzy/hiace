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
        >不具合・要望一覧(Github/Issue)</a
      >
    </p>
    <p>
      <a href="https://github.com/tsrkzy/hiace/wiki" target="_blank"
        >使い方(Wiki/Github)</a
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
        <ha-input-form placeholder="タイトル" v-model="title"></ha-input-form>
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

const BUG = { id: 1262032686, label: "不具合", raw: "bug" };
const ENHANCEMENT = { id: 1262032688, label: "機能追加", raw: "enhancement" };
const CATEGORY_LABEL = {
  [BUG.id]: BUG.label,
  [ENHANCEMENT.id]: ENHANCEMENT.label
};
const CATEGORY_RAW = {
  [BUG.id]: BUG.raw,
  [ENHANCEMENT.id]: ENHANCEMENT.raw
};

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
          per_page: 40
        });
        console.log(r.data); // @DELETEME
        return r.data;
      } catch (e) {
        console.error(e);
      }
    },
    async onClickCreateIssue() {
      console.log("IssueWriter.onClickCreateIssue"); // @DELETEME
      const title = this.title;
      const body = this.issueJson;
      const labels = [CATEGORY_RAW[this.category]].filter(l => !!l);
      await octokit.request("POST /repos/{owner}/{repo}/issues", {
        owner: "tsrkzy",
        repo: "hiace",
        title,
        body,
        labels
      });
      this.clear();
      this.issueList = await this.fetchIssues();
      Notify.Log("GithubにIssueを作成");
    },
    clear() {
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
        { value: `${BUG.id}`, text: `${BUG.label}` },
        { value: `${ENHANCEMENT.id}`, text: `${ENHANCEMENT.label}` }
      ];
    },
    issueJson() {
      const c = "```";
      const room = this.$store.getters["room/info"]?.id;
      const { title, category, body } = this;
      const categoryLabel = CATEGORY_LABEL[category] ?? "null";
      return `${c}\n/* raw message */\ntitle: ${title}\nroom: ${room}\ncategory: ${categoryLabel}\nbody: ${body}\n${c}`;
    },
    disableCreate() {
      const category = this.category;
      const title = this.title;
      const body = this.body;
      return !category || !title || !body;
    },
    issueItems() {
      return this.issueList.map(issue => {
        const { number, title, html_url, labels } = issue;
        const isBug = labels.some(l => l.id === BUG.id);
        const bug = isBug ? " [bug]" : "";
        return {
          text: `#${number}${bug}: ${title}`,
          url: html_url
        };
      });
    }
  }
};
</script>

<style scoped></style>
