<template>
  <main>
    <div>
      <h1
        class="font-bold text-4xl font-sans tracking-widest text-center mt-10"
        style="color: #7d0d15"
      >
        Find Client
      </h1>
    </div>
    <div class="m-5">
      <div class="flex flex-row justify-between">
        <section class="justify-self-end">
          <h3>Search Client By:</h3>
        </section>
        <section class="flex flex-col">
          <select name="" id="">
            <option value="Client Name">Client Name</option>
            <option value="Client Name">Client Number</option>
          </select>
          <input class="mt-4" type="text" />
        </section>
        <section>
          <button type="submit">Search Client</button>
        </section>
      </div>
      <div></div>
    </div>
  </main>
</template>
<script>
export default {};
</script>
<style>
</style>