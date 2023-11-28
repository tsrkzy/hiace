<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<script lang="ts">
  import { onMount } from "svelte";
  import { octokit } from "@/util/octokit";

  interface GithubIssue {
    html_url: string;
    number: number;
    title: string;
  }

  let issues: GithubIssue[] = []

  const onClickSubmit = () => {
    console.log("IssueWriter.onClickSubmit");
    // const title = this.title;
    // const body = this.issueJson;
    // const labels = [CATEGORY_RAW[this.category]].filter((l) => !!l);
    // await octokit.request("POST /repos/{owner}/{repo}/issues", {
    //   owner: "tsrkzy",
    //   repo: "hiace",
    //   title,
    //   body,
    //   labels,
    // });
  }

  onMount(async () => {
    const { data = [] } = await octokit.request("GET /repos/{owner}/{repo}/issues", {
      owner: "tsrkzy",
      repo: "hiace",
      state: "open",
      sort: "updated",
      direction: "desc",
      per_page: 40,
    });
    issues = data;
  })
</script>

<a href="https://github.com/tsrkzy/hiace/issues" target="_blank">不具合・要望一覧(Github/Issue)</a>
<fieldset>
  <legend>報告内容</legend>
  <label>
    <input type="radio" name="issue_type" value="bug" checked>
    <span>不具合</span>
  </label>
  <label>
    <input type="radio" name="issue_type" value="request">
    <span>要望</span>
  </label><br/>
  <input type="text" placeholder="タイトル"> <br/>
  <textarea placeholder="内容"></textarea><br/>
  <button on:click={()=>onClickSubmit()}>送信</button>
</fieldset>
<details open>
  <summary>Issues</summary>
  <ul>
    {#each issues as issue}
      <li><a href={issue.html_url} target="_blank">#{issue.number}:&nbsp;{issue.title}</a></li>
    {/each}
  </ul>
</details>