# Woocommerce stock bot
A script that corrects the stock status to "outofstock" if number of products is zero.
The project is set up with netlify configurations, so that it can be triggered as a webhook by navigating to the /update endpoint. You also need to provide two env variables. Either via a .env file or via netlify's admin panel. These are HOST (domain of your site. Ex: www.mystore.com) and BASIC_AUTH which is the API key generated from woocommerce. The user needs both read and write access.
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/oleeskild/woocommerce-stock-bot)
