<script>
  export let title;
  export let count;
  export let buttonText;
</script>

<div class="d-flex align-items-center mb-3">
  <h4 class="title me-2 mb-0">{title}</h4>
  {#if count}
    <span class="circle-badge bg-primary me-2">{count}</span>
  {/if}
  <hr class="flex-grow-1 mx-3">
  <button class="btn btn-primary icon-btn" on:click>
    <span>
      <i class="fa-solid fa-plus me-2" />{buttonText}
    </span>
  </button>
</div>

<style>
  div {
    justify-items: center;
  }

  .circle-badge {
    width: 1.5em;
    height: 1.5em;
    text-align: center;
    line-height: 1.5em;
    font-weight: bold;
    border-radius: 50%;
  }

  .title {
    align-self: center;
    justify-self: center;
    text-align: center;
  }

  hr {
    color: #ffffff90;
    height: 2px;
  }
</style>
