FROM nginx:latest

WORKDIR /usr/local/share/html/

COPY ./docker/dev/nginx.conf /etc/nginx/nginx.conf

COPY ./docker/dev/default.conf /etc/nginx/conf.d/default.conf

COPY ./dist  /usr/local/share/html/

COPY ./env.sh  /usr/local/share/html/

RUN chmod +x ./env.sh

EXPOSE 17000

CMD [ "/usr/local/share/html/env.sh" ]
