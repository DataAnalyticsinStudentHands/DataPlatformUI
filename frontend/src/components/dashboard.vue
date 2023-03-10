<template>
  <main>
    <div>
      <h1
        class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10"
      >
        Welcome {{ firstName }} {{ lastName }}
      </h1>
    </div>
  </main>
</template>
<script>
import axios from "axios";

export default {
  data() {
    return {
      firstName: "",
      lastName: "",
    };
  },
  created() {
    if (localStorage.getItem("token") === null) {
      this.$router.push("/login");
    }
  },
  mounted() {
    let url = import.meta.env.VITE_ROOT_API + `/userdata/user`;
    axios
      .get(url, {
        headers: { token: localStorage.getItem("token") },
      })
      .then(
        (res) => {
          this.firstName = res.data.user.firstName;
          this.lastName = res.data.user.lastName;
        },
        (err) => {
          if (err) {
            this.$router.push("/login");
          }
        }
      );
  },
  methods: {
    routePush(routeName) {
      this.$router.push({ name: routeName });
    },
  },
};
</script>
