const users = [
  {
    id: 1,
    name: "Rebekah Johnson",
    email: "Glover12345@gmail.com",
    password: "123qwe",
  },
  {
    id: 2,
    name: "Fabian Predovic",
    email: "Connell29@gmail.com",
    password: "password",
  },
  {
    id: 3,
    name: "new user 1",
    email: "yhkyhk92@gmail.com",
    password: "1q2w3e4r"
  },
  {
    id: 4,
    name: "new user 2",
    email: "yhkyhk92@naver.com",
    password: "1q2w3e4r"
  },
];

const posts = [
  {
    id: 1,
    title: "간단한 HTTP API 개발 시작!",
    imageUrl: undefined,
    content: "Node.js에 내장되어 있는 http 모듈을 사용해서 HTTP server를 구현.",
    userId: 1,
  },
  {
    id: 2,
    title: "HTTP의 특성",
    imageUrl: undefined,
    content: "Request/Response와 Stateless!!",
    userId: 1,
  },
  {
    id: 3,
    title: undefined,
    imageUrl: "내용 1",
    content: "sampleContent3",
    userId: 1,
  },
  {
    id: 4,
    title: undefined,
    imageUrl: "내용2",
    content: "sampleContent4",
    userId: 4,
  },
];

// users와 posts 통합 테이블
const data = [];
for (let i = 0; i < users.length; i++) {
  for (let j = 0; j < posts.length; j++) {
    if (users[i].id === posts[j].userId) {
      data.push({
        userId: users[i].id,
        userName: users[i].name,
        postingId: posts[j].id,
        postingTitle: posts[j].title,
        postingImageUrl: posts[j].imageUrl,
        postingContent: posts[j].content,
      })
    }
  }
}


const http = require("http");
const server = http.createServer();

const httpRequestListener = function (request, response) {
  const { url, method } = request;
  if (method === "POST") {
    if (url === "/users") {
      let body = '';
      request.on('data', (data) => {body += data});
      request.on('end', () => {
        const user = JSON.parse(body);
        users.push({
          id: user.id,
          name: user.name,
          email: user.email,
          password: user.password
        });
        response.writeHead(200, { "content-Type": "application/json"});
        response.end(JSON.stringify({message: 'userCreated'}));
      });
    } else if (url === "/posts") {
      let body = '';
      request.on('data',(data) => {body += data});
      request.on('end', () => {
        const post = JSON.parse(body);
        posts.push({
          id: post.id,
          title: post.title,
          content: post.content,
          userId: post.userId
        });
        response.writeHead(200, { "content-Type": "application/json"});
        response.end(JSON.stringify({message: 'postCreated'}))
      })
    }
  } else if (method === "GET") {
    if (url === '/data') {
      response.writeHead(200, { "content-Type": "application/json"});
      response.end(JSON.stringify({ data }));
    } 
  } else if (method === "PATCH") {
    let body ='';
    if (url === '/posts') {
      request.on('data',(data) => {body += data});
      request.on('end', () => {
        const patch = JSON.parse(body);
        posts.forEach( item => {
          if(item.id === patch.id) {
            item.content = patch.content
          }
        });
        data.forEach( item => {
          if(item.postingId === patch.id) {
            item.postingContent = patch.content
          }
        });
        response.writeHead(200, { "content-Type": "application/json"});
        response.end(JSON.stringify({ data : data[patch.id-1] }))
      });
    }
  } else if (method === "DELETE") {
    let body = ''
    if (url === '/posts') {
      request.on('data',(data) => {body += data});
      request.on('end', () => {
        const del = JSON.parse(body);
        posts.splice(del.id-1,1);
        data.splice(del.id-1,1);
        // posts.forEach( item => {
        //   if(item.id === parseInt(del.id)) {
        //     delete item
        //   }
        // });
        // data.forEach( item => {
        //   if(item.postingId === parseInt(del.id)) {
        //     delete item
        //   }
        // });
        response.writeHead(200, { "content-Type": "application/json"});
        response.end(JSON.stringify({ message : "postingDeleted" }));
      });
    }
  }
}

server.on("request", httpRequestListener);

server.listen(8000, '127.0.0.1', function() {
  console.log('Listening to requests on port 8000');
});