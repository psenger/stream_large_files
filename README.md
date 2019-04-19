# stream large files to express


[philip.a.senger@cngrgroup.com](mailto:philip.a.senger@cngrgroup.com) | mobile: 0404466846 | [CV/Resume](http://www.visualcv.com/philipsenger) | [blog](http://www.apachecommonstipsandtricks.blogspot.com/) | [LinkedIn](http://au.linkedin.com/in/philipsenger) | [twitter](http://twitter.com/PSengerDownUndr) | [keybase](https://keybase.io/psenger)

This is a very simple example of how to stream large files over http to an express server.

1. This example, fires up a HTTP server that accepts _post_ on ``/`` with the body a streamed file.
2. The client is called ``sendit.js``, which reads a file, via streams, and sends it to the server over http.

- Phil