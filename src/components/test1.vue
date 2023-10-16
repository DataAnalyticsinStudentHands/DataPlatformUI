<!-- /login -->
<template>
  <section class="">
    <div class="px-10 py-20">
      <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
        <form
          class="space-y-4 md:space-y-6"
          action="/login"
          method="POST"
        >
          <div
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10"
          >
            <div>
              <label for="email" class="block">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="name@company.com"
              />
            </div>
          </div>
          <div
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10"
          >
            <div>
              <label for="password" class="block">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
          </div>
          <div
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10"
          >
          </div>
          <button
            type="submit"
            class="bg-red-700 text-white rounded"
          >
            Login
          </button>
          <p class="text-sm font-medium text-black-500 dark:text-black-400">
            Don't have an account?
            <router-link 
              to="/registerForm" 
              class="font-medium text-primary-600 hover:underline dark:text-blue-500"
            >
              Register here
            </router-link>
          </p>

          <router-link 
            to="/resetPassword" 
            class="text-sm font-medium text-primary-600 hover:underline dark:text-blue-500"
          >
            Forgot Password?
          </router-link>

        </form>
      </div>
    </div>
  </section>
</template>