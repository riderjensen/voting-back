# Polling Backend

This backend is an API that is for the voting system. It manages users, polls, and votes. It includes JWT authentication, admin routes, and vote management. It also includes a mailing system with mailing templates using maizzle.

## First time setup with mySQL:

1. Log in to the container
2. `mysql -uroot -p`
3. Enter the password `root`
4. `use mysql;`
5. `GRANT ALL ON *.* TO 'user'@'%';`
