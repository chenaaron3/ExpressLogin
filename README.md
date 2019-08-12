# ExpressLogin  
Setting up Database on localhost:
- Download XAMPP
- Open the XAMPP Control Panel
- Click on User accounts tab
- Add user account with username and password
- Change environment variables in .env

Setting up Database on Heroku:
- Creating Database
    - Open a project on Heroku
    - Go to Resources tab
    - Add ClearDB MySQL in Resources
- Configuring Database
    - Go to Settings tab
    - Click Reveal Config Vars
    - Match CLEARDB_DATABASE_URL into mysql://user:pass@dbhost/dbname?reconnect=true
    - Enter the user, pass, dbhost, dbname as config variables

Setting up Github Remote:
- Use ssh link
- Make sure .idea file is not tracked
    - (git rm -cached -r .idea)
    
Setting up Heroku Remote:  
- Generate SSH key 
    - (ssh-keygen -t rsa)  
- Add key to account 
    - (heroku keys:add)  
- Add HOME as user environment variable
    - set it to %USERPROFILE%
- Change default from HTTP to SSH 
    - (git config --global url.ssh://git@heroku.com/.insteadOf https://git.heroku.com/)

Notes:
- HTML: provides page content
- CSS: formats page content
- Javascript: power express app and route urls to pages
    - jQuery: used in js to move components
    - ajax: used in js for front end to call backend functions and handle response
- paths in ejs file are relative to the endpoint that renders it
- cookies store information in current session
- res.cookie(key, value) to save cookie
- req.cookies[key] to get cookie
    