<script>
  export let title;
  export let buttonText;
</script>

<div class="d-flex mb-3">
  <h4 class="title me-3">{title}</h4>
  <button class="btn btn-primary" on:click>
    <span>
      <i class="fa-solid fa-plus me-2" />{buttonText}
    </span>
  </button>
  <hr class="flex-grow-1 mx-3">
</div>

<style>
  div {
    justify-items: center;
  }

  .title {
    align-self: center;
    justify-self: center;
  }

  hr {
    color: #ffffff90;
    height: 2px;
  }

  button {
    padding: 3px 12px 3px 7px;
    font-size: 0.9rem;
  }
</style>
