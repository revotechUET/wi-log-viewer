FROM nginx:1.16.0-alpine

WORKDIR /usr/share/nginx/html

COPY dist/ /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]