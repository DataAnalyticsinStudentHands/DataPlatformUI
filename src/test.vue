<template>
  <div class="google-clone">
    
    <!-- Top Navigation -->
    <div class="top-nav">
      <button>About</button>
      <button>Store</button>
      <!-- ... other buttons and icons ... -->
    </div>
    
    <!-- Main Content -->
    <div class="main-content">
      <img src="@/assets/DanPersona.svg" alt="Google" /> <!-- assuming you have a logo -->
      <input type="text" placeholder="Search..." />
      <!-- ... other elements like voice search icon, buttons ... -->
    </div>

    <!-- Footer Navigation -->
    <div class="footer-nav">
      <button>Advertising</button>
      <button>Business</button>
      <!-- ... other buttons and text ... -->
    </div>

  </div>
</template>

<script>
export default {
  name: 'GoogleClone'
};
</script>

<style scoped>
.google-clone {
  font-family: Arial, sans-serif;
  background-color: #202124;
  color: #e8eaed;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.top-nav, .footer-nav {
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
}

.main-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
}

input[type="text"] {
  padding: 10px 20px;
  border: 1px solid #5f6368;
  border-radius: 25px;
  background-color: #3c4043;
  color: #e8eaed;
}
</style>
