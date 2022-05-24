# ReType Web Game

![status](https://img.shields.io/badge/Build%20and%20Test-Pass-success)
![Building Status](https://img.shields.io/badge/Status-Building-orange)
<img width="1919" alt="image" src="https://user-images.githubusercontent.com/34475380/169993603-39ad495b-5aad-40c8-93af-b369f7395061.png">
Table of Contents
=======================

* [What is ReType?](#what-is-ReType)
* [Docker Installation](#Docker-Installation)
* [Backend Test](#backend-Test)

---

What is ReType?
------
ReType: Quick Text Editing with Keyboard and Gaze is an application developed jointly by Dr. Shyamli Sindhwani, Dr. Gerald Webber from the University of Auckland, and Dr. Christof Lutteroth from the University of Bath, and published in 2019 CHI Conference on Human Factors in Computing Systems. This ReType application makes everyday interactions more fluent for professional keyboard users. However, we are inspired by the concept of the ReType application and decided to further extend its keyboard typing capabilities from its plugin based on Microsoft Word and gamify it to make it accessible to a broader audience.

If you don't want to host your own instance, check out https://api.dxh000130.top for a hosted version of the backend, and check out https://www.dxh000130.top for a hosted version of the front-end.

Docker Installation
------
```
docker build -t aspnetapp .
```
Need to apply for the domain name and the SSL certificate corresponding to the domain name
SSL Certificate Directory: \Endpoint\ReType\ssl
Also need to set the certificate directory and password in the Docker environment variable.
```
ASPNETCORE_Kestrel__Certificates__Default__Path:
ASPNETCORE_Kestrel__Certificates__Default__Password:
```

Backend Test
------
Check out https://github.com/uoa-compsci399-s1-2022/HSYYDS/tree/main/PostMan%20test for local version and hosted version
