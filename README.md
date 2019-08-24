# stream large files to express


[philip.a.senger@cngrgroup.com](mailto:philip.a.senger@cngrgroup.com) | mobile: 0404466846 | [CV/Resume](http://www.visualcv.com/philipsenger) | [blog](http://www.apachecommonstipsandtricks.blogspot.com/) | [LinkedIn](http://au.linkedin.com/in/philipsenger) | [twitter](http://twitter.com/PSengerDownUndr) | [keybase](https://keybase.io/psenger)


This is a very simple example of how to stream large files over http to and from an express server.

This example, fires up a express HTTP server that accepts both _post_ and _get_ on ``/`` with the body a streamed file in both directions.

The file on the server will be called ```new_file.tar.gz```

## Environment 

| Variable name   	| Purpose                                                                                                                                    	|
|-----------------	|--------------------------------------------------------------------------------------------------------------------------------------------	|
| PASSWORD        	| 32 characters that is a symmetric password                                                                                                 	|
| SHARE_DIRECTORY 	| The directory containing the files to be read, or uploaded to. Ensure that the permissions for this directory are correct for the process. 	|
| URL             	| Used by sendIt and getIt to send and get to the URL. eg http://127.0.0.1:3000/                                                             	|
| PORT            	| Used by the express server for the port number                                                                                             	|

## Sending

The client code for this example is called ``sendit.js``, which reads a file called ```file.tar.gz```, via streams, and sends it to the server over http.

## Getting

The client code for this example is called ``getit.js``, which reads http, via streams, writes the file to ```read_file.tar.gz```

- Phil