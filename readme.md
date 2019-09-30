# CMS project API

## Intro

CMS project is made up of three parts:

- API
- Admin system
- Client

This project is the API part. It is developed upon Node.js/Express and MongoDB.

## Run on development mode

- MongoDB should be installed locally
- Start MongoDB: `./mongod.exe --dbpath="c:\mongo-data"`<br> _The command is to be run under mongodb's directory and --dbpath parameter can be varied from computer to computer_
- Start Node Server: `npm run dev`
- You need to create a super admin in database:

```
{
  email: 'your@email.com',
  firstname: 'your firstname',
  lastname: 'your lastname',
  username: 'sa',
  password: 'YourPassword',
  status: 1,
  role: 1
}
```

## API Documents

### Admin

- **POST** `URL/api/admins/login` - Admin login management system
- **POST** `URL/api/admins/logout` - Admin logout management system
- **GET** `URL/api/admins/me` - Get the admin's profile, auth token if he/she successfully logs in
- **POST** `URL/api/admins` - Create an admin, ONLY for super admin
- **GET** `URL/api/admins` - Get all admins, ONLY for super admin
- **GET** `URL/api/admins/find` - Find admin by email or username. It accepts below query parameters:
  - email, Find the admin with given email
  - username, Find the admin with given username
- **DELETE** `URL/api/admins/:id` - Delte an admin by id, ONLY for super admin
- **PATCH** `URL/api/admins/:id` - Update an admin by id - ONLY for super admin
- **POST** `URL/api/admins/changePassword` - Change password
- ** POST** `URL/api/admins/resetPassword` - Reset password, ONLY for super admin

### Category

- **POST** `URL/api/categories` - Create a new category
- **GET** `URL/api/categories` - Get all categories list
- **GET** `URL/api/categories/:id` - Get a category by id
- **DELETE** `URL/api/categories/:id` - Delete a category by id. If there's one or more posts under the category, deletion is not allowed.
- **PATCH** `URL/api/categories/:id` - Update a category by id

### Post

- **POST** `URL/api/posts` - Create a new post
- **GET** `URL/api/posts` - Get posts list based on parameters provided.<br>
  It accepts several query parameters:
  - all, if `all='all'` return all posts without pagination.
  - status, if `status=1` only return the posts with status = 1(published) otherwise returns all posts no matter what status is
  - page, return the page specified. If no value is specified, one page is set by default.
  - category, return posts under the category with the specified id
  - tag, return posts under the tag with the specified id.
- **GET** `URL/api/posts/:id` - Get a post by id
- **DELETE** `URL/api/posts/:id` - Delete a post by id.
- **PATCH** `URL/api/posts/:id` - Update a post by id

### Tag

- **POST** `URL/api/tags` - Create a new tag
- **GET** `URL/api/tags` - Get all tags list
- **GET** `URL/api/tags/:id` - Get a tag by id
- **DELETE** `URL/api/tags/:id` - Delete a tag by id. If there's one or more posts under the tag, deletion is not allowed.
- **PATCH** `URL/api/tags/:id` - Update a tag by id

### Comment

- **POST** `URL/api/comments` - Create a new comment
- **GET** `URL/api/comments` - Get all comments list, only for admin purpose
- **GET** `URL/api/comments/post/:id` - Get comments under a post with specified id,
- **GET** `URL/api/comments/:id` - Get a comment by id
- **DELETE** `URL/api/comments/:id` - Delete a comment by id
- **PATCH** `URL/api/comments/:id` - Update a comment by id
