The login duration for the blog app is controlled by a browser cookie named auth.

Previously, when you logged in, the application set the Max-Age of this cookie to 86400 seconds, which is exactly 1 day (24 hours). This is why you were being logged out after a while.

I have updated the login API (

src/pages/api/login.ts
) to drastically increase this duration. The Max-Age is now set to 315360000 seconds, which corresponds to roughly 10 years.

Here is what was changed in 

src/pages/api/login.ts
:

diff
- res.setHeader('Set-Cookie', `auth=true; Path=/; SameSite=Strict; Max-Age=86400`);
+ res.setHeader('Set-Cookie', `auth=true; Path=/; SameSite=Strict; Max-Age=315360000`);
With this change, your login will be good for as long as possible. You will only be logged out if you explicitly click the "Logout" button or if you clear your browser cookies!