<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<script lang="ts">
  import { onMount } from "svelte";
  import { octokit } from "@/util/octokit";
  import { createNotice } from "@/model/service/NoticeService";

  let issueType = "bug";
  let title = "";
  let description = "";

  interface GithubIssue {
    html_url: string;
    number: number;
    title: string;
  }

  let issues: GithubIssue[] = []

  const onClickSubmit = async () => {
    const body = `${issueType}:\n\`\`\`${description}\`\`\``;
    await octokit.request("POST /repos/{owner}/{repo}/issues", {
      owner: "tsrkzy",
      repo: "hiace",
      title,
      body,
    });

    title = "";
    description = "";
    createNotice("不具合・要望を送信しました")

    await reloadIssues();
  }

  const onChangeIssueType = (e: Event) => {
    e.stopPropagation();
    const target = e.target as HTMLInputElement;
    issueType = target.value;
  }
  const onInputTitle = (e: Event) => {
    e.stopPropagation();
    const target = e.target as HTMLInputElement;
    title = target.value.trim();
  }

  const onInputDescription = (e: Event) => {
    e.stopPropagation();
    const target = e.target as HTMLInputElement;
    description = target.value.trim();
  }

  const reloadIssues = async () => {
    const { data = [] } = await octokit.request("GET /repos/{owner}/{repo}/issues", {
      owner: "tsrkzy",
      repo: "hiace",
      state: "open",
      sort: "updated",
      direction: "desc",
      per_page: 40,
    });
    issues = data;
  }

  onMount(async () => {
    await reloadIssues()
  })
</script>

<a href="https://github.com/tsrkzy/hiace/issues" target="_blank">不具合・要望一覧(Github/Issue)</a>
<fieldset>
  <legend>報告内容</legend>
  <label>
    <input
        type="radio"
        name="issue_type"
        value="bug"
        on:change={e=>onChangeIssueType(e)}
        checked>
    <span>不具合</span>
  </label>
  <label>
    <input
        type="radio"
        name="issue_type"
        value="request"
        on:change={e=>onChangeIssueType(e)}
    >
    <span>要望</span>
  </label><br/>
  <input type="text" placeholder="タイトル"
         value={title}
         on:input={e=>onInputTitle(e)}
  > <br/>
  <textarea placeholder="内容"
            value={description}
            on:input={e=>onInputDescription(e)  }
  ></textarea><br/>
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