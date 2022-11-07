<template>
  <main>
    <div>
      <h1 class="font-bold text-4xl font-sans tracking-widest text-center mt-10 text-brick">
        Attorney Closed Case Form
      </h1>
    </div>
    <div class="m-5">
      <!-- @submit.prevent stops the submit event from reloading the page-->
      <form>
        <section>
          <h3 class="flex-col font-bold mb-6">Client Information:</h3>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-x-5 gap-y-10">
            <div class="flex flex-col">
            <label class="block">Name
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                value="First Last"/>
            </label>
          </div>
          <div class="flex flex-col">
            <label class="block">Zip Code
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                value="77598"/>
            </label>
          </div>
          <div class="flex flex-col">
              <label class="block">DOB
                <input type="date"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                value="2003-12-17">
              </label>
              </div>
        </div>
      </section>
      <section class="mt-8">
        <h3 class="font-bold mb-6">Restoring Justice Attorney Name(s)</h3>
        <label class="block">
              <input
                type="text"
                class="w-1/2 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                value="First Last"/>
            </label>
      </section>
      <section class="mt-8">
        <h3 class="font-bold mb-6">Restoring Justice Attorney Name(s)</h3>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-x-5 gap-y-10">
            <div class="flex flex-col">
            <label class="block">Date Restoring Justice Case Opened:
              <input
                type="date"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                value="2020-05-12"/>
            </label>
          </div>
          <div class="flex flex-col">
            <label class="block">Date Moved from Restoration to Freedom:
              <input
                type="date"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                value="2021-06-21"/>
            </label>
          </div>
          <div class="flex flex-col">
            <label class="block">Date Moved from Restoration to Closed:
              <input
                type="date"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                value="2021-07-20"/>
            </label>
          </div>
        </div>
      </section>
      </form>
    </div>
  </main>
</template>

<style>
input,
select,
textarea {
  border: 1px solid #cfd4d9;
  border-radius: 4px;
}
button{
  padding: 10px 16px;
}
.responsive {
  flex-direction: column;
  margin-left: 0;
}
</style>