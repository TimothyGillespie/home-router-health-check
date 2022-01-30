# Home Router Health Check

This project was built in response to waking up without an Internet in my home network (the name I chose for the project is slightly inaccurate; I know).

This project is supposed to send an email when the Internet is down and send another one when it is up again. Such, the  exact time it failed is known and one gets a notification when it is back up (so I don't need to check manually every minute).

# How To Build

Since the docker image is not publicly available, you will need to build it yourself. A Dockerfile is provided and can be run as usual:

`docker build .`

Building it locally requires npm:

```
npm install
npx nx build server
```

# How To Use

You will have to set up the server which has been built. Additionally, it will need node to run and configurations, which can be given via `.env` files or   environment variables. You can see a list of configurations in `env.example`.

You will need an SMTP server to run this

When the server is set up on a remote machine reachable from your home network (but not contained in it) you can now send a `POST` request to the `/register` endpoint. The body must contain the email Address to notify you.
```
{email: "my-email@example.com"}
```

The email will receive an email right away, asking to verify the given email. Click the link to verify. It will only send if verified.

The response to the registration request will contain a `clientSecret`. With this we can send a life signal.

To send a life signal, the `GET` endpoint `/lifeSignal?clientSecret=your-client-secret` is given. You need to put in the client secret that you received.

The first life signal will start the tracking and send an email with the next full minute. It will check for a life signal every 2.5 minutes. How often you send one depends on you, but it should be more than once per 2.5 minutes. I, personally, use every minute for ease of use.

If you have a Linux computer running in your home network, that may be the ideal candidate for sending the life signal. Something that is running either way or requires low energy (i.e. Raspberry Pi) is ideal.

You can log into the machine and configure a cronjob. You can do this with the `crontab -e` command. In there, you can set it up to send a life signal every minute like this:

```
*/1 * * * * curl https://example.com/lifeSignal?clientSecret=your-client-secret
```

Note that you need to adjust the address to your location and use your client secret again. You will also need curl with this setup, but other clients will work just as well, such as wget.


