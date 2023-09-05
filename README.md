# Data Platform Frontend

This project uses [VueJS 3](https://vuejs.org/) with [Vite](https://vitejs.dev/) and [TailwindCSS](https://tailwindcss.com/).
For form validation [Vuelidate](https://vuelidate-next.netlify.app/) is used.
## Project setup
```
npm install
```

### Before Startup 
Setup a .env file with following variables, e.g.:

```
VITE_ROOT_API=http://localhost:3000
```
### Compiles and hot-reloads for development
```
npm run dev
```
### Production deployment
```
npm run build
```

We use [pm2](https://pm2.io/) (see example ecosystem.config.js) for deployment.
```
pm2 start ecosystem.config.js
```

