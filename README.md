## Introduction

In completion of coding test for AWSM, this app scrapes arin.net at endpoint https://search.arin.net/rdap/?query={ip_address} for the net range from specific IP Adresses

The app is comprised of two parts, a Python/Flask Backend, and React Frontend. You can find the hosted at [https://arin-net-test-fe-2l2i6lgdxq-wl.a.run.app/](https://arin-net-test-fe-2l2i6lgdxq-wl.a.run.app/)

## File overview

## Flask backend

### Under folder flask_api 

The main app file is in flask_api/app.py. App uses selenium webdriver for web scraping.

Dockerfile and deploy files can be found in flask_api/ directory as well 

## React Frontend

### Under folder react_frontend

Main code for app contained in react_frontend/app.tsx

Dockerfile, nginx.conf, and deploy file also in react_frontend directory. 
